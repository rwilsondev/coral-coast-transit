'use client';

import React, { useState } from 'react';

// Ticket definitions matching exact user specifications
const TICKET_BUTTONS = [
  { code: 'AD_DAY', label: 'AD DAY', fare: 1.00, type: 'DAY', color: 'bg-blue-600 hover:bg-blue-700' },
  { code: 'SCH_DAY', label: 'SCH DAY', fare: 1.00, type: 'DAY', color: 'bg-blue-600 hover:bg-blue-700' },
  { code: 'PN_DAY', label: 'PN DAY', fare: 1.00, type: 'DAY', color: 'bg-blue-600 hover:bg-blue-700' },
  { code: 'SCH_COUNT', label: 'SCH COUNT', fare: 0.00, type: 'COUNT', color: 'bg-amber-600 hover:bg-amber-700' },
  
  { code: 'AD_SIN', label: 'AD SIN', fare: 0.50, type: 'SIN', color: 'bg-emerald-600 hover:bg-emerald-700' },
  { code: 'SCH_SIN', label: 'SCH SIN', fare: 0.50, type: 'SIN', color: 'bg-emerald-600 hover:bg-emerald-700' },
  { code: 'PN_SIN', label: 'PN SIN', fare: 0.50, type: 'SIN', color: 'bg-emerald-600 hover:bg-emerald-700' },
  { code: 'NO_FARE_COUNT', label: 'NO FARE COUNT', fare: 0.00, type: 'COUNT', color: 'bg-amber-600 hover:bg-amber-700' },
];

export default function TicketMachine() {
  // State management
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [isGroupMode, setIsGroupMode] = useState(false);
  const [quantity, setQuantity] = useState<string>('1');
  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const [sessionTotal, setSessionTotal] = useState(0);
  const [transactionsLog, setTransactionsLog] = useState<any[]>([]);

  // Mock Route Stops
  const routeStops = ['Central Station', 'Market Street', 'Hospital Gate', 'University Campus', 'Coastal Terminal'];

  // Handle button clicks
  const handleTicketClick = (ticket: any) => {
    if (ticket.type === 'COUNT') {
      // Count-only buttons record immediately without ENTER or Fare
      recordTransaction(ticket, 1, 0.00);
      return;
    }

    // Select ticket for Single or Group mode
    setSelectedTicket(ticket);
  };

  // Handle number pad input for group quantity
  const handleNumPad = (num: string) => {
    if (!isGroupMode) return;
    setQuantity((prev) => (prev === '1' ? num : prev + num));
  };

  const clearQuantity = () => {
    setQuantity('1');
  };

  // Handle ENTER key press
  const handleEnter = () => {
    if (!selectedTicket) return;

    const qty = isGroupMode ? parseInt(quantity || '1', 10) : 1;
    const total = qty * selectedTicket.fare;

    recordTransaction(selectedTicket, qty, total);

    // Reset selection and automatically switch GROUP mode off after ENTER
    setSelectedTicket(null);
    setIsGroupMode(false);
    setQuantity('1');
  };

  const recordTransaction = (ticket: any, qty: number, total: number) => {
    const newTx = {
      id: Date.now(),
      ticketName: ticket.label,
      quantity: qty,
      totalFare: total,
      stop: routeStops[currentStopIndex],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Confirmed (Online)',
    };

    setTransactionsLog([newTx, ...transactionsLog]);
    setSessionTotal((prev) => prev + total);
  };

  const nextStop = () => {
    if (currentStopIndex < routeStops.length - 1) {
      setCurrentStopIndex((prev) => prev + 1);
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 text-white p-4 select-none flex flex-col justify-between">
      {/* Top Header / Status Bar */}
      <header className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex flex-col md:flex-row justify-between items-center gap-4 shadow-lg">
        <div>
          <h1 className="text-xl font-black tracking-wider text-amber-400">CORAL COAST TRANSIT</h1>
          <p className="text-sm text-slate-300">Route: <span className="font-bold text-white">Route 1 - Coastal Express</span> | Driver: <span className="font-bold text-white">Operator 01</span></p>
        </div>
        
        <div className="flex items-center gap-4 bg-slate-900 px-4 py-2 rounded-lg border border-slate-700">
          <div>
            <p className="text-xs text-slate-400 uppercase">Current Stop:</p>
            <p className="text-lg font-bold text-emerald-400">{routeStops[currentStopIndex]}</p>
          </div>
          <button 
            onClick={nextStop}
            className="bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-bold px-4 py-2 rounded-lg shadow transition">
            NEXT STOP ➔
          </button>
        </div>
      </header>

      {/* Main Interface Body */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-4 flex-grow">
        
        {/* Left/Center: The 8 Ticket Buttons Grid */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-xl">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-semibold uppercase tracking-wider text-slate-400">Ticket Selection Grid</span>
              <div className="flex gap-2">
                <button 
                  onClick={() => { setIsGroupMode(!isGroupMode); setQuantity('1'); }}
                  className={`px-4 py-2 rounded-lg font-bold text-sm transition ${isGroupMode ? 'bg-amber-500 text-slate-950 animate-pulse' : 'bg-slate-700 text-slate-200 hover:bg-slate-600'}`}>
                  {isGroupMode ? 'GROUP MODE: ACTIVE' : 'GROUP MODE: OFF'}
                </button>
              </div>
            </div>

            {/* Selection Status Banner */}
            <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg mb-4 flex justify-between items-center">
              <div>
                <span className="text-xs text-slate-400">Selected Action:</span>
                <p className="text-lg font-bold text-cyan-400">
                  {selectedTicket ? `${isGroupMode ? `Qty ${quantity} x ` : ''}${selectedTicket.label} ($${selectedTicket.fare.toFixed(2)})` : 'Tap a ticket button below'}
                </p>
              </div>
              <div className="flex gap-2">
                {isGroupMode && (
                  <button onClick={clearQuantity} className="bg-rose-900/50 border border-rose-700 text-rose-300 px-3 py-2 rounded-lg text-sm font-bold">
                    Clear Qty
                  </button>
                )}
                <button 
                  onClick={handleEnter}
                  disabled={!selectedTicket}
                  className={`px-6 py-2 rounded-lg font-black text-lg transition ${selectedTicket ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 active:scale-95 shadow-lg' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}>
                  ENTER
                </button>
              </div>
            </div>

            {/* 2x4 Exact Button Grid */}
            <div className="grid grid-cols-4 gap-3">
              {TICKET_BUTTONS.map((ticket) => {
                const isSelected = selectedTicket?.code === ticket.code;
                return (
                  <button
                    key={ticket.code}
                    onClick={() => handleTicketClick(ticket)}
                    className={`${ticket.color} ${isSelected ? 'ring-4 ring-yellow-400 scale-[1.02]' : ''} h-28 rounded-xl font-bold flex flex-col justify-center items-center p-2 shadow-md active:scale-95 transition border border-white/10`}>
                    <span className="text-base md:text-lg text-center leading-tight">{ticket.label}</span>
                    <span className="text-xs mt-1 opacity-90 bg-black/20 px-2 py-0.5 rounded">
                      {ticket.fare > 0 ? `$${ticket.fare.toFixed(2)}` : 'No Fare'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Number Pad for Group Quantity */}
            {isGroupMode && (
              <div className="mt-4 p-3 bg-slate-900 rounded-xl border border-slate-700 flex items-center justify-between">
                <span className="text-sm text-slate-300 font-medium">Enter Quantity via Keypad:</span>
                <div className="flex gap-2">
                  {['1', '2', '3', '4', '5', '10'].map((num) => (
                    <button
                      key={num}
                      onClick={() => setQuantity(num)}
                      className={`px-4 py-2 rounded-lg font-bold ${quantity === num ? 'bg-amber-500 text-slate-950' : 'bg-slate-700 text-white hover:bg-slate-600'}`}>
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Trip Sales & Recent Transactions Feed */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-3 border-b border-slate-700 pb-2">
              <h2 className="font-bold text-slate-300 uppercase text-sm">Trip Summary</h2>
              <span className="text-emerald-400 font-black text-xl">${sessionTotal.toFixed(2)}</span>
            </div>

            <h3 className="text-xs uppercase text-slate-400 font-semibold mb-2">Recent Transactions</h3>
            <div className="space-y-2 overflow-y-auto max-h-[350px] pr-1">
              {transactionsLog.length === 0 ? (
                <p className="text-xs text-slate-500 italic text-center py-8">No tickets issued yet this trip.</p>
              ) : (
                transactionsLog.map((tx) => (
                  <div key={tx.id} className="bg-slate-900 border border-slate-700 p-2.5 rounded-lg text-xs flex justify-between items-center">
                    <div>
                      <p className="font-bold text-white">{tx.ticketName} {tx.quantity > 1 ? `(x${tx.quantity})` : ''}</p>
                      <p className="text-slate-400">{tx.stop} • {tx.time}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-400">${tx.totalFare.toFixed(2)}</p>
                      <span className="text-[10px] text-cyan-400 bg-cyan-950 px-1.5 py-0.5 rounded">{tx.status}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-700 text-center">
            <p className="text-[11px] text-slate-400">Coral Coast Transit • iPad Driver Console v1.0</p>
          </div>
        </div>

      </div>
    </main>
  );
}
