import { NextRequest } from 'next/server';
import { scrapeWebsite } from '@/lib/scraper';
import { classifyBusiness, runVisualAudit, generateRoadmap } from '@/lib/analyzer';
import type { ProgressUpdate } from '@/lib/types';

export const runtime = 'nodejs';
export const maxDuration = 120;

function sendEvent(
  controller: ReadableStreamDefaultController,
  encoder: TextEncoder,
  update: ProgressUpdate
) {
  const data = `data: ${JSON.stringify(update)}\n\n`;
  controller.enqueue(encoder.encode(data));
}

export async function POST(req: NextRequest) {
  const { url } = await req.json();

  if (!url || typeof url !== 'string') {
    return new Response(JSON.stringify({ error: 'Invalid URL' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        sendEvent(controller, encoder, {
          stage: 'scraping',
          message: 'Crawling website — capturing screenshot and extracting data...',
          progress: 10,
        });

        let scrapedData;
        try {
          scrapedData = await scrapeWebsite(url);
        } catch (err) {
          sendEvent(controller, encoder, {
            stage: 'error',
            message: `Failed to scrape website: ${err instanceof Error ? err.message : 'Unknown error'}`,
            progress: 0,
            error: err instanceof Error ? err.message : 'Scraping failed',
          });
          controller.close();
          return;
        }

        sendEvent(controller, encoder, {
          stage: 'classifying',
          message: 'Analyzing business type, audience, and AI readiness...',
          progress: 30,
        });

        let classification;
        try {
          classification = await classifyBusiness(scrapedData);
        } catch (err) {
          sendEvent(controller, encoder, {
            stage: 'error',
            message: 'Failed to classify business',
            progress: 0,
            error: err instanceof Error ? err.message : 'Classification failed',
          });
          controller.close();
          return;
        }

        sendEvent(controller, encoder, {
          stage: 'visual_analysis',
          message: 'Running visual CRO audit on your screenshot...',
          progress: 55,
        });

        let croAudit;
        try {
          croAudit = await runVisualAudit(scrapedData);
        } catch (err) {
          sendEvent(controller, encoder, {
            stage: 'error',
            message: 'Failed to run visual audit',
            progress: 0,
            error: err instanceof Error ? err.message : 'Visual audit failed',
          });
          controller.close();
          return;
        }

        sendEvent(controller, encoder, {
          stage: 'roadmap',
          message: 'Generating your custom AI Solutions Roadmap...',
          progress: 75,
        });

        let aiRoadmap;
        try {
          aiRoadmap = await generateRoadmap(classification, croAudit, url);
        } catch (err) {
          sendEvent(controller, encoder, {
            stage: 'error',
            message: 'Failed to generate roadmap',
            progress: 0,
            error: err instanceof Error ? err.message : 'Roadmap generation failed',
          });
          controller.close();
          return;
        }

        sendEvent(controller, encoder, {
          stage: 'finalizing',
          message: 'Compiling your full report...',
          progress: 95,
        });

        const businessName =
          scrapedData.title?.split(/[|\-–—]/)[0]?.trim() ||
          new URL(url).hostname.replace('www.', '');

        sendEvent(controller, encoder, {
          stage: 'complete',
          message: 'Analysis complete!',
          progress: 100,
          data: {
            id: crypto.randomUUID(),
            url,
            analyzedAt: new Date().toISOString(),
            businessName,
            classification,
            croAudit,
            aiRoadmap,
          },
        });

        controller.close();
      } catch (err) {
        sendEvent(controller, encoder, {
          stage: 'error',
          message: 'An unexpected error occurred',
          progress: 0,
          error: err instanceof Error ? err.message : 'Unknown error',
        });
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
