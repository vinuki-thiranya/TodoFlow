import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { notes } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { getSession } from "@/lib/auth/utils"

// DELETE /api/notes/[id] - Delete a sticky note
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  try {
    const deleted = await db
      .delete(notes)
      .where(and(eq(notes.id, id), eq(notes.ownerId, session.user.id)))
      .returning()

    if (deleted.length === 0) {
      return NextResponse.json({ error: "Note not found or unauthorized" }, { status: 404 })
    }

    return NextResponse.json({ message: "Note deleted successfully" })
  } catch (error) {
    console.error("Failed to delete note:", error)
    return NextResponse.json({ error: "Failed to delete note" }, { status: 500 })
  }
}

// PATCH /api/notes/[id] - Update a sticky note (e.g. position or content)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  try {
    const body = await request.json()
    const { title, content, themeColor, x, y } = body

    const updated = await db
      .update(notes)
      .set({
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(themeColor !== undefined && { themeColor }),
        ...(x !== undefined && { x }),
        ...(y !== undefined && { y }),
        updatedOn: new Date(),
      })
      .where(and(eq(notes.id, id), eq(notes.ownerId, session.user.id)))
      .returning()

    if (updated.length === 0) {
      return NextResponse.json({ error: "Note not found or unauthorized" }, { status: 404 })
    }

    return NextResponse.json(updated[0])
  } catch (error) {
    console.error("Failed to update note:", error)
    return NextResponse.json({ error: "Failed to update note" }, { status: 500 })
  }
}
