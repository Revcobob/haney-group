export type IndustryCard = {
  title: string;
  description: string;
  image: string;
  display_order: number;
};

export const industryCards: IndustryCard[] = [
  { title: "Healthcare", description: "Managed care, hospitals, physician groups, Medicaid, reimbursement, scope of practice, and access to care.", image: "/assets/img/card-healthcare-policy.png", display_order: 1 },
  { title: "Local Government", description: "Cities, counties, special districts, and the recurring preemption questions that shape what local entities can and cannot do.", image: "/assets/img/card-local-government.png", display_order: 2 },
  { title: "Infrastructure & Water", description: "Capital appropriations, permitting, water supply, infrastructure planning, and the agencies that regulate long-term projects.", image: "/assets/img/card-infrastructrure-water.png", display_order: 3 },
  { title: "Real Estate & Land Use", description: "Property rights, housing, land use, and association priorities that require agreement among members before a bill can move.", image: "/assets/img/card-real-estate-land.png", display_order: 4 },
  { title: "Economic Development", description: "Incentive programs, regional projects, and statewide growth policy, including the interim work needed before filing.", image: "/assets/img/card-economic-development.png", display_order: 5 },
  { title: "Regulated Industries", description: "Legislation and agency action affecting regulated businesses, including issues likely to draw public or political attention.", image: "/assets/img/card-regulated-industries.png", display_order: 6 },
  { title: "Education", description: "Public schools, higher education, funding formulas, budget riders, and legislation with statewide public attention.", image: "/assets/img/card-education.png", display_order: 7 },
  { title: "Public Policy & Procedure", description: "Bill development for associations, coalitions, and policy organizations, plus advice on chamber rules and operations.", image: "/assets/img/card-public-policy.png", display_order: 8 },
  { title: "Transportation", description: "Transportation funding, automobiles, infrastructure, commuter rail, and the agencies that administer those programs.", image: "/assets/img/card-transportation.png", display_order: 9 },
];
