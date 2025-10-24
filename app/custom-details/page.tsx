"use client"

import { useEffect, useMemo, useState } from "react"

type CountsByDuration = {
  [duration: string]: { [id: string]: number }
}

const DURATIONS = ["8", "4", "2", "1", "2days"] as const

export default function CustomDetailsSummaryPage() {
  const [customDetails, setCustomDetails] = useState<{ [itemId: string]: { id: string; text: string }[] }>({})
  const [customItems, setCustomItems] = useState<{
    [phaseId: string]: {
      actions: { id: string; title: string }[]
      deliverables: { id: string; title: string }[]
      aiBoosts: { id: string; title: string }[]
    }
  }>({})
  const [counts, setCounts] = useState<CountsByDuration>({})

  // Load custom details from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("customDetails")
      if (saved) setCustomDetails(JSON.parse(saved))
      const savedItems = localStorage.getItem("customItems")
      if (savedItems) setCustomItems(JSON.parse(savedItems))
    } catch {
      // ignore
    }
  }, [])

  const allDetailIds = useMemo(() => {
    const ids = new Set<string>()
    Object.values(customDetails).forEach((arr) => arr.forEach((d) => ids.add(d.id)))
    return Array.from(ids)
  }, [customDetails])

  // Fetch counts for all durations
  useEffect(() => {
    if (allDetailIds.length === 0) return
    const controller = new AbortController()
    const run = async () => {
      const next: CountsByDuration = {}
      for (const d of DURATIONS) {
        try {
          const url = new URL(`/api/likes`, window.location.origin)
          url.searchParams.set("duration", d)
          url.searchParams.set("ids", allDetailIds.join(","))
          const res = await fetch(url.toString(), { cache: "no-store", signal: controller.signal })
          if (res.ok) {
            const data = (await res.json()) as { counts: Record<string, number> }
            next[d] = data.counts
          }
        } catch {
          // ignore fetch error per duration
        }
      }
      setCounts(next)
    }
    run()
    return () => controller.abort()
  }, [allDetailIds])

  const [serverDetails, setServerDetails] = useState<{
    detail_id: string
    item_id: string
    section: string
    parent_title: string | null
    text: string
    author: string | null
    created_at: number
  }[]>([])

  useEffect(() => {
    fetch("/api/custom-details", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.resolve({ rows: [] })))
      .then((d) => setServerDetails(d.rows || []))
      .catch(() => setServerDetails([]))
  }, [])

  // Fallback: merge parent/phase info from item metadata if server didn't store it
  const itemsMeta = useMemo(() => {
    try {
      const raw = localStorage.getItem("itemsMeta")
      return raw ? (JSON.parse(raw) as { [id: string]: { title: string; phaseTitle: string; allowedDurations: string[]; section: string } }) : {}
    } catch {
      return {}
    }
  }, [])

  const rows = useMemo(() => {
    const out: { id: string; text: string; category: string; parent: string; phase: string; author: string; perDuration: { [k: string]: number } }[] = []
    const idToText: { [id: string]: string } = {}
    for (const list of Object.values(customDetails)) {
      for (const d of list) idToText[d.id] = d.text
    }
    const ids = new Set<string>(allDetailIds)
    // augment with server rows so things added elsewhere appear
    serverDetails.forEach((r) => ids.add(r.detail_id))
    const findParentFromLocal = (detailId: string) => {
      // look in local customDetails map first
      for (const [itemId, list] of Object.entries(customDetails)) {
        if ((list || []).some((d) => d.id === detailId)) {
          const meta = itemsMeta[itemId]
          return { itemId, parentTitle: meta?.title || "", phaseTitle: meta?.phaseTitle || "", allowed: meta?.allowedDurations }
        }
      }
      // try scanning phases static structure
      const check = (arr?: { id: string; title: string; details?: { id: string }[]; weeks?: (number | "2days")[] }[], phaseTitle?: string) => {
        for (const it of arr || []) {
          if ((it.details || []).some((d) => d.id === detailId)) {
            return { itemId: it.id, parentTitle: it.title, phaseTitle: phaseTitle || "", allowed: (it.weeks || []).map((w) => String(w)) }
          }
        }
        return undefined
      }
      // NOTE: We can't import phases here; rely on itemsMeta fallback
      return { itemId: "", parentTitle: "", phaseTitle: "", allowed: undefined as string[] | undefined }
    }
    for (const id of Array.from(ids)) {
      const per: { [k: string]: number } = {}
      const srv = serverDetails.find((r) => r.detail_id === id)
      const meta = itemsMeta[(srv && srv.item_id) || ""]
      const localParent = !srv ? findParentFromLocal(id) : undefined
      const allowed = srv?.allowed_durations ? (JSON.parse(srv.allowed_durations) as string[]) : meta?.allowedDurations || localParent?.allowed
      for (const d of DURATIONS) {
        if (allowed && !allowed.includes(d)) per[d] = NaN
        else per[d] = counts[d]?.[id] ?? 0
      }
      // Infer category from id
      let category = ""
      if (id.startsWith("action-")) category = "Action"
      else if (id.startsWith("deliv-")) category = "Deliverable"
      else if (id.startsWith("ai-")) category = "AI boost"
      else if (id.startsWith("custom-")) {
        // custom-<phaseId>-<section>-...-detail-...
        const parts = id.split("-")
        const section = parts[2] || ""
        if (section === "actions") category = "Action"
        else if (section === "deliverables") category = "Deliverable"
        else if (section === "aiBoosts") category = "AI boost"
      }
      out.push({
        id,
        text: srv?.text || idToText[id] || id,
        category,
        parent: srv?.parent_title || meta?.title || localParent?.parentTitle || "",
        phase: srv?.phase_title || meta?.phaseTitle || localParent?.phaseTitle || "",
        author: srv?.author || "",
        perDuration: per,
      })
    }
    return out
  }, [customDetails, allDetailIds, counts, serverDetails, itemsMeta])

  const itemRows = useMemo(() => {
    // Flatten custom items and compute per-duration sums from their custom details
    type Row = { id: string; title: string; category: string; perDuration: { [k: string]: number } }
    const out: Row[] = []
    const addItems = (items: { id: string; title: string }[] | undefined, category: string) => {
      if (!items) return
      for (const it of items) {
        const per: { [k: string]: number } = {}
        const details = customDetails[it.id] || []
        for (const d of DURATIONS) {
          per[d] = details.reduce((acc, det) => acc + (counts[d]?.[det.id] ?? 0), 0)
        }
        out.push({ id: it.id, title: it.title, category, perDuration: per })
      }
    }
    for (const phase of Object.values(customItems)) {
      addItems(phase.actions, "Action")
      addItems(phase.deliverables, "Deliverable")
      addItems(phase.aiBoosts, "AI boost")
    }
    return out
  }, [customItems, customDetails, counts])

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-bold mb-4">Custom details summary</h1>
      {rows.length === 0 ? (
        <p className="text-zinc-400">No custom details found in this browser.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-zinc-800 text-sm">
            <thead className="bg-zinc-900">
              <tr>
                <th className="px-3 py-2 text-left border-b border-zinc-800">Detail</th>
                <th className="px-3 py-2 text-left border-b border-zinc-800">Parent</th>
                <th className="px-3 py-2 text-left border-b border-zinc-800">Category</th>
                <th className="px-3 py-2 text-left border-b border-zinc-800">Phase</th>
                <th className="px-3 py-2 text-left border-b border-zinc-800">Author</th>
                {DURATIONS.map((d) => (
                  <th key={d} className="px-3 py-2 text-left border-b border-zinc-800 whitespace-nowrap">
                    {d === "2days" ? "2 days" : `${d} weeks`}
                  </th>
                ))}
                <th className="px-3 py-2 text-left border-b border-zinc-800">Total</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const total = DURATIONS.reduce((acc, d) => acc + (r.perDuration[d] || 0), 0)
                return (
                  <tr key={r.id} className="odd:bg-zinc-950">
                    <td className="px-3 py-2 align-top border-b border-zinc-900">{r.text}</td>
                    <td className="px-3 py-2 align-top border-b border-zinc-900 text-zinc-300">{r.parent}</td>
                    <td className="px-3 py-2 align-top border-b border-zinc-900 text-zinc-400">{r.category || ""}</td>
                    <td className="px-3 py-2 align-top border-b border-zinc-900 text-zinc-400">{r.phase}</td>
                    <td className="px-3 py-2 align-top border-b border-zinc-900 text-zinc-500">{r.author}</td>
                    {DURATIONS.map((d) => (
                      <td key={d} className="px-3 py-2 align-top border-b border-zinc-900">
                        {Number.isNaN(r.perDuration[d]) ? "N/A" : r.perDuration[d] || 0}
                      </td>
                    ))}
                    <td className="px-3 py-2 align-top border-b border-zinc-900 font-medium">{total}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <h2 className="text-xl font-semibold mt-8 mb-3">Custom items</h2>
      {itemRows.length === 0 ? (
        <p className="text-zinc-400">No custom items found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-zinc-800 text-sm">
            <thead className="bg-zinc-900">
              <tr>
                <th className="px-3 py-2 text-left border-b border-zinc-800">Item</th>
                <th className="px-3 py-2 text-left border-b border-zinc-800">Category</th>
                {DURATIONS.map((d) => (
                  <th key={d} className="px-3 py-2 text-left border-b border-zinc-800 whitespace-nowrap">
                    {d === "2days" ? "2 days" : `${d} weeks`}
                  </th>
                ))}
                <th className="px-3 py-2 text-left border-b border-zinc-800">Total</th>
              </tr>
            </thead>
            <tbody>
              {itemRows.map((r) => {
                const total = DURATIONS.reduce((acc, d) => acc + (r.perDuration[d] || 0), 0)
                return (
                  <tr key={r.id} className="odd:bg-zinc-950">
                    <td className="px-3 py-2 align-top border-b border-zinc-900">{r.title}</td>
                    <td className="px-3 py-2 align-top border-b border-zinc-900 text-zinc-400">{r.category}</td>
                    {DURATIONS.map((d) => (
                      <td key={d} className="px-3 py-2 align-top border-b border-zinc-900">
                        {r.perDuration[d] || 0}
                      </td>
                    ))}
                    <td className="px-3 py-2 align-top border-b border-zinc-900 font-medium">{total}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
      <p className="text-zinc-500 mt-4 text-xs">
        This view lists custom details and custom items saved in this browser (localStorage) and shows like counts pulled
        from the server per duration.
      </p>
    </div>
  )
}


