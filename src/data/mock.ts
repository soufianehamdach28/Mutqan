// ─── Types ───────────────────────────────────────────────────────────────────

export type UserRole = 'client' | 'pro';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  city?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  nameAr: string;
  icon: string;
  color: string;
  proCount: number;
}

export interface Review {
  id: string;
  authorName: string;
  authorAvatar?: string;
  rating: number;
  comment: string;
  date: string;
}

export interface PortfolioItem {
  id: string;
  uri: string;      // remote image URL
  title: string;
  caption?: string;
}

export interface Professional extends User {
  category: string;
  categoryId: string;
  rating: number;
  reviewsCount: number;
  completedJobs: number;
  isVerified: boolean;
  isFeatured: boolean;
  portfolio: PortfolioItem[];
  bio: string;
  city: string;
  priceRange: string;
  responseTime: string;
  skills: string[];
  reviews: Review[];
}

export interface QuoteRequest {
  id: string;
  clientId: string;
  proId: string;
  title: string;
  description: string;
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  timestamp: string;
  isRead: boolean;
}

export interface Conversation {
  id: string;
  proId: string;
  proName: string;
  proAvatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const mockCategories: Category[] = [
  { id: '1', name: 'Plumbing',    nameAr: 'سباكة',       icon: 'pipe-wrench',      color: '#3B82F6', proCount: 48 },
  { id: '2', name: 'Electrical',  nameAr: 'كهرباء',      icon: 'flash',            color: '#F59E0B', proCount: 62 },
  { id: '3', name: 'Cleaning',    nameAr: 'تنظيف',       icon: 'broom',            color: '#22C55E', proCount: 95 },
  { id: '4', name: 'Carpentry',   nameAr: 'نجارة',       icon: 'hammer',           color: '#8B5CF6', proCount: 33 },
  { id: '5', name: 'Painting',    nameAr: 'دهان',        icon: 'format-paint',     color: '#EC4899', proCount: 57 },
  { id: '6', name: 'HVAC',        nameAr: 'تكييف',       icon: 'air-conditioner',  color: '#14B8A6', proCount: 29 },
  { id: '7', name: 'Gardening',   nameAr: 'بستنة',       icon: 'flower',           color: '#84CC16', proCount: 41 },
  { id: '8', name: 'Moving',      nameAr: 'نقل عفش',     icon: 'truck',            color: '#F97316', proCount: 18 },
];

const mockReviewsAhmed: Review[] = [
  { id: 'r1', authorName: 'Youssef M.', rating: 5, comment: 'Excellent work, very professional and clean.', date: '2026-04-12', authorAvatar: undefined },
  { id: 'r2', authorName: 'Sara K.',    rating: 5, comment: 'Fixed our pipes in record time. Highly recommend!', date: '2026-03-28' },
  { id: 'r3', authorName: 'Omar B.',    rating: 4, comment: 'Good service, arrived on time. Will call again.', date: '2026-03-10' },
];

const mockReviewsKarim: Review[] = [
  { id: 'r4', authorName: 'Laila A.', rating: 5, comment: 'Outstanding! He redid the whole wiring safely.', date: '2026-04-20' },
  { id: 'r5', authorName: 'Hamid T.', rating: 5, comment: 'Very knowledgeable and trustworthy electrician.', date: '2026-04-01' },
];

const mockReviewsFatima: Review[] = [
  { id: 'r6', authorName: 'Rania J.', rating: 5, comment: 'My apartment has never been this clean!', date: '2026-05-01' },
  { id: 'r7', authorName: 'Fouad S.', rating: 4, comment: 'Great deep clean service, thorough and efficient.', date: '2026-04-15' },
  { id: 'r8', authorName: 'Nadia R.', rating: 5, comment: 'Punctual, professional, and very affordable.', date: '2026-03-20' },
];

export const mockPros: Professional[] = [
  {
    id: 'p1', role: 'pro', email: 'ahmed@mutqan.ma',
    name: 'Ahmed Hassan',
    category: 'Plumbing', categoryId: '1',
    rating: 4.8, reviewsCount: 124, completedJobs: 215,
    isVerified: true, isFeatured: true,
    bio: 'Master plumber with 10+ years of experience in residential and commercial projects. Certified by the National Professional Association of Morocco.',
    city: 'Casablanca', phone: '+212 6 00 11 22 33',
    priceRange: '150 – 600 MAD', responseTime: '< 1 heure',
    skills: ['Leak Repair', 'Pipe Installation', 'Water Heaters', 'Drain Cleaning', 'Renovations'],
    portfolio: [
      { id: 'pf1', uri: 'https://picsum.photos/seed/plumb1/600/400', title: 'Kitchen Pipe Installation', caption: 'Full kitchen plumbing renovation, Casa 2025' },
      { id: 'pf2', uri: 'https://picsum.photos/seed/plumb2/600/400', title: 'Bathroom Renovation', caption: 'Complete bathroom refit with new fixtures' },
      { id: 'pf3', uri: 'https://picsum.photos/seed/plumb3/600/400', title: 'Water Heater Replacement', caption: 'Tankless water heater installation' },
      { id: 'pf4', uri: 'https://picsum.photos/seed/plumb4/600/400', title: 'Drain System Overhaul', caption: 'Underground drainage system, Casablanca villa' },
      { id: 'pf5', uri: 'https://picsum.photos/seed/plumb5/600/400', title: 'Outdoor Irrigation Setup', caption: 'Garden drip irrigation system' },
    ],
    reviews: mockReviewsAhmed,
    createdAt: '2024-01-10',
  },
  {
    id: 'p2', role: 'pro', email: 'karim@mutqan.ma',
    name: 'Karim Youssef',
    category: 'Electrical', categoryId: '2',
    rating: 4.9, reviewsCount: 89, completedJobs: 178,
    isVerified: true, isFeatured: true,
    bio: 'Certified electrician specializing in residential wiring, panel upgrades, and smart home installations. Safety-first approach on every job.',
    city: 'Rabat', phone: '+212 6 11 22 33 44',
    priceRange: '200 – 800 MAD', responseTime: '< 2 heures',
    skills: ['Wiring', 'Panel Upgrades', 'Smart Home', 'Lighting', 'CCTV Installation'],
    portfolio: [
      { id: 'pf6', uri: 'https://picsum.photos/seed/elec1/600/400', title: 'Smart Home Wiring', caption: 'Full smart home electrical setup, Rabat 2025' },
      { id: 'pf7', uri: 'https://picsum.photos/seed/elec2/600/400', title: 'Panel Upgrade', caption: '200A electrical panel upgrade and grounding' },
      { id: 'pf8', uri: 'https://picsum.photos/seed/elec3/600/400', title: 'Recessed Lighting', caption: 'LED recessed lighting installation, 3-bedroom apartment' },
      { id: 'pf9', uri: 'https://picsum.photos/seed/elec4/600/400', title: 'CCTV System', caption: '8-camera CCTV installation, commercial property' },
    ],
    reviews: mockReviewsKarim,
    createdAt: '2024-02-05',
  },
  {
    id: 'p3', role: 'pro', email: 'fatima@mutqan.ma',
    name: 'Fatima Zahra',
    category: 'Cleaning', categoryId: '3',
    rating: 4.7, reviewsCount: 210, completedJobs: 512,
    isVerified: true, isFeatured: false,
    bio: 'Professional deep cleaning specialist for homes, apartments, and offices. Eco-friendly products and meticulous attention to detail.',
    city: 'Marrakech', phone: '+212 6 22 33 44 55',
    priceRange: '100 – 400 MAD', responseTime: '< 3 heures',
    skills: ['Deep Cleaning', 'Post-Construction', 'Office Cleaning', 'Carpet Cleaning', 'Window Cleaning'],
    portfolio: [
      { id: 'pf10', uri: 'https://picsum.photos/seed/clean1/600/400', title: 'Villa Deep Clean', caption: 'Post-renovation deep clean, 5-bedroom villa' },
      { id: 'pf11', uri: 'https://picsum.photos/seed/clean2/600/400', title: 'Office Cleaning', caption: 'Weekly office maintenance, 200m² space' },
      { id: 'pf12', uri: 'https://picsum.photos/seed/clean3/600/400', title: 'Carpet Restoration', caption: 'Professional carpet steam cleaning' },
      { id: 'pf13', uri: 'https://picsum.photos/seed/clean4/600/400', title: 'Window & Facade', caption: 'Building exterior window cleaning, 6 floors' },
      { id: 'pf14', uri: 'https://picsum.photos/seed/clean5/600/400', title: 'Move-Out Clean', caption: 'Complete apartment move-out cleaning service' },
      { id: 'pf15', uri: 'https://picsum.photos/seed/clean6/600/400', title: 'Kitchen Deep Clean', caption: 'Restaurant kitchen deep clean & sanitization' },
    ],
    reviews: mockReviewsFatima,
    createdAt: '2023-11-20',
  },
  {
    id: 'p4', role: 'pro', email: 'samir@mutqan.ma',
    name: 'Samir El Fassi',
    category: 'Carpentry', categoryId: '4',
    rating: 4.6, reviewsCount: 55, completedJobs: 98,
    isVerified: true, isFeatured: false,
    bio: 'Custom furniture maker and renovation carpenter with a passion for quality woodwork. Specializing in kitchens and wardrobes.',
    city: 'Fès', phone: '+212 6 33 44 55 66',
    priceRange: '300 – 1500 MAD', responseTime: '< 4 heures',
    skills: ['Custom Furniture', 'Kitchen Cabinets', 'Door Installation', 'Parquet Flooring', 'Wardrobes'],
    portfolio: [
      { id: 'pf16', uri: 'https://picsum.photos/seed/carp1/600/400', title: 'Custom Kitchen', caption: 'Bespoke kitchen cabinetry in solid oak' },
      { id: 'pf17', uri: 'https://picsum.photos/seed/carp2/600/400', title: 'Built-in Wardrobe', caption: 'Floor-to-ceiling built-in wardrobe system' },
      { id: 'pf18', uri: 'https://picsum.photos/seed/carp3/600/400', title: 'Parquet Flooring', caption: 'Herringbone oak parquet, 80m² living space' },
    ],
    reviews: [],
    createdAt: '2024-03-15',
  },
  {
    id: 'p5', role: 'pro', email: 'nour@mutqan.ma',
    name: 'Nour Benali',
    category: 'Painting', categoryId: '5',
    rating: 4.5, reviewsCount: 78, completedJobs: 134,
    isVerified: false, isFeatured: false,
    bio: 'Interior and exterior painting expert. Specializing in decorative finishes, textured walls, and color consulting for modern homes.',
    city: 'Casablanca', phone: '+212 6 44 55 66 77',
    priceRange: '100 – 500 MAD', responseTime: '< 2 heures',
    skills: ['Interior Painting', 'Exterior Painting', 'Textured Walls', 'Venetian Plaster', 'Color Consulting'],
    portfolio: [
      { id: 'pf19', uri: 'https://picsum.photos/seed/paint1/600/400', title: 'Living Room Accent Wall', caption: 'Venetian plaster accent wall, warm tones' },
      { id: 'pf20', uri: 'https://picsum.photos/seed/paint2/600/400', title: 'Villa Exterior', caption: 'Full exterior repaint, weather-resistant coating' },
      { id: 'pf21', uri: 'https://picsum.photos/seed/paint3/600/400', title: 'Textured Bedroom', caption: 'Sand texture ceiling and walls, master bedroom' },
      { id: 'pf22', uri: 'https://picsum.photos/seed/paint4/600/400', title: 'Commercial Space', caption: 'Office interior painting, corporate colors' },
    ],
    reviews: [],
    createdAt: '2024-04-01',
  },
  {
    id: 'p6', role: 'pro', email: 'driss@mutqan.ma',
    name: 'Driss Alami',
    category: 'HVAC', categoryId: '6',
    rating: 4.8, reviewsCount: 43, completedJobs: 67,
    isVerified: true, isFeatured: true,
    bio: 'HVAC certified technician specializing in split AC installation, maintenance, and repair for all major brands.',
    city: 'Agadir', phone: '+212 6 55 66 77 88',
    priceRange: '200 – 900 MAD', responseTime: '< 1 heure',
    skills: ['AC Installation', 'AC Repair', 'Ventilation', 'Heating Systems', 'Maintenance Contracts'],
    portfolio: [
      { id: 'pf23', uri: 'https://picsum.photos/seed/hvac1/600/400', title: 'Multi-Split Installation', caption: '5-unit multi-split system, 3-story building' },
      { id: 'pf24', uri: 'https://picsum.photos/seed/hvac2/600/400', title: 'Ducted System', caption: 'Central ducted AC, 300m² office space' },
      { id: 'pf25', uri: 'https://picsum.photos/seed/hvac3/600/400', title: 'Maintenance Service', caption: 'Annual AC maintenance, 20-unit apartment block' },
    ],
    reviews: [],
    createdAt: '2024-01-25',
  },
];

export const mockConversations: Conversation[] = [
  {
    id: 'c1', proId: 'p1',
    proName: 'Ahmed Hassan',
    lastMessage: 'I can come tomorrow at 9am, is that fine?',
    lastMessageTime: '14:32', unreadCount: 2,
  },
  {
    id: 'c2', proId: 'p2',
    proName: 'Karim Youssef',
    lastMessage: 'The quote has been sent. Let me know!',
    lastMessageTime: 'Hier', unreadCount: 0,
  },
];

export const mockMessages: Record<string, Message[]> = {
  c1: [
    { id: 'm1', conversationId: 'c1', senderId: 'u1', text: 'Hello, I have a leak under my kitchen sink.', timestamp: '10:00', isRead: true },
    { id: 'm2', conversationId: 'c1', senderId: 'p1', text: 'Hello! I can help. Can you send me a photo?', timestamp: '10:05', isRead: true },
    { id: 'm3', conversationId: 'c1', senderId: 'u1', text: 'Sure, here it is.', timestamp: '10:07', isRead: true },
    { id: 'm4', conversationId: 'c1', senderId: 'p1', text: 'I see. This is a faulty P-trap. I can fix it for around 150 MAD.', timestamp: '10:10', isRead: true },
    { id: 'm5', conversationId: 'c1', senderId: 'u1', text: 'Great, when are you available?', timestamp: '14:20', isRead: true },
    { id: 'm6', conversationId: 'c1', senderId: 'p1', text: 'I can come tomorrow at 9am, is that fine?', timestamp: '14:32', isRead: false },
  ],
};
