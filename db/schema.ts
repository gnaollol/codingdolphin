import {
  sqliteTable,
  text,
  integer,
  index,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

import { user } from "./auth-schema";

export const modules = sqliteTable(
  "modules",
  {
    id: text("id").primaryKey(),
    cacheKey: text("cache_key").notNull(),
    question: text("question").notNull(),
    title: text("title").notNull(),
    language: text("language").notNull(),
    style: text("style").notNull(),
    depth: text("depth").notNull(),
    content: text("content").notNull(),
    createdAt: integer("created_at").notNull(),
  },
  (t) => [
    uniqueIndex("idx_modules_cache_key").on(t.cacheKey),
    index("idx_modules_title").on(t.title),
  ],
);

export const attempts = sqliteTable(
  "attempts",
  {
    id: text("id").primaryKey(),
    visitorId: text("visitor_id").notNull(),
    userId: text("user_id").references(() => user.id),
    moduleId: text("module_id")
      .notNull()
      .references(() => modules.id),
    score: integer("score").notNull(),
    total: integer("total").notNull(),
    createdAt: integer("created_at").notNull(),
  },
  (t) => [
  index("idx_attempts_visitor_created").on(t.visitorId, t.createdAt),
  index("idx_attempts_user_created").on(t.userId, t.createdAt),
],
);

export const questionHistory = sqliteTable(
  "question_history",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    moduleId: text("module_id")
      .notNull()
      .references(() => modules.id, { onDelete: "cascade" }),
    question: text("question").notNull(),
    createdAt: integer("created_at").notNull(),
  },
  (t) => [index("idx_question_history_user_created").on(t.userId, t.createdAt)],
);

export const savedModules = sqliteTable(
  "saved_modules",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    moduleId: text("module_id")
      .notNull()
      .references(() => modules.id, { onDelete: "cascade" }),
    createdAt: integer("created_at").notNull(),
  },
  (t) => [
    uniqueIndex("idx_saved_modules_user_module").on(t.userId, t.moduleId),
  ],
);
export const flashcards = sqliteTable(
  "flashcards",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    moduleId: text("module_id")
      .notNull()
      .references(() => modules.id, { onDelete: "cascade" }),
    front: text("front").notNull(),
    back: text("back").notNull(),
    createdAt: integer("created_at").notNull(),
    updatedAt: integer("updated_at").notNull(),
  },
  (t) => [
    index("idx_flashcards_user_module").on(t.userId, t.moduleId),
  ],
);

export const flashcardQuizAttempts = sqliteTable(
  "flashcard_quiz_attempts",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    moduleId: text("module_id")
      .notNull()
      .references(() => modules.id, { onDelete: "cascade" }),
    score: integer("score").notNull(),
    total: integer("total").notNull(),
    createdAt: integer("created_at").notNull(),
  },
  (t) => [
    index("idx_flashcard_quiz_user_created").on(t.userId, t.createdAt),
  ],
);
