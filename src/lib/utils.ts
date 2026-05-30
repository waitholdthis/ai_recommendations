export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function scoreToColor(score: number): string {
  if (score >= 80) return '#10B981';
  if (score >= 60) return '#F59E0B';
  if (score >= 40) return '#F97316';
  return '#EF4444';
}

export function scoreToLabel(score: number): string {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Needs Work';
  return 'Critical';
}

export function formatUrl(url: string): string {
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
    return parsed.hostname.replace('www.', '');
  } catch {
    return url;
  }
}

export function normalizeUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

export function severityToColor(severity: string): string {
  switch (severity) {
    case 'Critical': return '#EF4444';
    case 'High': return '#F97316';
    case 'Medium': return '#F59E0B';
    case 'Low': return '#6366F1';
    default: return '#94A3B8';
  }
}

export function priorityToColor(priority: string): string {
  switch (priority) {
    case 'Quick Win': return '#10B981';
    case 'Strategic': return '#6366F1';
    case 'Transformative': return '#A78BFA';
    default: return '#94A3B8';
  }
}

export function effortToColor(effort: string): string {
  switch (effort) {
    case 'Low': return '#10B981';
    case 'Medium': return '#F59E0B';
    case 'High': return '#EF4444';
    default: return '#94A3B8';
  }
}
