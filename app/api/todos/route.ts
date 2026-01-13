import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { todos } from "@/lib/db/schema"
import { eq, and, desc } from "drizzle-orm"
import { getSession } from "@/lib/auth/utils"

// GET /api/todos - with role-based filtering
export async function GET(request: NextRequest) {
  const session = await getSession()
  if (!session) {

    return NextResponse.json({ error: "Unauthorized" }, 
      { status: 401 })
  }

  const { searchParams } = new URL(request.url)

  const listId = searchParams.get("listId")

  try {

    let query: any = db.select().from(todos)


    // Role-based filtering
    if (session.user.userRole === "admin" 
           || session.user.userRole === "manager") {
      if (listId) query = query.where(eq(todos.listId, listId))
    } else 
  {
      if (listId)
        query = query.where(
          and(eq(todos.ownerId, session.user.id), 
          eq(todos.listId, listId))
        )

      else query = query.where(eq(todos.ownerId, session.user.id))
    }


    const result = await query.orderBy(desc(todos.createdOn))
    return NextResponse.json(result)
  } catch (error)
  
  {

    return NextResponse.json({ error:
       "Failed to fetch todos" },
         { status: 500 })
  }
}



// POST /api/todos - Only users can create todos
export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session)
     {
    return NextResponse.json({ error:
       "Unauthorized" },
         { status: 401 })
  }


  // Only normal users can create todos
  if (session.user.userRole !== "user") {
    return NextResponse.json(
      { error: 
        "Only users can create todos" },
      { status: 403 }
    )
  }

  
  try {
    const body = await request.json()
    const { name, listId, description, state, dueAt } = body

    const [newTodo] = await db
      .insert(todos)
      .values({
        ownerId: session.user.id,
        name,
        listId,
        description,
        state: state || "draft",
        dueAt: dueAt ? new Date(dueAt) : undefined,
      })
      .returning()

      
    return NextResponse.json(newTodo, { status: 201 })
  } catch (error) 
  {
    return NextResponse.json(
      { error: 
        "Failed to create todo" },
      { status: 500 }
    )
  }
}
