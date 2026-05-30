import Anthropic from '@anthropic-ai/sdk';
import type {
  ScrapedData,
  BusinessClassification,
  CROAudit,
  AIRoadmap,
} from './types';
import {
  CLASSIFICATION_SYSTEM_PROMPT,
  VISUAL_AUDIT_SYSTEM_PROMPT,
  ROADMAP_SYSTEM_PROMPT,
  buildClassificationPrompt,
  buildVisualAuditPrompt,
  buildRoadmapPrompt,
} from './prompts';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MODEL = 'claude-opus-4-7';

function parseJSON<T>(text: string, fallback: T): T {
  try {
    const cleaned = text
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();
    return JSON.parse(cleaned) as T;
  } catch {
    console.error('JSON parse failed, raw:', text.slice(0, 300));
    return fallback;
  }
}

export async function classifyBusiness(
  scrapedData: ScrapedData
): Promise<BusinessClassification> {
  const stream = client.messages.stream({
    model: MODEL,
    max_tokens: 4096,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    thinking: { type: 'adaptive' } as any,
    system: [
      {
        type: 'text',
        text: CLASSIFICATION_SYSTEM_PROMPT,
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages: [
      {
        role: 'user',
        content: buildClassificationPrompt(scrapedData),
      },
    ],
  });

  const response = await stream.finalMessage();
  const textBlock = response.content.find((b) => b.type === 'text');
  const text = textBlock?.type === 'text' ? textBlock.text : '{}';

  return parseJSON<BusinessClassification>(text, {
    industry: 'Unknown',
    subIndustry: 'Unknown',
    businessModel: 'B2C',
    revenueModel: 'Unknown',
    primaryAudience: 'General consumers',
    secondaryAudience: 'Unknown',
    maturityStage: 'Established',
    marketPositioning: 'Mid-Market',
    brandVoice: 'Unknown',
    topPainPoints: ['Customer acquisition', 'Retention', 'Operational efficiency'],
    customerJobsToBeDone: [],
    competitiveAdvantages: ['Existing brand presence'],
    competitiveMoat: 'Unknown',
    currentTechStack: [],
    missingTechSignals: [],
    aiReadinessScore: 40,
    digitalMaturityScore: 40,
    growthSignals: [],
    keyConversionBarriers: [],
  });
}

export async function runVisualAudit(scrapedData: ScrapedData): Promise<CROAudit> {
  const visualAuditPrompt = buildVisualAuditPrompt(scrapedData);

  const stream = client.messages.stream({
    model: MODEL,
    max_tokens: 12000,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    thinking: { type: 'adaptive' } as any,
    system: [
      {
        type: 'text',
        text: VISUAL_AUDIT_SYSTEM_PROMPT,
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: scrapedData.screenshotMimeType,
              data: scrapedData.screenshotBase64,
            },
          },
          {
            type: 'text',
            text: visualAuditPrompt,
          },
        ],
      },
    ],
  });

  const response = await stream.finalMessage();
  const textBlock = response.content.find((b) => b.type === 'text');
  const text = textBlock?.type === 'text' ? textBlock.text : '{}';

  return parseJSON<CROAudit>(text, {
    overallScore: 50,
    heroScore: 50,
    navigationScore: 50,
    ctaScore: 50,
    socialProofScore: 40,
    mobileScore: 60,
    trustScore: 50,
    contentScore: 50,
    accessibilityScore: 50,
    seoScore: 50,
    performanceScore: 50,
    brandConsistencyScore: 50,
    copyQualityScore: 50,
    valuePropositionScore: 50,
    executiveSummary: 'CRO audit completed.',
    issues: [],
    quickWins: ['Review and test CTA button colors and copy'],
    strengths: ['Website is live and accessible'],
  });
}

export async function generateRoadmap(
  classification: BusinessClassification,
  croAudit: CROAudit,
  url: string
): Promise<AIRoadmap> {
  const stream = client.messages.stream({
    model: MODEL,
    max_tokens: 16000,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    thinking: { type: 'adaptive' } as any,
    system: [
      {
        type: 'text',
        text: ROADMAP_SYSTEM_PROMPT,
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages: [
      {
        role: 'user',
        content: buildRoadmapPrompt(classification, croAudit, url),
      },
    ],
  });

  const response = await stream.finalMessage();
  const textBlock = response.content.find((b) => b.type === 'text');
  const text = textBlock?.type === 'text' ? textBlock.text : '{}';

  return parseJSON<AIRoadmap>(text, {
    executiveSummary: 'AI transformation roadmap generated for your business.',
    phase1: { title: 'Quick Wins', duration: 'Weeks 1-8', opportunities: [] },
    phase2: { title: 'Strategic Growth', duration: 'Months 2-6', opportunities: [] },
    phase3: { title: 'Transformative Scale', duration: 'Months 6-18', opportunities: [] },
    totalEstimatedROI: 'TBD',
    topRecommendation: 'Start with AI-powered customer support automation.',
  });
}
