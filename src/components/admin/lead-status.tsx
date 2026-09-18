/** Shared status vocabulary so the badge colours never drift between screens. */
export const LEAD_STATUS_TONES: Record<
  string,
  "neutral" | "accent" | "success" | "warning" | "danger"
> = {
  NEW: "accent",
  CONTACTED: "neutral",
  QUALIFIED: "warning",
  PROPOSAL: "warning",
  WON: "success",
  LOST: "neutral",
  SPAM: "danger",
};

export const LEAD_STATUS_LABELS: Record<string, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  QUALIFIED: "Qualified",
  PROPOSAL: "Proposal",
  WON: "Won",
  LOST: "Lost",
  SPAM: "Spam",
};
