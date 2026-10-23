import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
export const households = sqliteTable('households', { id: text('id').primaryKey(), revision: integer('revision').notNull().default(0), data: text('data').notNull() });
