import { NextRequest, NextResponse } from "next/server"
import { getCountsForDuration, increment, setCount, ensureSeed } from "@/lib/db"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const duration = searchParams.get("duration") || "8"
  const idsParam = searchParams.get("ids")
  if (idsParam) {
    const ids = idsParam
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
    for (const id of ids) ensureSeed(id, duration)
  }
  const counts = getCountsForDuration(duration)
  return NextResponse.json({ duration, counts })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { detailId, duration, action, value } = body as {
      detailId: string
      duration: string
      action?: "inc" | "dec" | "set"
      value?: number
    }

    if (!detailId || !duration) {
      return NextResponse.json({ error: "Missing detailId or duration" }, { status: 400 })
    }

    if (action === "set" && typeof value === "number") {
      setCount(detailId, duration, value)
    } else {
      const delta = action === "dec" ? -1 : 1
      increment(detailId, duration, delta)
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: "Bad Request" }, { status: 400 })
  }
}


