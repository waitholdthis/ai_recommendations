import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';
import type { AnalysisReport, CROIssue, AIOpportunity } from './types';

// ─── Colour system ────────────────────────────────────────────────────────────
const C = {
  primary:  '#6366F1',
  primaryDk:'#4338CA',
  dark:     '#0F0E2E',
  navy:     '#1E1B4B',
  ink:      '#1E293B',
  body:     '#374151',
  muted:    '#6B7280',
  faint:    '#9CA3AF',
  border:   '#E5E7EB',
  bg:       '#F8FAFF',
  accent:   '#EEF2FF',
  white:    '#FFFFFF',
  success:  '#16A34A',
  warning:  '#B45309',
  danger:   '#DC2626',
  orange:   '#C2410C',
  violet:   '#7C3AED',
} as const;

function scoreColor(n: number): string {
  if (n >= 80) return C.success;
  if (n >= 65) return '#4D7C0F';
  if (n >= 50) return C.warning;
  if (n >= 35) return C.orange;
  return C.danger;
}
function scoreLabel(n: number): string {
  if (n >= 80) return 'Excellent';
  if (n >= 65) return 'Good';
  if (n >= 50) return 'Fair';
  if (n >= 35) return 'Poor';
  return 'Critical';
}
function sevColor(s: string): string {
  return ({ Critical: C.danger, High: C.orange, Medium: C.warning, Low: C.primary })[s] ?? C.muted;
}
function prioColor(p: string): string {
  return ({ 'Quick Win': C.success, Strategic: C.primary, Transformative: C.violet })[p] ?? C.muted;
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const S = StyleSheet.create({
  // Pages
  coverPage: { backgroundColor: C.white, fontFamily: 'Helvetica' },
  page: { backgroundColor: C.white, fontFamily: 'Helvetica', fontSize: 9, color: C.body, paddingBottom: 52 },

  // Cover banner
  banner: { backgroundColor: C.navy, paddingHorizontal: 44, paddingTop: 44, paddingBottom: 52 },
  bannerLogo: { flexDirection: 'row', alignItems: 'center', marginBottom: 36 },
  bannerMark: { width: 30, height: 30, backgroundColor: C.primary, borderRadius: 7, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  bannerMarkText: { color: C.white, fontSize: 14, fontFamily: 'Helvetica-Bold' },
  bannerBrand: { color: C.white, fontSize: 13, fontFamily: 'Helvetica-Bold', letterSpacing: 0.3 },
  bannerTitle: { color: C.white, fontSize: 28, fontFamily: 'Helvetica-Bold', letterSpacing: -0.5, lineHeight: 1.15 },
  bannerSub: { color: 'rgba(255,255,255,0.55)', fontSize: 11, marginTop: 6 },

  // Cover body
  coverBody: { paddingHorizontal: 44, paddingTop: 36 },
  coverMeta: { marginBottom: 28 },
  coverMetaLabel: { fontSize: 8, color: C.faint, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 5 },
  coverBizName: { fontSize: 22, fontFamily: 'Helvetica-Bold', color: C.ink, letterSpacing: -0.3 },
  coverUrl: { fontSize: 10, color: C.primary, marginTop: 3 },
  coverDate: { fontSize: 9, color: C.muted, marginTop: 8 },

  // Score cards row
  scoreRow: { flexDirection: 'row', gap: 12, marginBottom: 14 },
  scoreCard: { flex: 1, borderRadius: 10, padding: 16, border: '1px solid ' + C.border },
  scoreCardLabel: { fontSize: 8, color: C.muted, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 8 },
  scoreCardValue: { fontSize: 32, fontFamily: 'Helvetica-Bold', letterSpacing: -1, lineHeight: 1 },
  scoreCardSub: { fontSize: 9, color: C.muted, marginTop: 4 },

  // Stat strip
  statRow: { flexDirection: 'row', gap: 10, marginBottom: 28 },
  statBox: { flex: 1, backgroundColor: C.bg, borderRadius: 8, padding: 12, border: '1px solid ' + C.border },
  statLabel: { fontSize: 8, color: C.faint, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 6 },
  statValue: { fontSize: 18, fontFamily: 'Helvetica-Bold', color: C.ink, letterSpacing: -0.5 },
  statSub: { fontSize: 8, color: C.muted, marginTop: 2 },

  coverFooter: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 44, paddingBottom: 28, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  coverFooterText: { fontSize: 8, color: C.faint },

  // Page header
  pageHeader: { paddingHorizontal: 40, paddingTop: 28, paddingBottom: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: C.border, marginBottom: 22 },
  pageHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  pageHeaderDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.primary },
  pageHeaderBiz: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: C.ink, letterSpacing: 0.2 },
  pageHeaderRight: { fontSize: 8, color: C.faint },
  pageContent: { paddingHorizontal: 40 },

  // Page footer
  pageFooter: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 40, paddingBottom: 18, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: C.border },
  pageFooterText: { fontSize: 7.5, color: C.faint },

  // Section headers
  sectionHeader: { marginBottom: 14 },
  sectionEyebrow: { fontSize: 7.5, fontFamily: 'Helvetica-Bold', color: C.primary, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 5 },
  sectionTitle: { fontSize: 16, fontFamily: 'Helvetica-Bold', color: C.ink, letterSpacing: -0.3, lineHeight: 1.2 },
  sectionDesc: { fontSize: 9, color: C.muted, marginTop: 6, lineHeight: 1.5 },
  divider: { borderTopWidth: 1, borderTopColor: C.border, marginBottom: 18 },

  // Two-column grid
  row: { flexDirection: 'row', gap: 14 },
  col: { flex: 1 },
  col2: { flex: 2 },

  // Info card (used in exec summary)
  infoCard: { backgroundColor: C.bg, borderRadius: 8, padding: 14, border: '1px solid ' + C.border, marginBottom: 12 },
  infoCardTitle: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: C.muted, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 10 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
  infoLabel: { fontSize: 8.5, color: C.muted, flex: 1 },
  infoValue: { fontSize: 8.5, color: C.ink, fontFamily: 'Helvetica-Bold', flex: 2, textAlign: 'right' },

  // Highlight box
  highlightBox: { backgroundColor: C.accent, borderRadius: 8, padding: 14, border: '1px solid #C7D2FE', marginBottom: 12 },
  highlightLabel: { fontSize: 7.5, fontFamily: 'Helvetica-Bold', color: C.primary, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 },
  highlightText: { fontSize: 9.5, color: C.navy, fontFamily: 'Helvetica-Bold', lineHeight: 1.4 },

  // Dimension bars
  dimRow: { marginBottom: 8 },
  dimHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 },
  dimLabel: { fontSize: 8.5, color: C.body },
  dimValue: { fontSize: 8.5, fontFamily: 'Helvetica-Bold' },
  dimTrack: { height: 5, backgroundColor: '#E9EBF8', borderRadius: 3 },
  dimFill: { height: 5, borderRadius: 3 },

  // Pill / badge
  pill: { borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2.5, fontSize: 7.5, fontFamily: 'Helvetica-Bold' },

  // Issue table
  tableHeader: { flexDirection: 'row', backgroundColor: C.bg, paddingVertical: 7, paddingHorizontal: 10, borderRadius: 5, marginBottom: 4 },
  tableHeaderText: { fontSize: 7.5, fontFamily: 'Helvetica-Bold', color: C.muted, textTransform: 'uppercase', letterSpacing: 0.5 },
  tableRow: { flexDirection: 'row', paddingVertical: 8, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  tableCell: { fontSize: 8.5, color: C.body, lineHeight: 1.4 },
  tableCellBold: { fontSize: 8.5, fontFamily: 'Helvetica-Bold', color: C.ink, lineHeight: 1.4 },

  // Quick win list
  bulletRow: { flexDirection: 'row', marginBottom: 7, gap: 6 },
  bulletDot: { fontSize: 9, color: C.primary, marginTop: 1 },
  bulletText: { fontSize: 9, color: C.body, flex: 1, lineHeight: 1.4 },

  // Opportunity card
  oppCard: { backgroundColor: C.bg, borderRadius: 8, padding: 14, border: '1px solid ' + C.border, marginBottom: 10 },
  oppHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  oppTitle: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: C.ink, flex: 1, marginRight: 8, lineHeight: 1.3 },
  oppDesc: { fontSize: 8.5, color: C.muted, lineHeight: 1.45, marginBottom: 10 },
  oppMetaRow: { flexDirection: 'row', gap: 10, marginBottom: 8 },
  oppMetaBox: { flex: 1 },
  oppMetaLabel: { fontSize: 7, color: C.faint, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 3 },
  oppMetaValue: { fontSize: 8.5, fontFamily: 'Helvetica-Bold', lineHeight: 1.2 },
  oppToolsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  oppTool: { backgroundColor: C.accent, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2.5, fontSize: 7.5, color: C.primary, fontFamily: 'Helvetica-Bold' },

  // Phase header strip
  phaseStrip: { borderRadius: 8, padding: 12, marginBottom: 14, marginTop: 10 },
  phaseNum: { fontSize: 7.5, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 3 },
  phaseTitle: { fontSize: 13, fontFamily: 'Helvetica-Bold', letterSpacing: -0.2, lineHeight: 1.2 },
  phaseDuration: { fontSize: 8, marginTop: 3 },
});

// ─── Sub-components ───────────────────────────────────────────────────────────

function PageHeader({ bizName, section, page }: { bizName: string; section: string; page: number }) {
  return (
    <View style={S.pageHeader} fixed>
      <View style={S.pageHeaderLeft}>
        <View style={S.pageHeaderDot} />
        <Text style={S.pageHeaderBiz}>{bizName}</Text>
      </View>
      <Text style={S.pageHeaderRight}>{section}</Text>
    </View>
  );
}

function PageFooter({ page }: { page?: number }) {
  return (
    <View style={S.pageFooter} fixed>
      <Text style={S.pageFooterText}>AI-BizScout · Confidential</Text>
      <Text style={S.pageFooterText} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
    </View>
  );
}

function Pill({ label, color, bg }: { label: string; color: string; bg: string }) {
  return (
    <View style={[S.pill, { backgroundColor: bg + '22', borderWidth: 1, borderColor: bg + '55' }]}>
      <Text style={{ color, fontSize: 7.5, fontFamily: 'Helvetica-Bold' }}>{label}</Text>
    </View>
  );
}

function DimBar({ label, score }: { label: string; score: number }) {
  const color = scoreColor(score);
  return (
    <View style={S.dimRow}>
      <View style={S.dimHeader}>
        <Text style={S.dimLabel}>{label}</Text>
        <Text style={[S.dimValue, { color }]}>{score}</Text>
      </View>
      <View style={S.dimTrack}>
        <View style={[S.dimFill, { width: `${score}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

// ─── Sections ─────────────────────────────────────────────────────────────────

function CoverPage({ report }: { report: AnalysisReport }) {
  const { croAudit, classification: cls, aiRoadmap } = report;
  const allOpps = [...(aiRoadmap.phase1?.opportunities ?? []), ...(aiRoadmap.phase2?.opportunities ?? []), ...(aiRoadmap.phase3?.opportunities ?? [])];
  const critHigh = croAudit.issues.filter(i => i.severity === 'Critical' || i.severity === 'High').length;
  const date = new Date(report.analyzedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <Page size="A4" style={S.coverPage}>
      {/* Banner */}
      <View style={S.banner}>
        <View style={S.bannerLogo}>
          <View style={S.bannerMark}><Text style={S.bannerMarkText}>✦</Text></View>
          <Text style={S.bannerBrand}>AI-BizScout</Text>
        </View>
        <Text style={S.bannerTitle}>Business Analysis{'\n'}Report</Text>
        <Text style={S.bannerSub}>AI Solutions Roadmap  ·  Visual CRO Audit  ·  Business Intelligence</Text>
      </View>

      {/* Body */}
      <View style={S.coverBody}>
        {/* Meta */}
        <View style={S.coverMeta}>
          <Text style={S.coverMetaLabel}>Prepared for</Text>
          <Text style={S.coverBizName}>{report.businessName}</Text>
          <Text style={S.coverUrl}>{report.url}</Text>
          <Text style={S.coverDate}>Analyzed {date}</Text>
        </View>

        {/* Score cards */}
        <View style={S.scoreRow}>
          <View style={[S.scoreCard, { borderLeftWidth: 3, borderLeftColor: scoreColor(croAudit.overallScore) }]}>
            <Text style={S.scoreCardLabel}>CRO Score</Text>
            <Text style={[S.scoreCardValue, { color: scoreColor(croAudit.overallScore) }]}>{croAudit.overallScore}</Text>
            <Text style={S.scoreCardSub}>{scoreLabel(croAudit.overallScore)} · out of 100</Text>
          </View>
          <View style={[S.scoreCard, { borderLeftWidth: 3, borderLeftColor: scoreColor(cls.aiReadinessScore) }]}>
            <Text style={S.scoreCardLabel}>AI Readiness</Text>
            <Text style={[S.scoreCardValue, { color: scoreColor(cls.aiReadinessScore) }]}>{cls.aiReadinessScore}</Text>
            <Text style={S.scoreCardSub}>{scoreLabel(cls.aiReadinessScore)} · out of 100</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={S.statRow}>
          <View style={S.statBox}>
            <Text style={S.statLabel}>Issues Found</Text>
            <Text style={S.statValue}>{croAudit.issues.length}</Text>
            <Text style={S.statSub}>{critHigh} high priority</Text>
          </View>
          <View style={S.statBox}>
            <Text style={S.statLabel}>AI Opportunities</Text>
            <Text style={S.statValue}>{allOpps.length}</Text>
            <Text style={S.statSub}>Across 3 phases</Text>
          </View>
          <View style={S.statBox}>
            <Text style={S.statLabel}>Est. Total ROI</Text>
            <Text style={[S.statValue, { fontSize: 14, color: C.primary }]}>{aiRoadmap.totalEstimatedROI || 'See report'}</Text>
            <Text style={S.statSub}>Full implementation</Text>
          </View>
        </View>

        {/* TOC */}
        <View style={[S.infoCard, { marginTop: 4 }]}>
          <Text style={S.infoCardTitle}>Table of Contents</Text>
          {[
            ['01', 'Executive Summary', 'Business profile, scores, and key insights'],
            ['02', 'CRO Audit', 'Visual analysis, issues, and quick wins'],
            ['03', 'AI Solutions Roadmap', 'Phase-by-phase AI implementation plan'],
          ].map(([num, title, desc]) => (
            <View key={num} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: C.border }}>
              <Text style={{ fontSize: 8, color: C.primary, fontFamily: 'Helvetica-Bold', width: 22 }}>{num}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', color: C.ink }}>{title}</Text>
                <Text style={{ fontSize: 8, color: C.muted, marginTop: 1 }}>{desc}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Footer */}
      <View style={S.coverFooter}>
        <Text style={S.coverFooterText}>Confidential — For internal use only</Text>
        <Text style={S.coverFooterText}>Powered by Claude Opus 4.7</Text>
      </View>
    </Page>
  );
}

function ExecSummaryPage({ report }: { report: AnalysisReport }) {
  const { classification: cls, croAudit, aiRoadmap } = report;

  return (
    <Page size="A4" style={S.page}>
      <PageHeader bizName={report.businessName} section="Executive Summary" page={2} />
      <View style={S.pageContent}>

        {/* Section heading */}
        <View style={S.sectionHeader}>
          <Text style={S.sectionEyebrow}>Section 01</Text>
          <Text style={S.sectionTitle}>Executive Summary</Text>
        </View>

        {/* Summary text + recommendation */}
        <View style={S.highlightBox}>
          <Text style={[S.highlightText, { fontSize: 9, fontFamily: 'Helvetica', lineHeight: 1.5, color: C.navy }]}>
            {aiRoadmap.executiveSummary}
          </Text>
        </View>

        <View style={[S.infoCard, { backgroundColor: '#FFFBEB', borderColor: '#FDE68A' }]}>
          <Text style={[S.highlightLabel, { color: '#92400E' }]}>Top Recommendation</Text>
          <Text style={[S.highlightText, { color: '#78350F' }]}>{aiRoadmap.topRecommendation}</Text>
        </View>

        <View style={[S.divider, { marginTop: 8 }]} />

        {/* 2-col: profile + scores */}
        <View style={S.row}>
          <View style={S.col2}>
            <View style={S.infoCard}>
              <Text style={S.infoCardTitle}>Business Profile</Text>
              {([
                ['Industry', cls.industry],
                ['Sub-industry', cls.subIndustry],
                ['Business model', cls.businessModel],
                ['Primary audience', cls.primaryAudience],
                ['Maturity stage', cls.maturityStage],
              ] as [string, string][]).map(([k, v]) => (
                <View key={k} style={S.infoRow}>
                  <Text style={S.infoLabel}>{k}</Text>
                  <Text style={S.infoValue}>{v}</Text>
                </View>
              ))}
            </View>

            <View style={S.infoCard}>
              <Text style={S.infoCardTitle}>Pain Points Identified</Text>
              {cls.topPainPoints.map((p, i) => (
                <View key={i} style={S.bulletRow}>
                  <Text style={{ color: C.orange, fontSize: 9, marginTop: 1 }}>•</Text>
                  <Text style={S.bulletText}>{p}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={S.col}>
            {/* Score cards */}
            <View style={[S.infoCard, { alignItems: 'center', paddingVertical: 18 }]}>
              <Text style={S.infoCardTitle}>CRO Score</Text>
              <Text style={[S.scoreCardValue, { color: scoreColor(croAudit.overallScore), fontSize: 40 }]}>{croAudit.overallScore}</Text>
              <Text style={[S.scoreCardSub, { textAlign: 'center' }]}>{scoreLabel(croAudit.overallScore)}</Text>
            </View>
            <View style={[S.infoCard, { alignItems: 'center', paddingVertical: 18 }]}>
              <Text style={S.infoCardTitle}>AI Readiness</Text>
              <Text style={[S.scoreCardValue, { color: scoreColor(cls.aiReadinessScore), fontSize: 40 }]}>{cls.aiReadinessScore}</Text>
              <Text style={[S.scoreCardSub, { textAlign: 'center' }]}>{scoreLabel(cls.aiReadinessScore)}</Text>
            </View>
            {cls.currentTechStack.length > 0 && (
              <View style={S.infoCard}>
                <Text style={S.infoCardTitle}>Tech Stack Detected</Text>
                <View style={S.oppToolsRow}>
                  {cls.currentTechStack.slice(0, 8).map(t => (
                    <Text key={t} style={S.oppTool}>{t}</Text>
                  ))}
                </View>
              </View>
            )}
          </View>
        </View>

        {/* CRO dimensions */}
        <View style={S.infoCard}>
          <Text style={S.infoCardTitle}>CRO Score Breakdown</Text>
          <View style={[S.row, { gap: 20 }]}>
            <View style={S.col}>
              {[['Hero Section', croAudit.heroScore], ['Navigation', croAudit.navigationScore], ['Call-to-Action', croAudit.ctaScore], ['Social Proof', croAudit.socialProofScore]].map(([l, s]) => (
                <DimBar key={l as string} label={l as string} score={s as number} />
              ))}
            </View>
            <View style={S.col}>
              {[['Mobile UX', croAudit.mobileScore], ['Trust Signals', croAudit.trustScore], ['Content Quality', croAudit.contentScore]].map(([l, s]) => (
                <DimBar key={l as string} label={l as string} score={s as number} />
              ))}
            </View>
          </View>
        </View>

        {/* Quick wins */}
        {croAudit.quickWins.length > 0 && (
          <View style={[S.infoCard, { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' }]}>
            <Text style={[S.infoCardTitle, { color: '#166534' }]}>Quick Wins — Immediate Actions</Text>
            {croAudit.quickWins.map((w, i) => (
              <View key={i} style={S.bulletRow}>
                <Text style={{ color: C.success, fontSize: 9, marginTop: 1 }}>→</Text>
                <Text style={S.bulletText}>{w}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
      <PageFooter />
    </Page>
  );
}

function CROAuditPage({ report }: { report: AnalysisReport }) {
  const { croAudit } = report;
  const sorted = [...croAudit.issues].sort((a, b) =>
    ['Critical', 'High', 'Medium', 'Low'].indexOf(a.severity) - ['Critical', 'High', 'Medium', 'Low'].indexOf(b.severity)
  );

  return (
    <Page size="A4" style={S.page}>
      <PageHeader bizName={report.businessName} section="CRO Audit" page={3} />
      <View style={S.pageContent}>

        <View style={S.sectionHeader}>
          <Text style={S.sectionEyebrow}>Section 02</Text>
          <Text style={S.sectionTitle}>Conversion Rate Optimisation Audit</Text>
          <Text style={S.sectionDesc}>
            Multimodal AI analysis of your website screenshot identified {croAudit.issues.length} conversion issues across {new Set(croAudit.issues.map(i => i.category)).size} categories.
          </Text>
        </View>

        {/* Issues table */}
        <View style={S.tableHeader}>
          <Text style={[S.tableHeaderText, { width: '12%' }]}>Severity</Text>
          <Text style={[S.tableHeaderText, { width: '13%' }]}>Category</Text>
          <Text style={[S.tableHeaderText, { width: '27%' }]}>Issue</Text>
          <Text style={[S.tableHeaderText, { flex: 1 }]}>Recommendation</Text>
          <Text style={[S.tableHeaderText, { width: '10%', textAlign: 'right' }]}>Lift</Text>
        </View>

        {sorted.map((issue) => (
          <View key={issue.id} style={S.tableRow} wrap={false}>
            <View style={{ width: '12%', justifyContent: 'flex-start', paddingTop: 1 }}>
              <View style={[S.pill, { backgroundColor: sevColor(issue.severity) + '18', borderWidth: 1, borderColor: sevColor(issue.severity) + '40', alignSelf: 'flex-start' }]}>
                <Text style={{ color: sevColor(issue.severity), fontSize: 7, fontFamily: 'Helvetica-Bold' }}>{issue.severity}</Text>
              </View>
            </View>
            <Text style={[S.tableCell, { width: '13%', color: C.muted }]}>{issue.category}</Text>
            <Text style={[S.tableCellBold, { width: '27%', paddingRight: 6 }]}>{issue.title}</Text>
            <Text style={[S.tableCell, { flex: 1, paddingRight: 8, lineHeight: 1.35 }]}>{issue.recommendation}</Text>
            <Text style={[S.tableCellBold, { width: '10%', textAlign: 'right', color: C.success }]}>{issue.conversionLift}</Text>
          </View>
        ))}

        {/* Impact table legend */}
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 12, marginBottom: 18 }}>
          {(['Critical', 'High', 'Medium', 'Low'] as const).map(s => (
            <View key={s} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <View style={{ width: 7, height: 7, borderRadius: 2, backgroundColor: sevColor(s) }} />
              <Text style={{ fontSize: 7.5, color: C.muted }}>{s}: {sorted.filter(i => i.severity === s).length}</Text>
            </View>
          ))}
        </View>

        {/* Strengths */}
        {croAudit.strengths.length > 0 && (
          <View style={[S.infoCard, { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0' }]}>
            <Text style={[S.infoCardTitle, { color: '#166534' }]}>Website Strengths</Text>
            {croAudit.strengths.map((s, i) => (
              <View key={i} style={S.bulletRow}>
                <Text style={{ color: C.success, fontSize: 9, marginTop: 1 }}>✓</Text>
                <Text style={S.bulletText}>{s}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
      <PageFooter />
    </Page>
  );
}

function RoadmapPage({ report }: { report: AnalysisReport }) {
  const { aiRoadmap } = report;
  const phases = [
    { data: aiRoadmap.phase1, num: 1, color: C.success,  bg: '#F0FDF4', border: '#BBF7D0', textColor: '#166534' },
    { data: aiRoadmap.phase2, num: 2, color: C.primary,  bg: C.accent,  border: '#C7D2FE', textColor: C.navy },
    { data: aiRoadmap.phase3, num: 3, color: C.violet,   bg: '#F5F3FF', border: '#DDD6FE', textColor: '#4C1D95' },
  ];

  return (
    <Page size="A4" style={S.page}>
      <PageHeader bizName={report.businessName} section="AI Solutions Roadmap" page={4} />
      <View style={S.pageContent}>

        <View style={S.sectionHeader}>
          <Text style={S.sectionEyebrow}>Section 03</Text>
          <Text style={S.sectionTitle}>AI Solutions Roadmap</Text>
          <Text style={S.sectionDesc}>{aiRoadmap.executiveSummary}</Text>
        </View>

        {aiRoadmap.totalEstimatedROI && (
          <View style={[S.highlightBox, { marginBottom: 16 }]}>
            <Text style={S.highlightLabel}>Total Estimated ROI — Full Implementation</Text>
            <Text style={[S.highlightText, { fontSize: 18, color: C.primary, letterSpacing: -0.3 }]}>{aiRoadmap.totalEstimatedROI}</Text>
          </View>
        )}

        {phases.map(({ data, num, color, bg, border, textColor }) => {
          if (!data?.opportunities?.length) return null;
          return (
            <View key={num} wrap={false}>
              <View style={[S.phaseStrip, { backgroundColor: bg, border: '1px solid ' + border }]}>
                <Text style={[S.phaseNum, { color }]}>Phase {num} · {data.duration}</Text>
                <Text style={[S.phaseTitle, { color: textColor }]}>{data.title}</Text>
                <Text style={[S.phaseDuration, { color: textColor + 'AA' }]}>{data.opportunities.length} opportunities identified</Text>
              </View>

              {data.opportunities.map((opp) => (
                <OpportunityBlock key={opp.id} opp={opp} accentColor={color} />
              ))}
            </View>
          );
        })}
      </View>
      <PageFooter />
    </Page>
  );
}

function OpportunityBlock({ opp, accentColor }: { opp: AIOpportunity; accentColor: string }) {
  return (
    <View style={S.oppCard} wrap={false}>
      <View style={S.oppHeader}>
        <Text style={S.oppTitle}>{opp.title}</Text>
        <View style={{ flexDirection: 'row', gap: 4, flexShrink: 0 }}>
          <View style={[S.pill, { backgroundColor: prioColor(opp.priority) + '18', borderWidth: 1, borderColor: prioColor(opp.priority) + '40' }]}>
            <Text style={{ color: prioColor(opp.priority), fontSize: 7, fontFamily: 'Helvetica-Bold' }}>{opp.priority}</Text>
          </View>
          <View style={[S.pill, { backgroundColor: C.bg, borderWidth: 1, borderColor: C.border }]}>
            <Text style={{ color: C.muted, fontSize: 7 }}>{opp.category}</Text>
          </View>
        </View>
      </View>

      <Text style={S.oppDesc}>{opp.description}</Text>

      <View style={S.oppMetaRow}>
        <View style={S.oppMetaBox}>
          <Text style={S.oppMetaLabel}>Est. ROI</Text>
          <Text style={[S.oppMetaValue, { color: C.success }]}>{opp.estimatedROI}</Text>
        </View>
        <View style={S.oppMetaBox}>
          <Text style={S.oppMetaLabel}>Timeline</Text>
          <Text style={[S.oppMetaValue, { color: accentColor }]}>{opp.timeToImplement}</Text>
        </View>
        <View style={S.oppMetaBox}>
          <Text style={S.oppMetaLabel}>Complexity</Text>
          <Text style={[S.oppMetaValue, { color: C.body }]}>{opp.complexity}</Text>
        </View>
        <View style={[S.oppMetaBox, { flex: 2 }]}>
          <Text style={S.oppMetaLabel}>Business Impact</Text>
          <Text style={[S.tableCell, { lineHeight: 1.3 }]}>{opp.businessImpact}</Text>
        </View>
      </View>

      {opp.tools.length > 0 && (
        <View style={S.oppToolsRow}>
          <Text style={[S.oppMetaLabel, { marginRight: 6, marginTop: 2 }]}>Tools:</Text>
          {opp.tools.slice(0, 6).map(t => (
            <Text key={t} style={S.oppTool}>{t}</Text>
          ))}
        </View>
      )}
    </View>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export function BizScoutPDF({ report }: { report: AnalysisReport }) {
  return (
    <Document
      title={`AI-BizScout Report — ${report.businessName}`}
      author="AI-BizScout"
      subject="Business Analysis Report"
      creator="AI-BizScout powered by Claude Opus 4.7"
    >
      <CoverPage report={report} />
      <ExecSummaryPage report={report} />
      <CROAuditPage report={report} />
      <RoadmapPage report={report} />
    </Document>
  );
}
