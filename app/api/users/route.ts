import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { users, todos } from "@/lib/db/schema"
import { eq, desc, count } from "drizzle-orm"
import { getSession } from "@/lib/auth/utils"

// GET /api/users - Get all users with their task counts (Admin/Manager only)
export async function GET(request: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Only admin and manager can access this endpoint
  if (session.user.userRole !== "admin" && session.user.userRole !== "manager") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    // Get all users with their task statistics
    const usersWithTasks = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        userRole: users.userRole,
        createdAt: users.createdAt,
        taskCount: count(todos.id)
      })
      .from(users)
      .leftJoin(todos, eq(users.id, todos.ownerId))
      .groupBy(users.id, users.name, users.email, users.userRole, users.createdAt)
      .orderBy(desc(users.createdAt))

    // Get detailed tasks for each user
    const usersWithDetailedTasks = await Promise.all(
      usersWithTasks.map(async (user) => {
        const userTasks = await db
          .select({
            id: todos.id,
            name: todos.name,
            state: todos.state,
            dueAt: todos.dueAt,
            createdOn: todos.createdOn
          })
          .from(todos)
          .where(eq(todos.ownerId, user.id))
          .orderBy(desc(todos.createdOn))
          .limit(5) // Limit to recent 5 tasks per user

        // Calculate task statistics
        const taskStats = {
          draft: 0,
          in_progress: 0,
          completed: 0,
          total: userTasks.length
        }

        userTasks.forEach((task) => {
          if (task.state === "draft") taskStats.draft++
          else if (task.state === "in_progress") taskStats.in_progress++
          else if (task.state === "completed") taskStats.completed++
        })

        return {
          ...user,
          tasks: userTasks,
          taskStats
        }
      })
    )

    return NextResponse.json(usersWithDetailedTasks)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}