import React from 'react';
import Link from 'next/link';

export default function TicketsRedirect() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-bold mb-4">Ticket Register</h1>
      <p className="text-slate-400 mb-6">Transactions are now recorded directly from the driver console.</p>
      <Link href="/" className="bg-emerald-500 text-slate-950 font-bold px-6 py-3 rounded-xl shadow-lg">
        Return to Driver Console
      </Link>
    </div>
  );
}
