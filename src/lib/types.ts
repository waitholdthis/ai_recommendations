export interface ScrapedData {
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
  loadTimeMs: number;
  screenshotBase64: string;
  screenshotMimeType: 'image/png' | 'image/jpeg';
  wordCount: number;
  internalLinks: number;
  externalLinks: number;
  hasSSL: boolean;
  mobileViewport: boolean;
}

export interface BusinessClassification {
  industry: string;
  subIndustry: string;
  businessModel: 'B2B' | 'B2C' | 'B2B2C' | 'Marketplace' | 'SaaS' | 'Other';
  primaryAudience: string;
  maturityStage: 'Early Stage' | 'Growth' | 'Established' | 'Enterprise';
  topPainPoints: string[];
  competitiveAdvantages: string[];
  currentTechStack: string[];
  aiReadinessScore: number;
}

export interface CROIssue {
  id: string;
  category: 'Hero' | 'Navigation' | 'CTA' | 'Social Proof' | 'Forms' | 'Mobile' | 'Speed' | 'Trust' | 'Content' | 'Design';
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  title: string;
  description: string;
  recommendation: string;
  estimatedImpact: 'High' | 'Medium' | 'Low';
  effort: 'High' | 'Medium' | 'Low';
  conversionLift: string;
}

export interface CROAudit {
  overallScore: number;
  heroScore: number;
  navigationScore: number;
  ctaScore: number;
  socialProofScore: number;
  mobileScore: number;
  trustScore: number;
  contentScore: number;
  issues: CROIssue[];
  quickWins: string[];
  strengths: string[];
}

export interface AIOpportunity {
  id: string;
  category: 'Customer Support' | 'Sales & Lead Gen' | 'Marketing' | 'Operations' | 'Analytics' | 'Content' | 'Personalization' | 'Automation';
  title: string;
  description: string;
  businessImpact: string;
  implementationApproach: string;
  estimatedROI: string;
  timeToImplement: string;
  complexity: 'Low' | 'Medium' | 'High';
  priority: 'Quick Win' | 'Strategic' | 'Transformative';
  tools: string[];
  successMetrics: string[];
}

export interface AIRoadmap {
  executiveSummary: string;
  phase1: {
    title: string;
    duration: string;
    opportunities: AIOpportunity[];
  };
  phase2: {
    title: string;
    duration: string;
    opportunities: AIOpportunity[];
  };
  phase3: {
    title: string;
    duration: string;
    opportunities: AIOpportunity[];
  };
  totalEstimatedROI: string;
  topRecommendation: string;
}

export interface AnalysisReport {
  id: string;
  url: string;
  analyzedAt: string;
  businessName: string;
  classification: BusinessClassification;
  croAudit: CROAudit;
  aiRoadmap: AIRoadmap;
}

export type ProgressStage =
  | 'initializing'
  | 'scraping'
  | 'classifying'
  | 'visual_analysis'
  | 'roadmap'
  | 'finalizing'
  | 'complete'
  | 'error';

export interface ProgressUpdate {
  stage: ProgressStage;
  message: string;
  progress: number;
  data?: Partial<AnalysisReport>;
  error?: string;
}
