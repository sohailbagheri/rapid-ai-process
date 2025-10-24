import { NextRequest, NextResponse } from "next/server"
import { listCustomDetails, upsertCustomDetail } from "@/lib/db"

export async function GET() {
  const rows = listCustomDetails()
  return NextResponse.json({ rows })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { detail_id, item_id, section, parent_title, phase_title, allowed_durations, text, author } = body as {
      detail_id: string
      item_id: string
      section: string
      parent_title?: string
      phase_title?: string
      allowed_durations?: string[]
      text: string
      author?: string
    }
    if (!detail_id || !item_id || !section || !text) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }
    upsertCustomDetail({ detail_id, item_id, section, parent_title, phase_title, allowed_durations, text, author })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: "Bad Request" }, { status: 400 })
  }
}


