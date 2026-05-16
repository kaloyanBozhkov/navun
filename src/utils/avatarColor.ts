const AVATAR_COLORS = [
  "#6366F1",
  "#3B82F6",
  "#22C55E",
  "#F97316",
  "#EF4444",
  "#A855F7",
];

export function getAvatarColor(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i++)
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]!;
}
