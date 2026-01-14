import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { todoLists } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
import { getSession } from "@/lib/auth/utils"

export async function GET(request: NextRequest) {
  const session = await getSession()
  if (!session) 
    {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const lists = await db.query.todoLists.findMany(
    {
    where: eq(todoLists.ownerId, session.user.id),
    orderBy: [desc(todoLists.createdOn)],
  }
)

  return NextResponse.json(lists)
}

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json(
        { error: "Unauthorized" }, 
        { status: 401 }
    )
  }

  try {
    const body = await request.json()
    const { title, themeColor } = body

    console.log("Creating list with:",
         { title, themeColor, userId: session.user.id })

    const [newList] = await db.insert(todoLists).values(
        {
      ownerId: session.user.id,
      title,
      themeColor: themeColor || "#a8d5ba",
    }
).returning()

    console.log("List created successfully:", newList)



    
    return NextResponse.json(newList)
  } catch (error) 
  {
    console.error("Error creating list:", error)
    return NextResponse.json({ error: "Failed to create list", details: String(error) }, { status: 500 })
  }
}