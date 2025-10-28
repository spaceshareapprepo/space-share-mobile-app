export type TravellerListing = {
  id: string;
  name: string;
  initials: string;
  origin: string;
  destination: string;
  departureDate: string;
  availableKg: number;
  totalCapacityKg: number;
  pricePerKgUsd: number;
  status: 'open' | 'closingSoon';
  verification: string[];
  experience: string;
  focus: string;
};

export type ShipmentRequest = {
  id: string;
  owner: string;
  initials: string;
  itemName: string;
  summary: string;
  origin: string;
  destination: string;
  readyBy: string;
  weightKg: number;
  budgetUsd: number;
  status: 'matching' | 'urgent';
  handlingNotes: string;
};

export const travellerListings: TravellerListing[] = [
  {
    id: 'traveller-ama-boateng',
    name: 'Ama Boateng',
    initials: 'AB',
    origin: 'New York (JFK)',
    destination: 'Accra (ACC)',
    departureDate: '2024-04-05T15:30:00Z',
    availableKg: 8,
    totalCapacityKg: 15,
    pricePerKgUsd: 18,
    status: 'closingSoon',
    verification: ['ID verified', 'Vaccination card on file'],
    experience: '12 completed trips',
    focus: 'Prefers sealed electronics and small tech accessories.',
  },
  {
    id: 'traveller-kwame-danso',
    name: 'Kwame Danso',
    initials: 'KD',
    origin: 'Washington DC (IAD)',
    destination: 'Accra (ACC)',
    departureDate: '2024-04-12T09:00:00Z',
    availableKg: 12,
    totalCapacityKg: 20,
    pricePerKgUsd: 15,
    status: 'open',
    verification: ['ID verified'],
    experience: '5 completed trips',
    focus: 'Comfortable with clothing, books, personal care items.',
  },
  {
    id: 'traveller-yaw-owusu',
    name: 'Yaw Owusu',
    initials: 'YO',
    origin: 'Accra (ACC)',
    destination: 'Atlanta (ATL)',
    departureDate: '2024-04-08T18:45:00Z',
    availableKg: 5,
    totalCapacityKg: 10,
    pricePerKgUsd: 20,
    status: 'closingSoon',
    verification: ['ID verified', 'Community recommended'],
    experience: '9 completed trips',
    focus: 'Great for delivering specialty foods and packaged snacks.',
  },
  {
    id: 'traveller-nana-asare',
    name: 'Nana Asare',
    initials: 'NA',
    origin: 'Houston (IAH)',
    destination: 'Accra (ACC)',
    departureDate: '2024-04-15T21:10:00Z',
    availableKg: 14,
    totalCapacityKg: 18,
    pricePerKgUsd: 17,
    status: 'open',
    verification: ['ID verified'],
    experience: 'New traveller, orientation complete',
    focus: 'Open to most items except liquids and perishable goods.',
  },
  {
    id: 'traveller-adwoa-sarpong',
    name: 'Adwoa Sarpong',
    initials: 'AS',
    origin: 'Accra (ACC)',
    destination: 'Chicago (ORD)',
    departureDate: '2024-04-09T07:20:00Z',
    availableKg: 6,
    totalCapacityKg: 12,
    pricePerKgUsd: 22,
    status: 'closingSoon',
    verification: ['ID verified', 'Vetted by community moderator'],
    experience: '14 completed trips',
    focus: 'Focuses on fragile items, excellent communicator.',
  },
];

export const shipmentRequests: ShipmentRequest[] = [
  {
    id: 'shipment-kente-fabric',
    owner: 'James Owusu',
    initials: 'JO',
    itemName: 'Custom Kente Fabric',
    summary: '4 neatly folded bundles, wrapped and labeled.',
    origin: 'Accra (ACC)',
    destination: 'New York (JFK)',
    readyBy: '2024-04-01T00:00:00Z',
    weightKg: 6,
    budgetUsd: 120,
    status: 'matching',
    handlingNotes: 'Keep dry. Pick-up in East Legon, drop-off in Manhattan.',
  },
  {
    id: 'shipment-tech-accessories',
    owner: 'Linda Mensah',
    initials: 'LM',
    itemName: 'Tech Accessories Care Package',
    summary: 'Phone accessories, Bluetooth speaker, boxed.',
    origin: 'Dallas (DFW)',
    destination: 'Accra (ACC)',
    readyBy: '2024-04-06T00:00:00Z',
    weightKg: 4,
    budgetUsd: 90,
    status: 'matching',
    handlingNotes: 'Package insured, meet-up near Dallas Galleria mall.',
  },
  {
    id: 'shipment-medication-refill',
    owner: 'Dr. Afua Mensimah',
    initials: 'AM',
    itemName: 'Prescription Medication Refill',
    summary: 'FDA-approved refill for family member in Kumasi.',
    origin: 'Boston (BOS)',
    destination: 'Accra (ACC)',
    readyBy: '2024-03-31T00:00:00Z',
    weightKg: 2,
    budgetUsd: 150,
    status: 'urgent',
    handlingNotes: 'Requires secure handling. Documentation provided.',
  },
  {
    id: 'shipment-cocoa-samples',
    owner: 'Kojo Asante',
    initials: 'KA',
    itemName: 'Cocoa Bean Samples',
    summary: 'Vacuum sealed samples for a tasting event.',
    origin: 'Accra (ACC)',
    destination: 'Los Angeles (LAX)',
    readyBy: '2024-04-04T00:00:00Z',
    weightKg: 5,
    budgetUsd: 110,
    status: 'matching',
    handlingNotes: 'Keep sealed. Los Angeles drop-off near KTown.',
  },
  {
    id: 'shipment-fashion-lookbook',
    owner: 'Efua Appiah',
    initials: 'EA',
    itemName: 'Fashion Lookbook Samples',
    summary: 'Collection of hand-made jewelry and accessories.',
    origin: 'Chicago (ORD)',
    destination: 'Accra (ACC)',
    readyBy: '2024-04-10T00:00:00Z',
    weightKg: 3,
    budgetUsd: 95,
    status: 'matching',
    handlingNotes: 'Fragile. Prefer courier with rigid carry-on.',
  },
];