export function generateTicketNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase().slice(-5);
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `PTA-TKT-${timestamp}-${randomPart}`;
}
