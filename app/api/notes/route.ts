import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { notes } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
import { getSession } from "@/lib/auth/utils"

// GET /api/notes - Fetch sticky notes for current user
export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const result = await db
      .select()
      .from(notes)
      .where(eq(notes.ownerId, session.user.id))
      .orderBy(desc(notes.createdOn))
    
    return NextResponse.json(result)
  } catch (error) {
    console.error("Failed to fetch notes:", error)
    return NextResponse.json({ error: "Failed to fetch notes" }, { status: 500 })
  }
}

// POST /api/notes - Create a new sticky note
export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { title, content, themeColor } = body

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    const [newNote] = await db
      .insert(notes)
      .values({
        ownerId: session.user.id,
        title,
        content,
        themeColor: themeColor || "#FEF08A",
      })
      .returning()

    return NextResponse.json(newNote, { status: 201 })
  } catch (error) {
    console.error("Failed to create note:", error)
    return NextResponse.json({ error: "Failed to create note" }, { status: 500 })
  }
}
