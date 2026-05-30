import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tootie Website Growth Audit — Powered by AI-BizScout',
  description:
    'Get a conversion, trust, and AI growth audit that shows what is costing your website leads — powered by AI-BizScout for Tootie Designs.',
  openGraph: {
    title: 'Tootie Website Growth Audit',
    description: 'AI-powered website growth audit and business transformation roadmap from Tootie Designs',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-text-primary antialiased">
        {children}
      </body>
    </html>
  );
}
