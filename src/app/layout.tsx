import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI-BizScout — AI Solutions Roadmap & CRO Audit',
  description:
    'Drop any website URL and get a comprehensive AI Solutions Roadmap + Conversion Rate Optimization audit in minutes.',
  openGraph: {
    title: 'AI-BizScout',
    description: 'AI-powered website analysis and business transformation roadmap',
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
