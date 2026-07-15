export const DEAL_STAGES = [
  "Cold",
  "New Registration",
  "Intro Call Scheduled",
  "Reviewing Opportunities",
  "Completing Paperwork",
  "Closing",
  "Closed",
];

export const PERSON_STATUSES = [
  "Cold",
  "Accredited",
  "Not Accredited",
  "Do Not Market",
  "Existing Client",
];

export type Person = {
  id: string;
  name: string;
  role: string;
  state: string;
  timezone: string;
  status: string;
  portal: boolean;
  crsReceived: boolean;
  heat: number;
  lastTouch: string;
  registered: string;
  emails: string[];
  phones: string[];
  exchangeStatus: string;
  saleClosing: string;
  idDeadline: string;
  fortyFiveDay: string;
  oneEightyDay: string;
  intermediary: string;
  maritalStatus: string;
  netWorth: string;
  accreditation: string;
  likeProperties: string[];
  avoidProperties: string[];
  likeRegions: string[];
  avoidRegions: string[];
  goals: string[];
  heardVia: string;
  googleContacts: "saved" | "unconfirmed";
  linkedin: string;
  driveUrl: string;
  emailCount: number;
  meetingCount: number;
  offeringCount: number;
};

export type Deal = {
  id: string;
  name: string;
  type: "1031 exchange" | "Cash investment";
  personId: string;
  stage: string;
  statusLine: string;
  keyDate: string;
  keyDateLabel: string;
  idDeadline?: string;
  lastTouch: string;
  heat: number;
  owner: string;
  equity: number;
  debt: number;
  total: number;
  ltv: number;
  note: string;
};

export type Task = {
  id: string;
  title: string;
  dueDate: string;
  priority: "High" | "Normal";
  personId?: string;
  dealId?: string;
  done: boolean;
};

export type Meeting = {
  id: string;
  title: string;
  date: string;
  time: string;
  source: "Cal.com" | "Google Calendar";
  status: "upcoming" | "past" | "no-show";
  personId?: string;
  dealId?: string;
};

export type Offering = {
  id: string;
  name: string;
  sponsor: string;
  type: string;
  status: string;
  personId: string;
  dealId: string;
  feedback: "Thumbs up" | "Thumbs down" | "Invested";
  viewed: string[];
  url: string;
};

export const PEOPLE: Person[] = [
  {
    id: "eric",
    name: "Eric",
    role: "Financial advisor",
    state: "New Mexico",
    timezone: "MDT",
    status: "Accredited",
    portal: true,
    crsReceived: true,
    heat: 82,
    lastTouch: "2026-07-11",
    registered: "2026-07-08",
    emails: ["eric@example.com", "eric.advisor@example.com"],
    phones: ["(575) 555-8500", "(575) 555-8501"],
    exchangeStatus: "Planning — selling soon",
    saleClosing: "2026-08-15",
    idDeadline: "2026-09-29",
    fortyFiveDay: "2026-09-29",
    oneEightyDay: "2027-02-11",
    intermediary: "Yes",
    maritalStatus: "Single",
    netWorth: "Over $5M",
    accreditation: "Likely accredited — net-worth test",
    likeProperties: ["Industrial", "No preference"],
    avoidProperties: ["Data Center", "Office", "Hospitality", "Land / Development"],
    likeRegions: ["South", "West"],
    avoidRegions: ["Northeast"],
    goals: ["Monthly income"],
    heardVia: "Advisor / CPA",
    googleContacts: "saved",
    linkedin: "Found possible match",
    driveUrl: "https://drive.google.com/drive/folders/example-eric",
    emailCount: 4,
    meetingCount: 4,
    offeringCount: 3,
  },
  {
    id: "maya-patel",
    name: "Maya Patel",
    role: "Business owner",
    state: "Texas",
    timezone: "CDT",
    status: "Existing Client",
    portal: true,
    crsReceived: true,
    heat: 74,
    lastTouch: "2026-07-08",
    registered: "2026-06-22",
    emails: ["maya.patel@example.com"],
    phones: ["(214) 555-0182"],
    exchangeStatus: "Replacement property search",
    saleClosing: "2026-09-06",
    idDeadline: "2026-10-21",
    fortyFiveDay: "2026-10-21",
    oneEightyDay: "2027-03-05",
    intermediary: "Yes",
    maritalStatus: "Married",
    netWorth: "$1M–$5M",
    accreditation: "Accredited — income test",
    likeProperties: ["Multifamily", "Industrial"],
    avoidProperties: ["Hospitality"],
    likeRegions: ["Southwest"],
    avoidRegions: [],
    goals: ["Monthly income", "Diversification"],
    heardVia: "Existing client",
    googleContacts: "saved",
    linkedin: "Found possible match",
    driveUrl: "https://drive.google.com/drive/folders/example-maya",
    emailCount: 2,
    meetingCount: 1,
    offeringCount: 2,
  },
  {
    id: "daniel-ortiz",
    name: "Daniel Ortiz",
    role: "Business owner",
    state: "Arizona",
    timezone: "MST",
    status: "Not Accredited",
    portal: false,
    crsReceived: false,
    heat: 61,
    lastTouch: "2026-06-29",
    registered: "2025-03-10",
    emails: ["daniel.ortiz@example.com"],
    phones: ["(602) 555-0144"],
    exchangeStatus: "Historical exchange",
    saleClosing: "2023-03-04",
    idDeadline: "2023-04-18",
    fortyFiveDay: "2023-04-18",
    oneEightyDay: "2023-08-31",
    intermediary: "Yes",
    maritalStatus: "Married",
    netWorth: "$500K–$1M",
    accreditation: "Not accredited",
    likeProperties: ["Industrial"],
    avoidProperties: ["Office"],
    likeRegions: ["West"],
    avoidRegions: [],
    goals: ["1031 Exchange"],
    heardVia: "Website",
    googleContacts: "unconfirmed",
    linkedin: "No match confirmed",
    driveUrl: "https://drive.google.com/drive/folders/example-daniel",
    emailCount: 1,
    meetingCount: 1,
    offeringCount: 1,
  },
  {
    id: "olivia-chen",
    name: "Olivia Chen",
    role: "Real estate investor",
    state: "Colorado",
    timezone: "MDT",
    status: "Accredited",
    portal: true,
    crsReceived: true,
    heat: 48,
    lastTouch: "2026-07-04",
    registered: "2026-06-18",
    emails: ["olivia.chen@example.com", "olivia@chenholdings.example"],
    phones: ["(303) 555-0131"],
    exchangeStatus: "Cash investment",
    saleClosing: "2026-07-30",
    idDeadline: "2026-07-30",
    fortyFiveDay: "N/A",
    oneEightyDay: "N/A",
    intermediary: "N/A",
    maritalStatus: "Single",
    netWorth: "$1M–$5M",
    accreditation: "Likely accredited — net-worth test",
    likeProperties: ["Industrial", "Multifamily"],
    avoidProperties: ["Land / Development"],
    likeRegions: ["West"],
    avoidRegions: [],
    goals: ["Monthly income", "Long-term growth"],
    heardVia: "Referral",
    googleContacts: "saved",
    linkedin: "Found possible match",
    driveUrl: "https://drive.google.com/drive/folders/example-olivia",
    emailCount: 3,
    meetingCount: 2,
    offeringCount: 4,
  },
  {
    id: "marcus-reed",
    name: "Marcus Reed",
    role: "Attorney",
    state: "Oregon",
    timezone: "PDT",
    status: "Cold",
    portal: false,
    crsReceived: false,
    heat: 36,
    lastTouch: "2026-06-12",
    registered: "2025-11-05",
    emails: ["marcus.reed@example.com"],
    phones: ["(503) 555-0198"],
    exchangeStatus: "Planning",
    saleClosing: "2026-11-20",
    idDeadline: "2027-01-04",
    fortyFiveDay: "2027-01-04",
    oneEightyDay: "2027-05-19",
    intermediary: "No",
    maritalStatus: "Married",
    netWorth: "$1M–$5M",
    accreditation: "Unknown",
    likeProperties: ["No preference"],
    avoidProperties: [],
    likeRegions: ["West"],
    avoidRegions: [],
    goals: ["Diversification"],
    heardVia: "Advisor / CPA",
    googleContacts: "unconfirmed",
    linkedin: "Search not run",
    driveUrl: "https://drive.google.com/drive/folders/example-marcus",
    emailCount: 1,
    meetingCount: 0,
    offeringCount: 1,
  },
  {
    id: "sarah-nguyen",
    name: "Sarah Nguyen",
    role: "Financial advisor",
    state: "California",
    timezone: "PDT",
    status: "Existing Client",
    portal: true,
    crsReceived: true,
    heat: 67,
    lastTouch: "2026-07-12",
    registered: "2026-07-01",
    emails: ["sarah.nguyen@example.com"],
    phones: ["(415) 555-0155", "(415) 555-0156"],
    exchangeStatus: "Sale preparation",
    saleClosing: "2026-09-12",
    idDeadline: "2026-10-27",
    fortyFiveDay: "2026-10-27",
    oneEightyDay: "2027-03-11",
    intermediary: "Yes",
    maritalStatus: "Single",
    netWorth: "Over $5M",
    accreditation: "Accredited — income test",
    likeProperties: ["Industrial", "Retail"],
    avoidProperties: ["Hospitality"],
    likeRegions: ["West"],
    avoidRegions: ["Northeast"],
    goals: ["Monthly income"],
    heardVia: "Advisor / CPA",
    googleContacts: "saved",
    linkedin: "Found possible match",
    driveUrl: "https://drive.google.com/drive/folders/example-sarah",
    emailCount: 2,
    meetingCount: 1,
    offeringCount: 2,
  },
];

export const DEALS: Deal[] = [
  { id: "canyon-ridge", name: "Canyon Ridge Apartments", type: "1031 exchange", personId: "eric", stage: "Reviewing Opportunities", statusLine: "Current · selling soon", keyDate: "2026-08-15", keyDateLabel: "Sale closing", idDeadline: "2026-09-29", lastTouch: "2026-07-11", heat: 82, owner: "Jerry Baker", equity: 2200000, debt: 800000, total: 3000000, ltv: 27, note: "Current exchange for Eric. Replacement property search is underway." },
  { id: "mesa-verde", name: "Mesa Verde Industrial", type: "1031 exchange", personId: "eric", stage: "Closed", statusLine: "Historical exchange", keyDate: "2023-03-04", keyDateLabel: "Closed", idDeadline: "2023-04-18", lastTouch: "2026-05-20", heat: 61, owner: "Jerry Baker", equity: 1400000, debt: 600000, total: 2000000, ltv: 30, note: "Historical exchange retained for relationship history." },
  { id: "harborlight", name: "Harborlight Logistics", type: "Cash investment", personId: "eric", stage: "Closed", statusLine: "Direct investment", keyDate: "2025-01-12", keyDateLabel: "Invested", lastTouch: "2026-07-02", heat: 74, owner: "Jerry Baker", equity: 500000, debt: 0, total: 500000, ltv: 0, note: "Cash investment completed outside a 1031 exchange." },
  { id: "sunstone-retail", name: "Sunstone Retail Center", type: "1031 exchange", personId: "sarah-nguyen", stage: "New Registration", statusLine: "Sale preparation", keyDate: "2026-09-12", keyDateLabel: "Sale closing", idDeadline: "2026-07-18", lastTouch: "2026-07-12", heat: 67, owner: "Jerry Baker", equity: 1200000, debt: 400000, total: 1600000, ltv: 25, note: "Deadline intentionally near-term to demonstrate dashboard alert handling." },
  { id: "juniper-commons", name: "Juniper Commons", type: "Cash investment", personId: "olivia-chen", stage: "Reviewing Opportunities", statusLine: "Offering under review", keyDate: "2026-07-30", keyDateLabel: "Review by", lastTouch: "2026-07-04", heat: 48, owner: "Jerry Baker", equity: 750000, debt: 250000, total: 1000000, ltv: 25, note: "Offering review with portfolio feedback in progress." },
  { id: "copper-mesa", name: "Copper Mesa Apartments", type: "1031 exchange", personId: "maya-patel", stage: "Completing Paperwork", statusLine: "Replacement property search", keyDate: "2026-10-21", keyDateLabel: "45-day deadline", idDeadline: "2026-10-21", lastTouch: "2026-07-08", heat: 74, owner: "Jerry Baker", equity: 1800000, debt: 700000, total: 2500000, ltv: 28, note: "Paperwork is being completed for the replacement property." },
];

export const TASKS: Task[] = [
  { id: "task-1", title: "Send replacement property shortlist", dueDate: "2026-07-15", priority: "High", personId: "eric", dealId: "canyon-ridge", done: false },
  { id: "task-2", title: "Confirm qualified intermediary details", dueDate: "2026-07-16", priority: "Normal", personId: "eric", dealId: "canyon-ridge", done: false },
  { id: "task-3", title: "Review offering feedback", dueDate: "2026-07-17", priority: "Normal", personId: "olivia-chen", dealId: "juniper-commons", done: false },
  { id: "task-4", title: "Follow up on CRS delivery", dueDate: "2026-07-18", priority: "High", personId: "daniel-ortiz", done: false },
  { id: "task-5", title: "Archive closing documents", dueDate: "2026-07-10", priority: "Normal", personId: "maya-patel", dealId: "copper-mesa", done: true },
];

export const MEETINGS: Meeting[] = [
  { id: "meeting-1", title: "Exchange planning call", date: "2026-07-15", time: "10:00 AM", source: "Cal.com", status: "upcoming", personId: "eric", dealId: "canyon-ridge" },
  { id: "meeting-2", title: "Replacement property review", date: "2026-07-16", time: "1:30 PM", source: "Google Calendar", status: "upcoming", personId: "maya-patel", dealId: "copper-mesa" },
  { id: "meeting-3", title: "Offering walkthrough", date: "2026-07-11", time: "11:00 AM", source: "Cal.com", status: "past", personId: "olivia-chen", dealId: "juniper-commons" },
  { id: "meeting-4", title: "Registration introduction", date: "2026-07-08", time: "2:00 PM", source: "Google Calendar", status: "past", personId: "sarah-nguyen", dealId: "sunstone-retail" },
  { id: "meeting-5", title: "Initial advisor call", date: "2026-07-05", time: "9:00 AM", source: "Cal.com", status: "no-show", personId: "daniel-ortiz" },
];

export const OFFERINGS: Offering[] = [
  { id: "offering-1", name: "Atlas Distribution Center", sponsor: "Harborline Capital", type: "Industrial DST", status: "Viewed", personId: "eric", dealId: "canyon-ridge", feedback: "Thumbs up", viewed: ["Executive summary", "Track record", "Risk factors"], url: "https://baker1031.com/offerings/atlas-distribution" },
  { id: "offering-2", name: "Juniper Garden Apartments", sponsor: "Crestview Residential", type: "Multifamily DST", status: "Invested", personId: "eric", dealId: "harborlight", feedback: "Invested", viewed: ["Full offering page", "Private placement memorandum", "Cash flow projection"], url: "https://baker1031.com/offerings/juniper-garden" },
  { id: "offering-3", name: "Sierra Ridge Flats", sponsor: "Red Oak Communities", type: "Multifamily DST", status: "Under review", personId: "olivia-chen", dealId: "juniper-commons", feedback: "Thumbs down", viewed: ["Executive summary"], url: "https://baker1031.com/offerings/sierra-ridge" },
  { id: "offering-4", name: "Bluewater Medical Campus", sponsor: "Northstar Real Assets", type: "Healthcare DST", status: "Viewed", personId: "maya-patel", dealId: "copper-mesa", feedback: "Thumbs up", viewed: ["Executive summary", "Sponsor profile"], url: "https://baker1031.com/offerings/bluewater-medical" },
];

export const AUDIT_LOG = [
  { time: "Jul 14, 2026 · 4:10 PM", action: "Deal stage updated", record: "Canyon Ridge Apartments", details: "Reviewing Opportunities" },
  { time: "Jul 14, 2026 · 3:52 PM", action: "Task completed", record: "Eric", details: "Confirm exchange timeline" },
  { time: "Jul 13, 2026 · 11:20 AM", action: "Offering feedback saved", record: "Eric", details: "Atlas Distribution Center · Thumbs up" },
  { time: "Jul 12, 2026 · 9:08 AM", action: "Person created", record: "Sarah Nguyen", details: "Registration form" },
];
