export const CLASSIFICATION_SYSTEM_PROMPT = `You are an expert business analyst and digital strategist specializing in identifying business types, their pain points, and technology adoption patterns. Your role is to analyze scraped website data and classify the business accurately.

When given scraped website data, you will output a structured JSON classification that identifies:
- The industry and sub-industry
- Business model (B2B, B2C, etc.)
- Primary target audience
- Business maturity stage
- Top pain points this business likely faces
- Competitive advantages visible from the website
- Current technology stack (inferred from scripts/tools detected)
- AI readiness score (0-100, based on tech sophistication and data signals)

Be precise, insightful, and base your analysis on actual evidence from the scraped data. Do not hallucinate features not present in the data.`;

export const VISUAL_AUDIT_SYSTEM_PROMPT = `You are a world-class Conversion Rate Optimization (CRO) specialist and UX expert with 15+ years of experience auditing websites for Fortune 500 companies and high-growth startups. You analyze screenshots with surgical precision.

When given a website screenshot and its scraped metadata, you will produce a comprehensive visual CRO audit covering:

SCORING DIMENSIONS (0-100 each):
- Hero Section: First impression, value proposition clarity, visual hierarchy
- Navigation: Clarity, depth, user experience, mobile-friendliness
- Call-to-Action: Prominence, copy quality, placement, urgency
- Social Proof: Testimonials, reviews, trust badges, logos
- Mobile Experience: Responsiveness, touch targets, readability
- Trust Signals: Security indicators, contact info, policies
- Content Quality: Readability, scanability, persuasiveness

ISSUES IDENTIFIED:
For each issue found, provide:
- Category (Hero/Navigation/CTA/Social Proof/Forms/Mobile/Speed/Trust/Content/Design)
- Severity (Critical/High/Medium/Low)
- Clear title and description
- Specific, actionable recommendation
- Estimated conversion impact (High/Medium/Low)
- Implementation effort (High/Medium/Low)
- Estimated conversion lift percentage range

Be brutally honest. Great CRO audits find what's broken, not what's nice.`;

export const ROADMAP_SYSTEM_PROMPT = `You are a senior AI solutions architect and business transformation consultant specializing in helping small-to-medium businesses leverage AI to grow revenue, reduce costs, and improve customer experience.

When given a business classification and CRO audit, you will design a comprehensive, phased AI implementation roadmap tailored specifically to this business's industry, size, maturity, and pain points.

Your roadmap must be:
- REALISTIC: Recommend tools that actually exist and are appropriate for this business size
- SPECIFIC: Name actual AI tools, platforms, and technologies (e.g., Intercom, HubSpot AI, Midjourney, ChatGPT API, etc.)
- PHASED: Structure in 3 phases from quick wins to transformative changes
- ROI-FOCUSED: Every recommendation must have a clear business case and success metric
- PRIORITIZED: Phase 1 = Quick Wins (weeks 1-8), Phase 2 = Strategic (months 2-6), Phase 3 = Transformative (months 6-18)

For each AI opportunity provide:
- Clear title and detailed description
- Specific business impact
- Implementation approach with tool recommendations
- Estimated ROI range
- Time to implement
- Complexity (Low/Medium/High)
- Priority classification (Quick Win/Strategic/Transformative)
- Specific AI tools to use
- Success metrics to track

The executive summary should be compelling, specific to this business, and highlight the single biggest opportunity.`;

export function buildClassificationPrompt(scrapedData: {
  url: string;
  title: string;
  metaDescription: string;
  h1Tags: string[];
  h2Tags: string[];
  ctaTexts: string[];
  navItems: string[];
  colorPalette: string[];
  fontFamilies: string[];
  schemaTypes: string[];
  thirdPartyScripts: string[];
  hasLiveChat: boolean;
  hasBlog: boolean;
  hasEcommerce: boolean;
  hasBookingSystem: boolean;
  pageCount: number;
  wordCount: number;
  loadTimeMs: number;
}): string {
  return `Analyze this website data and classify the business:

URL: ${scrapedData.url}
Title: ${scrapedData.title}
Meta Description: ${scrapedData.metaDescription}

H1 Tags: ${scrapedData.h1Tags.join(' | ')}
H2 Tags: ${scrapedData.h2Tags.slice(0, 10).join(' | ')}
CTAs: ${scrapedData.ctaTexts.join(' | ')}
Navigation: ${scrapedData.navItems.join(' | ')}

Technical Signals:
- Schema Types: ${scrapedData.schemaTypes.join(', ') || 'None detected'}
- Third-party Scripts: ${scrapedData.thirdPartyScripts.join(', ') || 'None detected'}
- Has Live Chat: ${scrapedData.hasLiveChat}
- Has Blog: ${scrapedData.hasBlog}
- Has Ecommerce: ${scrapedData.hasEcommerce}
- Has Booking System: ${scrapedData.hasBookingSystem}
- Estimated Pages: ${scrapedData.pageCount}
- Word Count: ${scrapedData.wordCount}
- Load Time: ${scrapedData.loadTimeMs}ms

Colors: ${scrapedData.colorPalette.slice(0, 6).join(', ')}
Fonts: ${scrapedData.fontFamilies.join(', ')}

Return ONLY a valid JSON object with this exact structure (no markdown, no explanation):
{
  "industry": "string",
  "subIndustry": "string",
  "businessModel": "B2B" | "B2C" | "B2B2C" | "Marketplace" | "SaaS" | "Other",
  "primaryAudience": "string",
  "maturityStage": "Early Stage" | "Growth" | "Established" | "Enterprise",
  "topPainPoints": ["string", "string", "string"],
  "competitiveAdvantages": ["string", "string"],
  "currentTechStack": ["string"],
  "aiReadinessScore": number
}`;
}

export function buildRoadmapPrompt(
  classification: object,
  croAudit: object,
  url: string
): string {
  return `Design a comprehensive AI implementation roadmap for this business.

Business URL: ${url}

BUSINESS CLASSIFICATION:
${JSON.stringify(classification, null, 2)}

CRO AUDIT SUMMARY:
${JSON.stringify(croAudit, null, 2)}

Return ONLY a valid JSON object with this exact structure (no markdown, no explanation):
{
  "executiveSummary": "string (3-4 sentences, compelling, specific to this business)",
  "phase1": {
    "title": "Quick Wins",
    "duration": "Weeks 1-8",
    "opportunities": [
      {
        "id": "string",
        "category": "Customer Support" | "Sales & Lead Gen" | "Marketing" | "Operations" | "Analytics" | "Content" | "Personalization" | "Automation",
        "title": "string",
        "description": "string",
        "businessImpact": "string",
        "implementationApproach": "string",
        "estimatedROI": "string",
        "timeToImplement": "string",
        "complexity": "Low" | "Medium" | "High",
        "priority": "Quick Win",
        "tools": ["string"],
        "successMetrics": ["string"]
      }
    ]
  },
  "phase2": {
    "title": "Strategic Growth",
    "duration": "Months 2-6",
    "opportunities": [...]
  },
  "phase3": {
    "title": "Transformative Scale",
    "duration": "Months 6-18",
    "opportunities": [...]
  },
  "totalEstimatedROI": "string — a full explanatory paragraph (2-3 sentences). Must include: percentage ROI range, incremental revenue range in dollars, approximate total investment required, and the 3-4 specific drivers that produce the return. Example format: '350-700% over 18 months: $40K-90K incremental annual revenue from a ~$8K-15K total investment, driven primarily by recovered missed inquiries, improved booking conversion, organic SEO growth, and retention-driven LTV gains.'",
  "topRecommendation": "string"
}

Include 3-4 opportunities per phase. Make recommendations highly specific to the ${url} website and its industry.`;
}
