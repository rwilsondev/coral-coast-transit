import type { Metadata } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Coral Coast Transit - Driver Console',
  description: 'iPad ticket machine interface for Coral Coast Transit',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-900 text-white antialiased">
        {children}
      </body>
    </html>
  );
}
