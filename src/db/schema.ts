import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  displayName: text('display_name').notNull(),
  // Auth provider subject; never store raw passwords in this table.
  authSubject: text('auth_subject').notNull().unique(),
  role: text('role', { enum: ['admin', 'staff', 'driver'] }).notNull().default('staff'),
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
  createdAt: text('created_at').notNull(),
});

export const routes = sqliteTable('routes', {
  id: text('id').primaryKey(),
  code: text('code').notNull().unique(),
  name: text('name').notNull(),
  origin: text('origin').notNull(),
  destination: text('destination').notNull(),
  singleFareCents: integer('single_fare_cents').notNull(),
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
  createdAt: text('created_at').notNull(),
});

export const services = sqliteTable('services', {
  id: text('id').primaryKey(),
  routeId: text('route_id').notNull().references(() => routes.id),
  serviceCode: text('service_code').notNull().unique(),
  departureAt: text('departure_at').notNull(),
  vehicleLabel: text('vehicle_label'),
  seatCapacity: integer('seat_capacity').notNull(),
  status: text('status', { enum: ['scheduled', 'cancelled', 'completed'] }).notNull().default('scheduled'),
  createdAt: text('created_at').notNull(),
}, (table) => [index('services_route_departure_idx').on(table.routeId, table.departureAt)]);

export const passengers = sqliteTable('passengers', {
  id: text('id').primaryKey(),
  fullName: text('full_name').notNull(),
  email: text('email'),
  phone: text('phone'),
  createdAt: text('created_at').notNull(),
});

export const tickets = sqliteTable('tickets', {
  id: text('id').primaryKey(),
  ticketNumber: text('ticket_number').notNull().unique(),
  passengerId: text('passenger_id').notNull().references(() => passengers.id),
  ticketType: text('ticket_type', { enum: ['single', 'return', 'weekly', 'monthly'] }).notNull(),
  status: text('status', { enum: ['active', 'used', 'cancelled', 'expired'] }).notNull().default('active'),
  priceCents: integer('price_cents').notNull(),
  currency: text('currency').notNull().default('AUD'),
  validFrom: text('valid_from').notNull(),
  validUntil: text('valid_until').notNull(),
  issuedBy: text('issued_by').notNull().references(() => users.id),
  notes: text('notes'),
  createdAt: text('created_at').notNull(),
}, (table) => [index('tickets_passenger_idx').on(table.passengerId), index('tickets_status_validity_idx').on(table.status, table.validUntil)]);

export const ticketLegs = sqliteTable('ticket_legs', {
  id: text('id').primaryKey(),
  ticketId: text('ticket_id').notNull().references(() => tickets.id),
  serviceId: text('service_id').notNull().references(() => services.id),
  legType: text('leg_type', { enum: ['outbound', 'return', 'pass_use'] }).notNull(),
  createdAt: text('created_at').notNull(),
}, (table) => [index('ticket_legs_ticket_idx').on(table.ticketId), index('ticket_legs_service_idx').on(table.serviceId)]);

export const payments = sqliteTable('payments', {
  id: text('id').primaryKey(),
  ticketId: text('ticket_id').notNull().references(() => tickets.id),
  amountCents: integer('amount_cents').notNull(),
  method: text('method', { enum: ['virtual_cash', 'virtual_card', 'complimentary'] }).notNull(),
  status: text('status', { enum: ['simulated_paid', 'pending', 'refunded', 'voided'] }).notNull(),
  reference: text('reference').notNull().unique(),
  recordedBy: text('recorded_by').notNull().references(() => users.id),
  createdAt: text('created_at').notNull(),
});

export const auditLogs = sqliteTable('audit_logs', {
  id: text('id').primaryKey(),
  actorUserId: text('actor_user_id').references(() => users.id),
  action: text('action').notNull(),
  entityType: text('entity_type').notNull(),
  entityId: text('entity_id').notNull(),
  detailsJson: text('details_json'),
  createdAt: text('created_at').notNull(),
}, (table) => [index('audit_logs_entity_idx').on(table.entityType, table.entityId), index('audit_logs_created_idx').on(table.createdAt)]);
