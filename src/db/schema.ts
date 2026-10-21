import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

// Users / Drivers accounts
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull(),
  role: text('role').notNull().default('driver'),
});

// Ticket types and fares definition
export const ticketTypes = sqliteTable('ticket_types', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  code: text('code').notNull(),
  fare: real('fare').notNull(),
  category: text('category').notNull(),
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
  status: text('status').notNull().default('ACTIVE'),
  createdAt: text('created_at').notNull(),
});

// Tickets table referenced by API routes
export const tickets = sqliteTable('tickets', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  tripId: integer('trip_id').notNull(),
  ticketTypeCode: text('ticket_type_code').notNull(),
  fare: real('fare').notNull(),
  createdAt: text('created_at').notNull(),
});

// Ticket legs / details
export const ticketLegs = sqliteTable('ticket_legs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  ticketId: integer('ticket_id').notNull(),
  stopId: integer('stop_id').notNull(),
});

// Passengers table
export const passengers = sqliteTable('passengers', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  tripId: integer('trip_id').notNull(),
  category: text('category').notNull(),
  count: integer('count').notNull().default(1),
  createdAt: text('created_at').notNull(),
});

// Payments table
export const payments = sqliteTable('payments', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  tripId: integer('trip_id').notNull(),
  amount: real('amount').notNull(),
  method: text('method').notNull().default('CASH'),
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

// Audit logs table
export const auditLogs = sqliteTable('audit_logs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  action: text('action').notNull(),
  details: text('details').notNull(),
  createdAt: text('created_at').notNull(),
});
