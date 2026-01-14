import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { tags } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
import { getSession } from "@/lib/auth/utils"

export async function GET(request: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json(
        { error: "Unauthorized" }, 
        { status: 401 }
    )
  }

  const userTags = await db.query.tags.findMany(
    {
    where: eq(tags.ownerId, session.user.id),
    orderBy: [desc(tags.createdOn)],
  }
)

  return NextResponse.json(userTags)
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json(
        { error: "Unauthorized" },
         { status: 401 })
  }


  const body = await request.json()
  const { label, backgroundColor, textColor } = body

  const [newTag] = await db.insert(tags).values(
    {
    ownerId: session.user.id,
    label,
    backgroundColor: backgroundColor || "#D1D5DB",
    textColor: textColor || "#374151",
  }
).returning()


  return NextResponse.json(newTag)
}