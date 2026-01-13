import {
  pgTable,
  text,
  timestamp,
  integer,
  boolean,
  uuid,
  pgEnum,
} from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

// Enums
export const userRole = pgEnum("user_role", ["user", "manager", "admin"])
export const todoState = pgEnum("todo_state", [
  "draft",
  "in_progress",
  "completed",
])
export const listTheme = pgEnum("list_theme", [
  "#EF4444",
  "#3B82F6",
  "#FBBF24",
])
export const noteTheme = pgEnum("note_theme", [
  "#FEF08A",
  "#A7F3D0",
  "#FCD34D",
  "#FBCFE8",
])

// Users
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  fullName: text("full_name"),
  email: text("email").notNull().unique(),
  isEmailVerified: boolean("is_email_verified").default(false),
  avatarUrl: text("avatar_url"),
  role: userRole("role").default("user"),
  createdOn: timestamp("created_on").defaultNow(),
  updatedOn: timestamp("updated_on").defaultNow(),
})

export const usersRelations = relations(users, ({ many }) => ({
  lists: many(todoLists),
  todos: many(todos),
  tags: many(tags),
  notes: many(notes),
}))

// Sessions (Better Auth)
export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at").notNull(),
})

// Todo Lists
export const todoLists = pgTable("todo_lists", {
  id: uuid("id").primaryKey().defaultRandom(),
  ownerId: text("owner_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  title: text("title").notNull(),
  themeColor: listTheme("theme_color").default("#EF4444"),
  orderIndex: integer("order_index").default(0),

  createdOn: timestamp("created_on").defaultNow(),
  updatedOn: timestamp("updated_on").defaultNow(),
})

export const todoListsRelations = relations(todoLists, ({ one, many }) => ({
  owner: one(users, {
    fields: [todoLists.ownerId],
    references: [users.id],
  }),
  todos: many(todos),
}))

// Todos
export const todos = pgTable("todos", {
  id: uuid("id").primaryKey().defaultRandom(),
  ownerId: text("owner_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  listId: uuid("list_id")
    .notNull()
    .references(() => todoLists.id, { onDelete: "cascade" }),

  name: text("name").notNull(),
  description: text("description"),
  state: todoState("state").default("draft"),
  dueAt: timestamp("due_at"),
  orderIndex: integer("order_index").default(0),

  createdOn: timestamp("created_on").defaultNow(),
  updatedOn: timestamp("updated_on").defaultNow(),
})

export const todosRelations = relations(todos, ({ one, many }) => ({
  owner: one(users, {
    fields: [todos.ownerId],
    references: [users.id],
  }),
  list: one(todoLists, {
    fields: [todos.listId],
    references: [todoLists.id],
  }),
  tags: many(todoTags),
  items: many(todoItems),
}))

// Tags
export const tags = pgTable("tags", {
  id: uuid("id").primaryKey().defaultRandom(),
  ownerId: text("owner_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  label: text("label").notNull(),
  backgroundColor: text("background_color").default("#D1D5DB"),
  textColor: text("text_color").default("#374151"),

  createdOn: timestamp("created_on").defaultNow(),
})

export const tagsRelations = relations(tags, ({ one, many }) => ({
  owner: one(users, {
    fields: [tags.ownerId],
    references: [users.id],
  }),
  todos: many(todoTags),
}))


  // Todo - Tags (junction)

export const todoTags = pgTable("todo_tags", {
  todoId: uuid("todo_id")
    .notNull()
    .references(() => todos.id, { onDelete: "cascade" }),

  tagId: uuid("tag_id")
    .notNull()
    .references(() => tags.id, { onDelete: "cascade" }),
})

export const todoTagsRelations = relations(todoTags, ({ one }) => ({
  todo: one(todos, {
    fields: [todoTags.todoId],
    references: [todos.id],
  }),
  tag: one(tags, {
    fields: [todoTags.tagId],
    references: [tags.id],
  }),
}))


   //Todo Items (Subtasks)
export const todoItems = pgTable("todo_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  todoId: uuid("todo_id")
    .notNull()
    .references(() => todos.id, { onDelete: "cascade" }),

  title: text("title").notNull(),
  isCompleted: boolean("is_completed").default(false),
  orderIndex: integer("order_index").default(0),

  createdOn: timestamp("created_on").defaultNow(),
})

export const todoItemsRelations = relations(todoItems, ({ one }) => ({
  todo: one(todos, {
    fields: [todoItems.todoId],
    references: [todos.id],
  }),
}))


   //Notes (Sticky Notes)
export const notes = pgTable("notes", {
  id: uuid("id").primaryKey().defaultRandom(),
  ownerId: text("owner_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  title: text("title").notNull(),
  content: text("content"),
  themeColor: noteTheme("theme_color").default("#FEF08A"),

  x: integer("x").default(0),
  y: integer("y").default(0),

  createdOn: timestamp("created_on").defaultNow(),
  updatedOn: timestamp("updated_on").defaultNow(),
})

export const notesRelations = relations(notes, ({ one }) => ({
  owner: one(users, {
    fields: [notes.ownerId],
    references: [users.id],
  }),
}))
