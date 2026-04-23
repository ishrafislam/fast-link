export function formatRelativeDate(isoDate: string | null): string {
  if (!isoDate) {
    return 'Unknown';
  }

  const date = new Date(isoDate);
  const now = Date.now();
  const diffHours = Math.round((now - date.getTime()) / (1000 * 60 * 60));

  if (diffHours < 24) {
    return `${Math.max(diffHours, 0)}h ago`;
  }

  const diffDays = Math.round(diffHours / 24);
  if (diffDays < 30) {
    return `${diffDays}d ago`;
  }

  return date.toLocaleDateString();
}
