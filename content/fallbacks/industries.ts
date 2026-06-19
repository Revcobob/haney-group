export type IndustryCard = {
  title: string;
  description: string;
  image: string;
  display_order: number;
};

export const industryCards: IndustryCard[] = [
  { title: "Healthcare", description: "Managed care, hospitals, physician groups, and Medicaid policy. The firm supports clients across health care reimbursement, scope of practice, and access policy.", image: "/assets/img/card-healthcare-policy.png", display_order: 1 },
  { title: "Local Government", description: "Cities, counties, special districts, and the recurring preemption questions that shape what local entities can and cannot do.", image: "/assets/img/card-local-government.png", display_order: 2 },
  { title: "Infrastructure & Water", description: "Capital appropriations, permitting, and the regulators of the next decade. Long-cycle issues that require interim and session work in equal measure.", image: "/assets/img/card-infrastructrure-water.png", display_order: 3 },
  { title: "Real Estate & Land Use", description: "Property rights, housing policy, and association-led advocacy. Sector posture that has to balance member alignment with achievable legislation.", image: "/assets/img/card-real-estate-land.png", display_order: 4 },
  { title: "Economic Development", description: "Incentive programs, regional priorities, and statewide growth policy. Including the interim work that determines what is even introduced.", image: "/assets/img/card-economic-development.png", display_order: 5 },
  { title: "Regulated Industries", description: "High-visibility issues that turn on member relationships and disciplined communications across the session arc.", image: "/assets/img/card-regulated-industries.png", display_order: 6 },
  { title: "Education", description: "Higher education, public schools, and the budget riders that decide policy in practice. Communications discipline for issues that arrive with public attention.", image: "/assets/img/card-education.png", display_order: 7 },
  { title: "Public Policy & Procedure", description: "Associations, coalitions, and policy organizations preparing for session — and for institutional process work on how chambers operate.", image: "/assets/img/card-public-policy.png", display_order: 8 },
  { title: "Transportation", description: "Transportation issues across the Capitol and the agencies that implement them, including funding, automobiles, infrastructure, and commuter rail.", image: "/assets/img/card-transportation.png", display_order: 9 },
];
