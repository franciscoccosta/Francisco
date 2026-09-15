export interface TeamMember {
  id: string;
  placeholderName: string;
  nationality: { pt: string; en: string };
  initials: string;
}

export const TEAM: TeamMember[] = [
  { id: "member-1", placeholderName: "Team member", nationality: { pt: "Portugal", en: "Portugal" }, initials: "PT" },
  { id: "member-2", placeholderName: "Team member", nationality: { pt: "Portugal", en: "Portugal" }, initials: "PT" },
  { id: "member-3", placeholderName: "Team member", nationality: { pt: "Noruega", en: "Norway" }, initials: "NO" },
  { id: "member-4", placeholderName: "Team member", nationality: { pt: "Noruega", en: "Norway" }, initials: "NO" },
  { id: "member-5", placeholderName: "Team member", nationality: { pt: "Alemanha", en: "Germany" }, initials: "DE" },
  { id: "member-6", placeholderName: "Team member", nationality: { pt: "Alemanha", en: "Germany" }, initials: "DE" },
];
