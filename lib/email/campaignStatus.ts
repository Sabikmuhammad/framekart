export function calculateRates(stats?: {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  failed: number;
  bounced: number;
}) {
  const sent = stats?.sent || 0;
  const delivered = stats?.delivered || 0;
  const opened = stats?.opened || 0;
  const clicked = stats?.clicked || 0;

  return {
    sent,
    delivered,
    opened,
    clicked,
    failed: stats?.failed || 0,
    bounced: stats?.bounced || 0,
    openRate: delivered ? Math.round((opened / delivered) * 100) : 0,
    clickRate: delivered ? Math.round((clicked / delivered) * 100) : 0,
  };
}
