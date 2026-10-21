import { NextResponse } from 'next/server';
import { db } from '@/db';
import { transactions, trips } from '@/db/schema';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tripId, stopId, ticketTypeCode, quantity, totalFare } = body;

    if (!tripId || !stopId || !ticketTypeCode || quantity === undefined) {
      return NextResponse.json({ error: 'Missing required transaction fields' }, { status: 400 });
    }

    // Insert transaction into database
    const now = new Date().toISOString();
    await db.insert(transactions).values({
      tripId: Number(tripId),
      stopId: Number(stopId),
      ticketTypeCode,
      quantity: Number(quantity),
      totalFare: Number(totalFare),
      isSynced: true,
      createdAt: now,
    });

    return NextResponse.json({ success: true, message: 'Transaction recorded successfully' });
  } catch (error: any) {
    console.error('Failed to record transaction:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const allTransactions = await db.select().from(transactions).all();
    return NextResponse.json({ success: true, transactions: allTransactions });
  } catch (error: any) {
    console.error('Failed to fetch transactions:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
