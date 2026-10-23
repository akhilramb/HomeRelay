import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
export const households = sqliteTable('households', { id: text('id').primaryKey(), revision: integer('revision').notNull().default(0), data: text('data').notNull() });

export const memberships = sqliteTable('memberships', { userId: text('user_id').primaryKey(), householdId: text('household_id').notNull(), memberId: text('member_id').notNull() });
export const invitations = sqliteTable('invitations', { tokenHash: text('token_hash').primaryKey(), householdId: text('household_id').notNull(), expiresAt: integer('expires_at').notNull() });
