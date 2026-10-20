import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Coral Coast Transit | Ticket Office', description: 'Internal ticketing system for Coral Coast Transit.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en-AU"><body>{children}</body></html>; }
