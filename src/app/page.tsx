import React from 'react';
import Link from 'next/link';
import { db } from '@/db';
import { transactions } from '@/db/schema';
import { desc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export default async function TicketsPage() {
  const rows = await db.select().from(transactions).orderBy(desc(transactions.createdAt)).limit(100);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-black text-amber-400">CORAL COAST TRANSIT</h1>
            <p className="text-sm text-slate-300">Transaction Register & Audit Log</p>
          </div>
          <Link href="/" className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg font-bold text-sm border border-slate-700 transition">
            ← Back to Driver Console
          </Link>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-xl">
          <h2 className="text-lg font-bold mb-4 text-slate-200">Recent Transactions</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400 text-xs uppercase">
                  <th className="p-3">ID</th>
                  <th className="p-3">Ticket Code</th>
                  <th className="p-3">Quantity</th>
                  <th className="p-3">Total Fare</th>
                  <th className="p-3">Time</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-slate-500 italic">
                      No transactions recorded yet.
                    </td>
                  </tr>
                ) : (
                  rows.map((r) => (
                    <tr key={r.id} className="border-b border-slate-700/50 hover:bg-slate-700/20 text-sm">
                      <td className="p-3 font-mono text-slate-400">#{r.id}</td>
                      <td className="p-3 font-bold text-cyan-400">{r.ticketTypeCode}</td>
                      <td className="p-3">{r.quantity}</td>
                      <td className="p-3 font-bold text-emerald-400">${r.totalFare.toFixed(2)}</td>
                      <td className="p-3 text-slate-300">{new Date(r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                      <td className="p-3">
                        <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-1 rounded text-xs">
                          {r.isSynced ? 'Confirmed (Online)' : 'Pending Sync'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
