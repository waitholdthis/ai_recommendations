export interface ScrapedData {
  url: string;
  title: string;
  metaDescription: string;
  h1Tags: string[];
  h2Tags: string[];
  h3Tags: string[];
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
  // enriched signals
  formCount: number;
  videoCount: number;
  hasHeroVideo: boolean;
  imageCount: number;
  testimonialCount: number;
  hasReviewWidget: boolean;
  hasPricingPage: boolean;
  hasFreeTrialOrDemo: boolean;
  hasCaseStudies: boolean;
  hasNewsletterSignup: boolean;
  hasPressLogos: boolean;
  socialMediaLinks: string[];
  hasSocialProofSection: boolean;
  hasAwardsBadges: boolean;
  hasStickyNav: boolean;
  paragraphTexts: string[];
  imagesWithAltCount: number;
}

export interface BusinessClassification {
  industry: string;
  subIndustry: string;
  businessModel: 'B2B' | 'B2C' | 'B2B2C' | 'Marketplace' | 'SaaS' | 'DTC' | 'Enterprise' | 'Other';
  revenueModel: string;
  primaryAudience: string;
  secondaryAudience: string;
  maturityStage: 'Pre-Revenue' | 'Early Stage' | 'Growth' | 'Established' | 'Enterprise';
  marketPositioning: 'Premium / Luxury' | 'Mid-Market' | 'Value / Budget' | 'Niche Specialist' | 'Mass Market';
  brandVoice: string;
  topPainPoints: string[];
  customerJobsToBeDone: string[];
  competitiveAdvantages: string[];
  competitiveMoat: string;
  currentTechStack: string[];
  missingTechSignals: string[];
  aiReadinessScore: number;
  digitalMaturityScore: number;
  growthSignals: string[];
  keyConversionBarriers: string[];
}

export interface CROIssue {
  id: string;
  category: 'Hero' | 'Navigation' | 'CTA' | 'Social Proof' | 'Forms' | 'Mobile' | 'Speed' | 'Trust' | 'Content' | 'Design' | 'Accessibility' | 'SEO' | 'Brand' | 'Copy' | 'Pricing' | 'Video' | 'Personalization';
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  title: string;
  description: string;
  screenshotObservation: string;
  recommendation: string;
  specificCopySuggestion?: string;
  abTestHypothesis: string;
  benchmarkComparison: string;
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
  accessibilityScore: number;
  seoScore: number;
  performanceScore: number;
  brandConsistencyScore: number;
  copyQualityScore: number;
  valuePropositionScore: number;
  executiveSummary: string;
  issues: CROIssue[];
  quickWins: string[];
  strengths: string[];
}

export interface AIOpportunity {
  id: string;
  category: 'Customer Support' | 'Sales & Lead Gen' | 'Marketing' | 'Operations' | 'Analytics' | 'Content' | 'Personalization' | 'Automation' | 'Data & Intelligence' | 'Experience' | 'Revenue Operations';
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
  buildVsBuy: string;
  riskFactors: string[];
  integrationRequirements: string[];
}

export interface TootieServiceFit {
  recommendedTootiePackage: 'Website Launch' | 'Conversion Landing Page' | 'Digital System Build' | 'Website Redesign' | 'Growth Retainer' | 'Custom';
  fitRationale: string;
  priorityFixSequence: string[];
  leadQualificationSignals: string[];
  budgetSensitivity: string;
  suggestedNextStep: string;
}

export interface ClientContactBrief {
  plainEnglishVerdict: string;
  whyItMatters: string;
  whatToAskTootie: string[];
  salesConversationStarters: string[];
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
  clientContactBrief?: ClientContactBrief;
  tootieServiceFit?: TootieServiceFit;
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
