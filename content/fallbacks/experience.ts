export type ExperienceItem = {
  title: string;
  client_type: string;
  leading_line: string;
  body: string;
  image: string;
  image_alt: string;
  display_order: number;
};

export const experienceItems: ExperienceItem[] = [
  { title: "Statewide trade association", client_type: "Trade association", leading_line: "Regulatory bill, Senate-side push.", body: " Brought in late session when a long-shaped regulatory bill suddenly moved on the Senate side. We provided procedural counsel, member-by-member outreach plan, and a coordinated communications posture for the board. The bill was held in conference and amended in line with the client position.", image: "/assets/img/inline-ff26d8af66.jpg", image_alt: "Member-by-member outreach at the Texas Capitol", display_order: 1 },
  { title: "Health care system", client_type: "Provider", leading_line: "Article II budget rider, interim through session.", body: " Eighteen months of interim preparation across LBB, agency, and member staff resulted in a rider that survived conference. The client received the funding posture it needed without becoming the public face of the appropriations debate.", image: "/assets/img/inline-9ecb5b5fee.jpg", image_alt: "Appropriations and budget rider work at the Texas Capitol", display_order: 2 },
  { title: "Local government coalition", client_type: "Public entity coalition", leading_line: "Preemption defense across two sessions.", body: " A coalition of cities facing repeat preemption efforts engaged the firm for procedural strategy and message development. Outcome was a coordinated defense across two sessions and a narrower bill than the original draft.", image: "/assets/img/inline-9a3ed06a64.jpg", image_alt: "Coalition meeting in a boardroom", display_order: 3 },
  { title: "Energy infrastructure client", client_type: "Regulated company", leading_line: "Permit reform, executive agency posture.", body: " Strategy and posture for a permit reform package, with significant executive agency engagement during interim. The package emerged from session with the structural changes the client needed and without the regulatory surprises competing proposals carried.", image: "/assets/img/inline-7b2605a7a1.jpg", image_alt: "Strategy session at the chamber", display_order: 4 },
  { title: "Policy nonprofit", client_type: "Policy organization", leading_line: "Public affairs program, contested issue.", body: " Year-round message discipline, board readiness, op-ed strategy, and rapid response to opposition framing. The client became the credible voice on its issue at the Capitol and in the press.", image: "/assets/img/inline-7ae05594c5.jpg", image_alt: "Drafting review across the table", display_order: 5 },
  { title: "Professional association", client_type: "Professional association", leading_line: "Parliamentary consult, chamber modernization.", body: " A statewide professional association needed counsel on how to advocate for legislative process changes. The firm provided parliamentary background, comparative state research, and member-by-member discussion guides.", image: "/assets/img/inline-c2276af506.jpg", image_alt: "Senate chamber discussion", display_order: 6 },
];
