// Try to use better-sqlite3; fall back to JSON files if native binding is unavailable
let Database: any
let usingSqlite = false
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  Database = require("better-sqlite3")
  // Allow disabling via env var
  usingSqlite = process.env.USE_SQLITE !== "0"
} catch {
  usingSqlite = false
}
import fs from "fs"
import path from "path"

const dbDir = path.join(process.cwd(), ".data")
const dbPath = path.join(dbDir, "likes.db")
const likesJsonPath = path.join(dbDir, "likes.json")
const detailsJsonPath = path.join(dbDir, "custom_details.json")

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

let _db: any = null
if (usingSqlite) {
  try {
    _db = new Database(dbPath)
  } catch {
    // Native bindings not present; fall back to JSON
    usingSqlite = false
  }
}
export const db = _db as any

if (usingSqlite) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS likes (
      id TEXT NOT NULL,
      duration TEXT NOT NULL,
      count INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (id, duration)
    );
    CREATE TABLE IF NOT EXISTS custom_details (
      detail_id TEXT PRIMARY KEY,
      item_id TEXT NOT NULL,
      section TEXT NOT NULL,
      parent_title TEXT,
      phase_title TEXT,
      allowed_durations TEXT,
      text TEXT NOT NULL,
      author TEXT,
      created_at INTEGER NOT NULL
    );
  `)
  try { db.exec("ALTER TABLE custom_details ADD COLUMN phase_title TEXT") } catch {}
  try { db.exec("ALTER TABLE custom_details ADD COLUMN allowed_durations TEXT") } catch {}
} else {
  // Ensure JSON files exist
  if (!fs.existsSync(likesJsonPath)) fs.writeFileSync(likesJsonPath, JSON.stringify({}))
  if (!fs.existsSync(detailsJsonPath)) fs.writeFileSync(detailsJsonPath, JSON.stringify([]))
}

// Deterministic helpers to generate per-id, per-duration seed values
export const baseForId = (id: string) => {
  let hash = 0
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0
  return (hash % 25) + 10 // 10..34
}

export const varyByDuration = (count: number, d: string) => {
  switch (d) {
    case "8":
      return Math.floor(count * 1.2)
    case "4":
      return Math.floor(count * 1.0)
    case "2":
      return Math.floor(count * 0.8)
    case "1":
      return Math.floor(count * 0.6)
    case "2days":
      return Math.max(0, Math.floor(count * 0.4))
    default:
      return count
  }
}

// Seed with different per-duration starting counts if empty
if (usingSqlite) {
  const rowCount = db.prepare("SELECT COUNT(*) as c FROM likes").get() as { c: number }
  if (rowCount.c === 0) {
    const durations = ["8", "4", "2", "1", "2days"]
    const exampleIds = [
      "action-0-1-detail-1",
      "action-0-1-detail-2",
      "deliv-0-1-detail-1",
      "ai-0-1-detail-1",
      "action-3-1-detail-1",
      "deliv-4-2-detail-1",
      "ai-6-1-detail-1",
    ]
    const insertSeed = db.prepare("INSERT INTO likes (id, duration, count) VALUES (?, ?, ?)")
    const insertMany = db.transaction(() => {
      for (const id of exampleIds) {
        const base = baseForId(id)
        for (const d of durations) insertSeed.run(id, d, varyByDuration(base, d))
      }
    })
    insertMany()
  }
} else {
  const raw = JSON.parse(fs.readFileSync(likesJsonPath, "utf-8")) as Record<string, number>
  if (Object.keys(raw).length === 0) {
    const durations = ["8", "4", "2", "1", "2days"]
    const exampleIds = [
      "action-0-1-detail-1",
      "action-0-1-detail-2",
      "deliv-0-1-detail-1",
      "ai-0-1-detail-1",
      "action-3-1-detail-1",
      "deliv-4-2-detail-1",
      "ai-6-1-detail-1",
    ]
    for (const id of exampleIds) {
      const base = baseForId(id)
      for (const d of durations) raw[`${d}::${id}`] = varyByDuration(base, d)
    }
    fs.writeFileSync(likesJsonPath, JSON.stringify(raw))
  }
}

export function getCountsForDuration(duration: string): Record<string, number> {
  const out: Record<string, number> = {}
  if (usingSqlite) {
    const rows = db.prepare("SELECT id, count FROM likes WHERE duration = ?").all(duration) as { id: string; count: number }[]
    for (const r of rows) out[r.id] = r.count
    return out
  }
  const raw = JSON.parse(fs.readFileSync(likesJsonPath, "utf-8")) as Record<string, number>
  for (const [k, v] of Object.entries(raw)) if (k.startsWith(`${duration}::`)) out[k.split("::")[1]] = v
  return out
}

export function increment(detailId: string, duration: string, delta: number) {
  if (usingSqlite) {
    const upsert = db.prepare(
      "INSERT INTO likes (id, duration, count) VALUES (?, ?, MAX(0, ?)) ON CONFLICT(id, duration) DO UPDATE SET count = MAX(0, likes.count + excluded.count)"
    )
    upsert.run(detailId, duration, Math.max(0, delta))
    return
  }
  const key = `${duration}::${detailId}`
  const raw = JSON.parse(fs.readFileSync(likesJsonPath, "utf-8")) as Record<string, number>
  const current = raw[key] || 0
  raw[key] = Math.max(0, current + (delta > 0 ? 1 : -1))
  fs.writeFileSync(likesJsonPath, JSON.stringify(raw))
}

export function setCount(detailId: string, duration: string, value: number) {
  if (usingSqlite) {
    const upsert = db.prepare(
      "INSERT INTO likes (id, duration, count) VALUES (?, ?, ?) ON CONFLICT(id, duration) DO UPDATE SET count = excluded.count"
    )
    upsert.run(detailId, duration, Math.max(0, value))
    return
  }
  const key = `${duration}::${detailId}`
  const raw = JSON.parse(fs.readFileSync(likesJsonPath, "utf-8")) as Record<string, number>
  raw[key] = Math.max(0, value)
  fs.writeFileSync(likesJsonPath, JSON.stringify(raw))
}

export function ensureSeed(detailId: string, duration: string) {
  if (usingSqlite) {
    const exists = db
      .prepare("SELECT 1 FROM likes WHERE id = ? AND duration = ? LIMIT 1")
      .get(detailId, duration) as any
    if (!exists) {
      const base = baseForId(detailId)
      const value = varyByDuration(base, duration)
      setCount(detailId, duration, value)
    }
    return
  }
  const key = `${duration}::${detailId}`
  const raw = JSON.parse(fs.readFileSync(likesJsonPath, "utf-8")) as Record<string, number>
  if (raw[key] === undefined) {
    const base = baseForId(detailId)
    raw[key] = varyByDuration(base, duration)
    fs.writeFileSync(likesJsonPath, JSON.stringify(raw))
  }
}

export type CustomDetailRow = {
  detail_id: string
  item_id: string
  section: string
  parent_title: string | null
  phase_title: string | null
  allowed_durations: string | null
  text: string
  author: string | null
  created_at: number
}

export function upsertCustomDetail(row: {
  detail_id: string
  item_id: string
  section: string
  parent_title?: string
  phase_title?: string
  allowed_durations?: string[]
  text: string
  author?: string
  created_at?: number
}) {
  if (usingSqlite) {
    const stmt = db.prepare(
      `INSERT INTO custom_details (detail_id, item_id, section, parent_title, phase_title, allowed_durations, text, author, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(detail_id) DO UPDATE SET
         item_id = excluded.item_id,
         section = excluded.section,
         parent_title = excluded.parent_title,
         phase_title = excluded.phase_title,
         allowed_durations = excluded.allowed_durations,
         text = excluded.text,
         author = excluded.author`
    )
    stmt.run(
      row.detail_id,
      row.item_id,
      row.section,
      row.parent_title ?? null,
      row.phase_title ?? null,
      row.allowed_durations ? JSON.stringify(row.allowed_durations) : null,
      row.text,
      row.author ?? null,
      row.created_at ?? Date.now()
    )
    return
  }
  const list = JSON.parse(fs.readFileSync(detailsJsonPath, "utf-8")) as any[]
  const idx = list.findIndex((r) => r.detail_id === row.detail_id)
  const rec = {
    detail_id: row.detail_id,
    item_id: row.item_id,
    section: row.section,
    parent_title: row.parent_title ?? null,
    phase_title: row.phase_title ?? null,
    allowed_durations: row.allowed_durations ? JSON.stringify(row.allowed_durations) : null,
    text: row.text,
    author: row.author ?? null,
    created_at: row.created_at ?? Date.now(),
  }
  if (idx >= 0) list[idx] = rec
  else list.push(rec)
  fs.writeFileSync(detailsJsonPath, JSON.stringify(list))
}

export function listCustomDetails(): CustomDetailRow[] {
  if (usingSqlite) {
    return db
      .prepare(
        `SELECT detail_id, item_id, section, parent_title, phase_title, allowed_durations, text, author, created_at FROM custom_details ORDER BY created_at DESC`,
      )
      .all() as CustomDetailRow[]
  }
  return JSON.parse(fs.readFileSync(detailsJsonPath, "utf-8")) as CustomDetailRow[]
}

