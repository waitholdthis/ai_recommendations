import { NextRequest } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { createElement } from 'react';
import { BizScoutPDF } from '@/lib/pdf-document';
import type { AnalysisReport } from '@/lib/types';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const report = (await req.json()) as AnalysisReport;

    if (!report?.businessName) {
      return new Response(JSON.stringify({ error: 'Invalid report data' }), { status: 400 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const buffer = await renderToBuffer(createElement(BizScoutPDF, { report }) as any);

    const slug = report.businessName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 40);

    return new Response(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="bizscout-${slug}.pdf"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    console.error('PDF generation failed:', err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'PDF generation failed' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
