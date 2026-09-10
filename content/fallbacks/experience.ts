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
  { title: "Statewide trade association", client_type: "Trade association", leading_line: "Regulatory bill, late Senate movement.", body: " The firm was retained after a regulatory bill began moving late in session. We reviewed the procedural options, prepared a member-by-member outreach plan, and briefed the board. The bill was held in conference and amended to address the client’s position.", image: "/assets/img/inline-ff26d8af66.jpg", image_alt: "Member-by-member outreach at the Texas Capitol", display_order: 1 },
  { title: "Health care system", client_type: "Provider", leading_line: "Article II budget rider, interim through session.", body: " We spent eighteen months working with the LBB, the agency, Members, and staff. The rider survived conference and addressed the client’s funding need without making the client the public face of the debate.", image: "/assets/img/inline-9ecb5b5fee.jpg", image_alt: "Appropriations and budget rider work at the Texas Capitol", display_order: 2 },
  { title: "Local government coalition", client_type: "Public entity coalition", leading_line: "Preemption defense across two sessions.", body: " A coalition of cities retained the firm during repeated preemption efforts. We advised on procedure, coordinated the member organizations, and prepared the legislative message. The final bill was narrower than the original draft.", image: "/assets/img/inline-9a3ed06a64.jpg", image_alt: "Coalition meeting in a boardroom", display_order: 3 },
  { title: "Energy infrastructure client", client_type: "Regulated company", leading_line: "Permit reform and agency engagement.", body: " We developed a permit reform proposal and worked with the executive agency during the interim. The enacted package included the structural changes the client needed and avoided problems found in competing proposals.", image: "/assets/img/inline-7b2605a7a1.jpg", image_alt: "Strategy session at the chamber", display_order: 4 },
  { title: "Policy nonprofit", client_type: "Policy organization", leading_line: "Public affairs on a contested issue.", body: " We prepared the legislative message, briefed the board, developed op-eds, and answered opposition claims. The work gave the client a consistent position at the Capitol and in the press.", image: "/assets/img/inline-7ae05594c5.jpg", image_alt: "Drafting review across the table", display_order: 5 },
  { title: "Professional association", client_type: "Professional association", leading_line: "Parliamentary advice on chamber modernization.", body: " A statewide professional association sought changes to legislative procedure. The firm provided parliamentary analysis, research from other states, and discussion guides for meetings with Members.", image: "/assets/img/inline-c2276af506.jpg", image_alt: "Senate chamber discussion", display_order: 6 },
];
