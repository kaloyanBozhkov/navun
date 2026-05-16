let lastMagicLink: { email: string; url: string; timestamp: number } | null = null;

export function setLastMagicLink(email: string, url: string) {
  if (process.env.NODE_ENV !== "development") return;
  lastMagicLink = { email, url, timestamp: Date.now() };
}

export function getLastMagicLink(email: string) {
  if (process.env.NODE_ENV !== "development") return null;
  if (!lastMagicLink) return null;

  if (
    lastMagicLink.email === email &&
    Date.now() - lastMagicLink.timestamp < 5 * 60 * 1000
  ) {
    return lastMagicLink.url;
  }

  return null;
}
