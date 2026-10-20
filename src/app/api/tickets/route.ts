import { randomUUID, randomBytes } from 'node:crypto';
import { NextResponse } from 'next/server';
import { createClient } from '@libsql/client';
import { z } from 'zod';
import { db } from '@/db';
import { auditLogs, passengers, payments, ticketLegs, tickets, users } from '@/db/schema';

export const runtime = 'nodejs';
const inputSchema = z.object({
  passengerName: z.string().trim().min(2).max(120),
  email: z.union([z.string().trim().email().max(254), z.literal('')]).optional(),
  ticketType: z.enum(['single', 'return', 'weekly', 'monthly']),
  price: z.coerce.number().min(0).max(100000),
  validFrom: z.string().datetime({ offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)),
  paymentMethod: z.enum(['virtual_cash', 'virtual_card', 'complimentary']),
  notes: z.string().max(500).optional().default(''),
});

function isoDate(value: string) { const parsed = new Date(value); if (!Number.isFinite(parsed.getTime())) throw new Error('Invalid date'); return parsed.toISOString(); }
function expiryFor(start: Date, type: 'single'|'return'|'weekly'|'monthly') { const end = new Date(start); if (type === 'weekly') end.setDate(end.getDate() + 7); else if (type === 'monthly') end.setMonth(end.getMonth() + 1); else if (type === 'return') end.setDate(end.getDate() + 1); else end.setHours(end.getHours() + 24); return end.toISOString(); }

export async function POST(request: Request) {
  // SAFETY: replace this development identity with authenticated session lookup and
  // enforce staff/admin role checks before deploying publicly.
  if (process.env.NODE_ENV === 'production' && process.env.ALLOW_DEMO_TICKETING !== 'true') {
    return NextResponse.json({ error: 'Ticket issuing is disabled until staff authentication is configured.' }, { status: 503 });
  }
  const parsed = inputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Please check the passenger, ticket type, fare and date fields.' }, { status: 400 });
  const input = parsed.data;
  const now = new Date().toISOString(); const start = new Date(input.validFrom);
  if (!Number.isFinite(start.getTime())) return NextResponse.json({ error: 'Invalid start date.' }, { status: 400 });
  const priceCents = Math.round(input.price * 100);
  const ticketId = randomUUID(); const passengerId = randomUUID(); const paymentId = randomUUID(); const auditId = randomUUID();
  const ticketNumber = `CCT-${new Date().getUTCFullYear()}-${randomBytes(4).toString('hex').toUpperCase()}`;
  const paymentRef = `SIM-${randomBytes(6).toString('hex').toUpperCase()}`;
  const staffId = 'development-demo-staff';
  try {
    // This development identity is deliberately inserted only for local previews.
    // A production deployment is blocked above until a real auth provider is wired in.
    if (process.env.NODE_ENV !== 'production') {
      await db.insert(users).values({ id: staffId, email: 'demo-staff@coralcoast.invalid', displayName: 'Development Demo Staff', authSubject: staffId, role: 'staff', active: true, createdAt: now }).onConflictDoNothing();
    }
    await db.insert(passengers).values({ id: passengerId, fullName: input.passengerName, email: input.email || null, createdAt: now });
    await db.insert(tickets).values({ id: ticketId, ticketNumber, passengerId, ticketType: input.ticketType, status: 'active', priceCents, currency: 'AUD', validFrom: isoDate(input.validFrom), validUntil: expiryFor(start, input.ticketType), issuedBy: staffId, notes: input.notes || null, createdAt: now });
    await db.insert(payments).values({ id: paymentId, ticketId, amountCents: priceCents, method: input.paymentMethod, status: input.paymentMethod === 'complimentary' ? 'simulated_paid' : 'simulated_paid', reference: paymentRef, recordedBy: staffId, createdAt: now });
    await db.insert(auditLogs).values({ id: auditId, actorUserId: staffId, action: 'ticket.issued', entityType: 'ticket', entityId: ticketId, detailsJson: JSON.stringify({ ticketNumber, ticketType: input.ticketType, priceCents }), createdAt: now });
    return NextResponse.json({ ticketNumber, ticketId, paymentReference: paymentRef }, { status: 201 });
  } catch (error) {
    console.error('Ticket issuance failed', error);
    return NextResponse.json({ error: 'Ticket could not be saved. Check the database connection and setup.' }, { status: 500 });
  }
}
