import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('public app is branded as the Tootie Website Growth Audit powered by AI-BizScout', () => {
  const page = read('src/app/page.tsx');
  const layout = read('src/app/layout.tsx');
  const pdf = read('src/lib/pdf-document.tsx');

  for (const source of [page, layout, pdf]) {
    assert.match(source, /Tootie Website Growth Audit/);
    assert.match(source, /AI-BizScout/);
  }
});

test('analysis prompt requests client-contact-ready sales context and service fit', () => {
  const prompts = read('src/lib/prompts.ts');

  for (const required of [
    'clientContactBrief',
    'tootieServiceFit',
    'recommendedTootiePackage',
    'salesConversationStarters',
    'priorityFixSequence',
    'leadQualificationSignals',
  ]) {
    assert.match(prompts, new RegExp(required));
  }
});

test('report UI exposes the Tootie handoff context before export/contact', () => {
  const summary = read('src/components/report/ExecutiveSummary.tsx');
  const viewer = read('src/components/report/ReportViewer.tsx');

  assert.match(summary, /Tootie Handoff Brief/);
  assert.match(summary, /Recommended Tootie Package/);
  assert.match(summary, /Sales Conversation Starters/);
  assert.match(summary, /What To Ask Tootie Designs/);
  assert.match(summary, /Lead Qualification Signals/);
  assert.match(summary, /Suggested Next Step/);
  assert.match(viewer, /Website Growth Audit/);
  assert.match(viewer, /tootie-growth-audit-/);
});
