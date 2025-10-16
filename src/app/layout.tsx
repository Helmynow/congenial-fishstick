import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ESE Evaluation & Recognition',
  description: 'Eternity School of Egypt - Employee Evaluation and Recognition System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
