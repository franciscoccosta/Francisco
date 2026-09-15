export interface TeamMember {
  id: string;
  placeholderName: string;
  nationality: { pt: string; en: string; es: string; fr: string; de: string; no: string };
  initials: string;
}

export const TEAM: TeamMember[] = [
  { id: "member-1", placeholderName: "Team member", nationality: { pt: "Portugal", en: "Portugal", es: "Portugal", fr: "Portugal", de: "Portugal", no: "Portugal" }, initials: "PT" },
  { id: "member-2", placeholderName: "Team member", nationality: { pt: "Portugal", en: "Portugal", es: "Portugal", fr: "Portugal", de: "Portugal", no: "Portugal" }, initials: "PT" },
  { id: "member-3", placeholderName: "Team member", nationality: { pt: "Noruega", en: "Norway", es: "Noruega", fr: "Norvège", de: "Norwegen", no: "Norge" }, initials: "NO" },
  { id: "member-4", placeholderName: "Team member", nationality: { pt: "Noruega", en: "Norway", es: "Noruega", fr: "Norvège", de: "Norwegen", no: "Norge" }, initials: "NO" },
  { id: "member-5", placeholderName: "Team member", nationality: { pt: "Alemanha", en: "Germany", es: "Alemania", fr: "Allemagne", de: "Deutschland", no: "Tyskland" }, initials: "DE" },
  { id: "member-6", placeholderName: "Team member", nationality: { pt: "Alemanha", en: "Germany", es: "Alemania", fr: "Allemagne", de: "Deutschland", no: "Tyskland" }, initials: "DE" },
];
