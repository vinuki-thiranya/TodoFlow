import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { todos } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { getSession } from "@/lib/auth/utils"

// PATCH /api/todos/[id] - Update todo

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
       { status: 401 }
      )
  }

  const { id: todoId } = await params


  try {
    const body = await request.json()
    console.log("Updating todo with body:", body)

    // Process the body to ensure proper data types
    const processedBody: any = { ...body }
    
    // Handle date conversion
    if (processedBody.dueAt) {
      processedBody.dueAt = new Date(processedBody.dueAt)
    }
    
    // Ensure description is either string or null
    if (processedBody.description === "") {
      processedBody.description = null
    }

    console.log("Processed body:", processedBody)

    // Check if todo exists and user has permission
    const [existingTodo] = await db
      .select()
      .from(todos)
      .where(eq(todos.id, todoId))

    if (!existingTodo) {
      return NextResponse.json(
        { error: "Todo not found" },
         { status: 404 })
    }

    // Check permissions: user can only update their own todos
    if (session.user.userRole === "user" && existingTodo.ownerId !== session.user.id) {
      return NextResponse.json(
        { error: "You can only update your own todos" },
        { status: 403 }
      )
    }

    // Update todo
    const [updatedTodo] = await db
      .update(todos)
      .set({
        ...processedBody,
        updatedOn: new Date(),
      })
      .where(eq(todos.id, todoId))
      .returning()



    console.log("Updated todo:", updatedTodo)

    return NextResponse.json(updatedTodo)
  } catch (error) {

    console.error("Error updating todo:", error)
    return NextResponse.json({ error: "Failed to update todo" }, { status: 500 })
  }
}


// DELETE /api/todos/[id] - Role-based deletion
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
       { status: 401 })
  }

  const { id: todoId } = await params

  try {
    // Get the todo
    const [todo] = await db.select().from(todos).where(eq(todos.id, todoId))

    if (!todo) {
      return NextResponse.json(
        { error: "Todo not found" }, 
        { status: 404 })
    }



    // Role-based permission checks
    switch (session.user.userRole) {
      case "user":
        // Users can only delete their own draft todos
        if (todo.ownerId !== session.user.id) {
          return NextResponse.json(
            { error: "You can only delete your own todos" },
            { status: 403 }
          )
        }

        if (todo.state !== "draft") {
          return NextResponse.json(
            { error: "Users can only delete draft todos" },
            { status: 403 }
          )
        }
        break


      case "manager":
        // Managers cannot delete any todos
        return NextResponse.json(
          { error: "Managers cannot delete todos" },
          { status: 403 }
        )

      case "admin":

        // Admins can delete any todo regardless of state
        break

      default:
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Delete the todo
    await db.delete(todos).where(eq(todos.id, todoId))



    return NextResponse.json({ message: "Todo deleted successfully" })
  } catch (error) {
    
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    )
  }
}
