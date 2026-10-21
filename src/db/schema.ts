import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

// Ticket types and fares definition
export const ticketTypes = sqliteTable('ticket_types', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(), // e.g. "Adult Day", "School Single"
  code: text('code').notNull(), // e.g. "AD_DAY", "SCH_SIN"
  fare: real('fare').notNull(), // 1.00 or 0.50 or 0.00
  category: text('category').notNull(), // 'DAY', 'SIN', 'COUNT'
});

// Routes configuration
export const routes = sqliteTable('routes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  routeName: text('route_name').notNull(),
});

// Ordered stops for each route
export const stops = sqliteTable('stops', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  routeId: integer('route_id').notNull(),
  stopName: text('stop_name').notNull(),
  stopOrder: integer('stop_order').notNull(),
});

// Active trips/services operated by drivers
export const trips = sqliteTable('trips', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  routeId: integer('route_id').notNull(),
  driverName: text('driver_name').notNull(),
  currentStopId: integer('current_stop_id'),
  status: text('status').notNull().default('ACTIVE'), // ACTIVE, COMPLETED
  createdAt: text('created_at').notNull(),
});

// Ticket and passenger count transactions
export const transactions = sqliteTable('transactions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  tripId: integer('trip_id').notNull(),
  stopId: integer('stop_id').notNull(),
  ticketTypeCode: text('ticket_type_code').notNull(),
  quantity: integer('quantity').notNull(),
  totalFare: real('total_fare').notNull(),
  isSynced: integer('is_synced', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('created_at').notNull(),
});
