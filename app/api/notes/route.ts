import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { notes } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
import { getSession } from "@/lib/auth/utils"

export async function GET(request: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userNotes = await db.query.notes.findMany({
    where: eq(notes.ownerId, session.user.id),
    orderBy: [desc(notes.createdOn)],
  })

  return NextResponse.json(userNotes)
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { title, content, themeColor } = body

  const [newNote] = await db.insert(notes).values({
    ownerId: session.user.id,
    title,
    content,
    themeColor: themeColor || "#FEF08A",
  }).returning()

  return NextResponse.json(newNote)
}
