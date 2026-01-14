import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { notes } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { getSession } from "@/lib/auth/utils"

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  await db.delete(notes).where(
    and(
      eq(notes.id, id),
      eq(notes.ownerId, session.user.id)
    )
  )

  return NextResponse.json({ success: true })
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const body = await request.json()

  const [updatedNote] = await db.update(notes)
    .set({
      ...body,
      updatedOn: new Date(),
    })
    .where(
      and(
        eq(notes.id, id),
        eq(notes.ownerId, session.user.id)
      )
    )
    .returning()

  return NextResponse.json(updatedNote)
}
