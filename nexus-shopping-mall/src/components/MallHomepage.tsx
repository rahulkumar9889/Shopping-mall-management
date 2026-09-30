import React, { useState, useMemo } from 'react';
import {
  Building2,
  Search,
  MapPin,
  Clock,
  Phone,
  Calendar,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Utensils,
  ShoppingBag,
  Tag,
  Shield,
  Compass,
  Star,
  Layers,
  CheckCircle2,
  Copy,
  Check,
  UserCheck,
  Lock,
  ChevronDown,
  Info,
  Car,
  Wifi,
  Gift,
  X,
  CreditCard
} from 'lucide-react';

interface StoreItem {
  id: number;
  name: string;
  category: 'Fashion & Luxury' | 'Tech & Electronics' | 'Beauty & Fragrance' | 'Dining & Gourmet' | 'Lifestyle & Books' | 'Jewelry & Watches';
  shopNumber: string;
  floor: number;
  image: string;
  description: string;
  phone: string;
  hours: string;
  featured?: boolean;
  offer?: string;
  tags: string[];
}

interface MallHomepageProps {
  onNavigateToLogin: () => void;
  onSelectTenantDemo?: (tenantUsername: string) => void;
}

export default function MallHomepage({ onNavigateToLogin, onSelectTenantDemo }: MallHomepageProps) {
  // Navigation & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedFloor, setSelectedFloor] = useState<number>(1);
  const [activeModalStore, setActiveModalStore] = useState<StoreItem | null>(null);
  const [selectedMapUnit, setSelectedMapUnit] = useState<string>('101');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [rsvpEvent, setRsvpEvent] = useState<string | null>(null);
  const [diningReservationStore, setDiningReservationStore] = useState<StoreItem | null>(null);
  const [reservationForm, setReservationForm] = useState({ name: '', guests: '2', time: '19:00', date: '2026-10-15' });
  const [reservationSuccess, setReservationSuccess] = useState(false);

  // Directory Store Database (aligned with Mall Tenants + Flagship Brands)
  const stores: StoreItem[] = [
    {
      id: 1,
      name: 'Zara Premier Outlet',
      category: 'Fashion & Luxury',
      shopNumber: 'Shop 101',
      floor: 1,
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
      description: 'Exclusive multi-level flagship featuring contemporary runway collections, premium tailoring, and sustainable eco-fabrics.',
      phone: '+1 (555) 301-4490',
      hours: '10:00 AM – 10:00 PM',
      featured: true,
      offer: '20% Off Fall Trench & Outerwear',
      tags: ['Apparel', 'Footwear', 'Accessories']
    },
    {
      id: 2,
      name: 'Apple Authorized Reseller',
      category: 'Tech & Electronics',
      shopNumber: 'Shop 204',
      floor: 2,
      image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=800&q=80',
      description: 'Full experience retail store with hands-on demo stations, certified Genius technical support, and premium device personalization.',
      phone: '+1 (555) 204-8800',
      hours: '10:00 AM – 10:00 PM',
      featured: true,
      offer: 'Free Pro Setup & Trade-in Bonus',
      tags: ['Smartphones', 'Laptops', 'Audio']
    },
    {
      id: 3,
      name: 'Gucci Flagship Boutique',
      category: 'Fashion & Luxury',
      shopNumber: 'Shop 105',
      floor: 1,
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
      description: 'Italian haute couture, artisanal leather handbags, signature luggage, and custom monogramming services in a lavish private lounge.',
      phone: '+1 (555) 105-7722',
      hours: '10:30 AM – 09:30 PM',
      featured: true,
      offer: 'Complimentary VIP Private Styling Session',
      tags: ['Luxury', 'Leather', 'Haute Couture']
    },
    {
      id: 4,
      name: 'Rolex & Fine Horology',
      category: 'Jewelry & Watches',
      shopNumber: 'Shop 108',
      floor: 1,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      description: 'Authorized chronometer gallery housing rare collector timepieces, gem-set dials, and master Swiss watchmakers on site.',
      phone: '+1 (555) 108-9900',
      hours: '11:00 AM – 09:00 PM',
      featured: true,
      tags: ['Swiss Watches', 'Fine Jewelry', 'Diamonds']
    },
    {
      id: 5,
      name: 'Sephora Beauty Lounge',
      category: 'Beauty & Fragrance',
      shopNumber: 'Shop 112',
      floor: 1,
      image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
      description: 'Global cosmetics playground with bespoke shade matching, complimentary makeover studio, and niche perfume apothecary.',
      phone: '+1 (555) 112-3344',
      hours: '10:00 AM – 10:00 PM',
      offer: 'Deluxe Beauty Sample Bag with $80+ Purchase',
      tags: ['Skincare', 'Cosmetics', 'Fragrance']
    },
    {
      id: 6,
      name: 'Sony Interactive Arena',
      category: 'Tech & Electronics',
      shopNumber: 'Shop 215',
      floor: 2,
      image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80',
      description: 'Immersive next-gen gaming pods, Alpha camera studio bar, 8K OLED theatre room, and noise-cancelling headphone listening lounges.',
      phone: '+1 (555) 215-6677',
      hours: '10:00 AM – 10:00 PM',
      tags: ['PlayStation', 'Cinema', 'Photography']
    },
    {
      id: 7,
      name: 'Nike Rise Concept Store',
      category: 'Fashion & Luxury',
      shopNumber: 'Shop 302',
      floor: 3,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
      description: 'Digitally-driven athletic cathedral featuring motion-capture gait analysis, bespoke shoe personalization bar, and local running club hub.',
      phone: '+1 (555) 302-8811',
      hours: '10:00 AM – 10:00 PM',
      offer: '15% Off Nike App Members on Footwear',
      tags: ['Athletic', 'Running', 'Streetwear']
    },
    {
      id: 8,
      name: 'Kinokuniya Books & Art',
      category: 'Lifestyle & Books',
      shopNumber: 'Shop 401',
      floor: 4,
      image: 'https://images.unsplash.com/photo-1526721940322-10fb6e3ae94a?auto=format&fit=crop&w=800&q=80',
      description: 'Sprawling literary haven with international bestsellers, Japanese manga, fine stationery, calligraphy inks, and an in-house reading terrace.',
      phone: '+1 (555) 401-2288',
      hours: '10:00 AM – 09:30 PM',
      tags: ['Books', 'Stationery', 'Collectibles']
    },
    {
      id: 9,
      name: 'The Glasshouse Rooftop Bistro',
      category: 'Dining & Gourmet',
      shopNumber: 'Shop 501',
      floor: 5,
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      description: 'Panoramic skyline dining featuring wood-fired Mediterranean gastronomy, sommelier-curated organic wines, and live twilight jazz.',
      phone: '+1 (555) 501-9988',
      hours: '11:30 AM – 11:00 PM',
      featured: true,
      offer: 'Chef Tasting Menu with Wine Pairing ($95)',
      tags: ['Fine Dining', 'Cocktails', 'Rooftop']
    },
    {
      id: 10,
      name: 'Artisan Roast & Boulangerie',
      category: 'Dining & Gourmet',
      shopNumber: 'Shop 118',
      floor: 1,
      image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
      description: 'Single-origin micro-roastery serving cold drip reserve coffee, fresh sourdough croissants, and gourmet French patisserie baked hourly.',
      phone: '+1 (555) 118-4455',
      hours: '08:00 AM – 09:00 PM',
      tags: ['Specialty Coffee', 'Bakery', 'Breakfast']
    },
    {
      id: 11,
      name: 'Saffron Royale Modern Indian',
      category: 'Dining & Gourmet',
      shopNumber: 'Shop 508',
      floor: 5,
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80',
      description: 'Michelin-recognized progressive Indian cuisine celebrating coastal spices, tandoori smoked delicacies, and saffron-infused cocktails.',
      phone: '+1 (555) 508-3311',
      hours: '12:00 PM – 10:30 PM',
      tags: ['Indian Fine Dining', 'Curry', 'Cocktails']
    },
    {
      id: 12,
      name: 'L’Occitane en Provence',
      category: 'Beauty & Fragrance',
      shopNumber: 'Shop 218',
      floor: 2,
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
      description: 'Natural botanical body care, lavender bath soaks, and shea butter rituals harvested sustainably from the hills of Haute-Provence.',
      phone: '+1 (555) 218-1200',
      hours: '10:00 AM – 10:00 PM',
      tags: ['Botanical', 'Bath & Body', 'Spa']
    }
  ];

  // Categories
  const categories = [
    'All',
    'Fashion & Luxury',
    'Tech & Electronics',
    'Beauty & Fragrance',
    'Dining & Gourmet',
    'Jewelry & Watches',
    'Lifestyle & Books'
  ];

  // Filtered stores
  const filteredStores = useMemo(() => {
    return stores.filter(store => {
      const matchesSearch = store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            store.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            store.shopNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            store.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCat = selectedCategory === 'All' ? true : store.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [stores, searchQuery, selectedCategory]);

  // Floor descriptions for Interactive Map
  const floorData = {
    1: {
      name: 'Level 1: Luxury Atrium & High Fashion',
      desc: 'Haute couture flagships, Swiss fine watches, artisan perfume boutiques, and our grand sunlit marble atrium.',
      units: [
        { code: '101', name: 'Zara Premier Outlet', category: 'Fashion', active: true, color: 'bg-emerald-600' },
        { code: '105', name: 'Gucci Flagship', category: 'Luxury', active: true, color: 'bg-amber-600' },
        { code: '108', name: 'Rolex Horology', category: 'Jewelry', active: true, color: 'bg-amber-700' },
        { code: '112', name: 'Sephora Lounge', category: 'Beauty', active: true, color: 'bg-rose-600' },
        { code: '118', name: 'Artisan Roast', category: 'Dining', active: true, color: 'bg-orange-600' },
        { code: '120', name: 'Concierge Desk', category: 'Services', active: true, color: 'bg-blue-600' },
      ]
    },
    2: {
      name: 'Level 2: Tech Innovations & Contemporary Brands',
      desc: 'Consumer electronics, Apple Authorized showroom, Sony gaming pod arena, and modern lifestyle concepts.',
      units: [
        { code: '204', name: 'Apple Reseller', category: 'Tech', active: true, color: 'bg-blue-600' },
        { code: '215', name: 'Sony Interactive', category: 'Gaming', active: true, color: 'bg-indigo-600' },
        { code: '218', name: 'L’Occitane Spa', category: 'Beauty', active: true, color: 'bg-rose-500' },
        { code: '222', name: 'Samsung Experience', category: 'Tech', active: true, color: 'bg-cyan-600' },
        { code: '225', name: 'Officer Station #2', category: 'Security', active: true, color: 'bg-amber-500' },
      ]
    },
    3: {
      name: 'Level 3: Athleisure, Footwear & Active Living',
      desc: 'Performance sportswear, running motion labs, outdoor adventure gear, and wellness equipment.',
      units: [
        { code: '302', name: 'Nike Rise Flagship', category: 'Sports', active: true, color: 'bg-red-600' },
        { code: '308', name: 'Adidas Performance', category: 'Sports', active: true, color: 'bg-slate-700' },
        { code: '315', name: 'Lululemon Studio', category: 'Athleisure', active: true, color: 'bg-pink-600' },
        { code: '320', name: 'The North Face', category: 'Outdoor', active: true, color: 'bg-teal-600' },
      ]
    },
    4: {
      name: 'Level 4: Culture, Books & Family Entertainment',
      desc: 'Kinokuniya bookstore, children’s discovery zone, art galleries, and casual family dining.',
      units: [
        { code: '401', name: 'Kinokuniya Books', category: 'Books', active: true, color: 'bg-blue-800' },
        { code: '410', name: 'LEGO Discovery Store', category: 'Kids', active: true, color: 'bg-yellow-500' },
        { code: '416', name: 'Matsuri Teppanyaki', category: 'Dining', active: true, color: 'bg-red-700' },
        { code: '422', name: 'Arcade Wonderland', category: 'Fun', active: true, color: 'bg-purple-600' },
      ]
    },
    5: {
      name: 'Level 5: Sky Dining Pavilion & Rooftop Garden',
      desc: 'Michelin-calibre rooftop restaurants, craft cocktail lounges, IMAX laser cinema, and landscaped gardens.',
      units: [
        { code: '501', name: 'The Glasshouse Bistro', category: 'Dining', active: true, color: 'bg-emerald-700' },
        { code: '508', name: 'Saffron Royale Indian', category: 'Dining', active: true, color: 'bg-orange-700' },
        { code: '515', name: 'Grand IMAX Laser Cinema', category: 'Cinema', active: true, color: 'bg-purple-700' },
        { code: '520', name: 'Twilight Sky Lounge', category: 'Cocktails', active: true, color: 'bg-indigo-800' },
      ]
    }
  };

  // Special Promo Codes
  const promotions = [
    { code: 'GALLERIA20', title: 'Autumn Fashion Week Special', discount: '20% OFF', desc: 'Valid at Zara, Gucci, and Nike flagships on orders over $150.', expire: 'Valid thru Oct 31, 2026' },
    { code: 'APPLEVIP', title: 'Tech Upgrade Voucher', discount: '$50 CASHBACK', desc: 'Instant gift voucher with Mac or iPad purchase at Apple Reseller (Shop 204).', expire: 'Valid thru Nov 15, 2026' },
    { code: 'ROOFTOP15', title: 'Sunset Dining Special', discount: '15% OFF MENU', desc: 'Weekday twilight dinner bookings between 5:00 PM – 7:30 PM at Glasshouse Bistro.', expire: 'Valid Monday – Thursday' },
    { code: 'BEAUTYGLOW', title: 'Fragrance & Skincare Treat', discount: 'FREE GIFT SET', desc: 'Complimentary deluxe miniature perfume kit with any $70 spend at Sephora.', expire: 'While stocks last' }
  ];

  // Upcoming Events
  const events = [
    {
      id: 'e1',
      title: 'Haute Couture Autumn Runway 2026',
      date: 'OCTOBER 12 – 14, 2026',
      time: '07:00 PM – 09:30 PM',
      location: 'Central Marble Atrium (Level 1)',
      image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
      description: 'Exclusive fashion showcase unveiling autumn & winter high couture from international designers, featuring champagne receptions and live string quartets.'
    },
    {
      id: 'e2',
      title: 'Next-Gen Robotics & Electronics Expo',
      date: 'OCTOBER 22 – 24, 2026',
      time: '11:00 AM – 08:00 PM',
      location: 'Innovation Plaza (Level 2)',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
      description: 'Hands-on demos of humanoid consumer robotics, next-gen spatial computing, electric hypercar previews, and interactive virtual reality simulations.'
    },
    {
      id: 'e3',
      title: 'Master Sommelier Wine & Truffle Pairing',
      date: 'EVERY FRIDAY EVENING',
      time: '06:30 PM – 08:30 PM',
      location: 'The Glasshouse Sky Deck (Level 5)',
      image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80',
      description: 'Guided sensory tasting of vintage Bordeaux wines paired with Piedmont black truffles and artisanal cheeses, hosted by Master Sommelier Lucian Moreau.'
    }
  ];

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSubscribed(true);
    setTimeout(() => {
      setNewsletterEmail('');
    }, 4000);
  };

  const handleRsvp = (eventId: string, title: string) => {
    setRsvpEvent(eventId);
    setTimeout(() => setRsvpEvent(null), 4000);
  };

  const handleReservationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReservationSuccess(true);
    setTimeout(() => {
      setReservationSuccess(false);
      setDiningReservationStore(null);
    }, 3000);
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen selection:bg-amber-500 selection:text-slate-950 font-sans">
      
      {/* ========================================================================= */}
      {/* 1. TOP ANNOUNCEMENT TICKER */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 border-b border-amber-900/30 text-[11px] py-1.5 px-4 text-center text-amber-200/90 font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="hidden sm:flex items-center gap-2 text-slate-400">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Today's Hours: <strong className="text-slate-200">10:00 AM – 10:00 PM</strong></span>
            <span className="text-slate-600">·</span>
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>Grand Galleria Plaza, Metropolis City</span>
          </div>
          <div className="mx-auto sm:mx-0 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Autumn Fashion Week Gala: Oct 12–14 · VIP Invitations Now Open</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-slate-300">
            <button 
              onClick={onNavigateToLogin}
              className="text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-2 flex items-center gap-1 transition-colors"
            >
              <Lock className="w-3 h-3" />
              <span>Staff &amp; Tenant Portal</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. ELEGANT LUXURY HEADER & NAVIGATION */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6">
          
          {/* Mall Brand Identity */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 via-amber-600 to-amber-800 flex items-center justify-center shadow-lg shadow-amber-900/30 text-slate-950">
              <Building2 className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif tracking-widest text-lg font-bold text-white uppercase">Nexus Grand Galleria</span>
              </div>
              <p className="text-[10px] tracking-widest text-amber-400 uppercase font-medium">Metropolis Premier Lifestyle &amp; Fashion</p>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-xs font-semibold tracking-wider text-slate-300 uppercase">
            <a href="#directory" className="hover:text-amber-400 transition-colors">Store Directory</a>
            <a href="#featured" className="hover:text-amber-400 transition-colors">Flagship Brands</a>
            <a href="#dining" className="hover:text-amber-400 transition-colors">Fine Dining</a>
            <a href="#map" className="hover:text-amber-400 transition-colors">Mall Map</a>
            <a href="#events" className="hover:text-amber-400 transition-colors">Events</a>
            <a href="#offers" className="hover:text-amber-400 transition-colors">Offers</a>
            <a href="#services" className="hover:text-amber-400 transition-colors">Amenities</a>
          </nav>

          {/* Right Action: Management Portal Gateway */}
          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateToLogin}
              className="group relative inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all active:scale-95"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Portal Sign In</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

        </div>
      </header>

      {/* ========================================================================= */}
      {/* 3. CINEMATIC HERO SECTION */}
      {/* ========================================================================= */}
      <section className="relative min-h-[580px] lg:min-h-[640px] flex items-center justify-center overflow-hidden border-b border-slate-800">
        {/* Background Visual with Dramatic Gradients */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 transition-transform duration-1000"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?auto=format&fit=crop&w=2000&q=85')`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40" />
        </div>

        {/* Hero Content */}
        <div className="relative max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-20 z-10 flex flex-col justify-center">
          <div className="max-w-3xl space-y-6">
            
            {/* Kicker */}
            <div className="inline-flex items-center gap-2 text-amber-400 text-xs tracking-widest font-bold uppercase">
              <span className="w-8 h-px bg-amber-400"></span>
              <span>Metropolis Flagship Landmark &bull; 5 Architectural Levels</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white leading-tight tracking-tight text-balance">
              Where Luxury Meets Architecture &amp; Culture.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-light max-w-2xl">
              Immerse yourself in over 60 international luxury houses, curated designer boutiques, rooftop culinary destinations, and contemporary lifestyle spectacles.
            </p>

            {/* Search Input Bar */}
            <div className="pt-2 max-w-xl">
              <div className="relative flex items-center bg-slate-900/90 backdrop-blur-md rounded-xl border border-slate-700 p-1.5 shadow-2xl focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-400/20 transition-all">
                <Search className="w-5 h-5 text-amber-400 ml-3 flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search stores, dining, fashion, electronics (e.g. Zara, Apple, Gucci)..."
                  className="w-full bg-transparent px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="p-1 text-slate-400 hover:text-white mr-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <a
                  href="#directory"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs uppercase tracking-wider flex-shrink-0 transition-colors"
                >
                  Explore
                </a>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <a
                href="#directory"
                className="bg-white hover:bg-slate-100 text-slate-950 font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider shadow-lg transition-all flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4 text-amber-600" />
                <span>Browse 60+ Stores</span>
              </a>
              <a
                href="#map"
                className="bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center gap-2"
              >
                <Compass className="w-4 h-4 text-amber-400" />
                <span>Interactive Floor Map</span>
              </a>
              <button
                onClick={onNavigateToLogin}
                className="bg-slate-800/80 hover:bg-slate-700/80 text-amber-300 border border-amber-500/30 font-semibold px-5 py-3 rounded-xl text-xs tracking-wider transition-all flex items-center gap-2"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Mall Staff / Tenant Sign In</span>
              </button>
            </div>

          </div>
        </div>

        {/* Mall Specs Bottom Counter Strip */}
        <div className="absolute bottom-0 inset-x-0 bg-slate-950/80 backdrop-blur-md border-t border-slate-800/80 py-3 hidden sm:block">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-4 divide-x divide-slate-800 text-center">
            <div>
              <p className="text-lg font-bold text-white font-serif">5 Levels</p>
              <p className="text-[11px] text-slate-400 uppercase tracking-wider">Vertical Architecture</p>
            </div>
            <div>
              <p className="text-lg font-bold text-amber-400 font-serif">60 Brands</p>
              <p className="text-[11px] text-slate-400 uppercase tracking-wider">International Boutiques</p>
            </div>
            <div>
              <p className="text-lg font-bold text-white font-serif">18 Dining</p>
              <p className="text-[11px] text-slate-400 uppercase tracking-wider">Gourmet &amp; Rooftops</p>
            </div>
            <div>
              <p className="text-lg font-bold text-amber-400 font-serif">1,200 Bays</p>
              <p className="text-[11px] text-slate-400 uppercase tracking-wider">Covered &amp; EV Valet</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. FEATURED BRANDS SHOWCASE */}
      {/* ========================================================================= */}
      <section id="featured" className="py-16 bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="text-xs uppercase tracking-widest text-amber-400 font-bold mb-1">Curated Excellence</div>
              <h2 className="text-3xl font-serif font-bold text-white">Flagship Luxury &amp; Retail Anchors</h2>
            </div>
            <p className="text-xs text-slate-400 max-w-md">
              Home to world-renowned European fashion houses, innovative tech creators, and certified horology salons.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stores.filter(s => s.featured).slice(0, 3).map((store) => (
              <div
                key={store.id}
                onClick={() => setActiveModalStore(store)}
                className="group relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 hover:border-amber-500/50 shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={store.image}
                    alt={store.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded text-[11px] font-mono font-bold text-amber-300 border border-amber-500/30">
                    Floor {store.floor} &bull; {store.shopNumber}
                  </div>
                  {store.offer && (
                    <div className="absolute bottom-3 left-3 right-3 bg-amber-500/90 backdrop-blur-md text-slate-950 font-bold text-[11px] px-2.5 py-1 rounded shadow">
                      {store.offer}
                    </div>
                  )}
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[11px] tracking-wider uppercase font-semibold text-slate-400">{store.category}</span>
                    <h3 className="text-xl font-serif font-bold text-white group-hover:text-amber-400 transition-colors mt-1">
                      {store.name}
                    </h3>
                    <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                      {store.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1 font-mono text-[11px]">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      {store.hours}
                    </span>
                    <span className="text-amber-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>View Boutique</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. INTERACTIVE STORE DIRECTORY */}
      {/* ========================================================================= */}
      <section id="directory" className="py-20 bg-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header & Controls */}
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Complete Directory</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">Explore All Boutiques &amp; Salons</h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Filter by department category or search by store name to find your destination across our 5 levels.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Directory Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredStores.map((store) => (
              <div
                key={store.id}
                onClick={() => setActiveModalStore(store)}
                className="group bg-slate-900/90 rounded-xl border border-slate-800 hover:border-slate-700 hover:shadow-2xl transition-all duration-200 overflow-hidden cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={store.image}
                      alt={store.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                    <span className="absolute top-2.5 right-2.5 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono font-bold text-amber-400 border border-slate-700">
                      Level {store.floor} &bull; {store.shopNumber}
                    </span>
                  </div>

                  <div className="p-4 space-y-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">{store.category}</span>
                    <h4 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                      {store.name}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {store.description}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono text-[11px] flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-500" />
                    {store.phone}
                  </span>
                  <span className="text-amber-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                    <span>Details</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          {filteredStores.length === 0 && (
            <div className="text-center py-16 bg-slate-900/50 rounded-2xl border border-slate-800 p-8">
              <Search className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-base font-semibold text-white">No boutiques matching "{searchQuery}"</p>
              <p className="text-xs text-slate-400 mt-1">Try searching for 'Zara', 'Apple', 'Rolex' or resetting category filters.</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold rounded-lg"
              >
                Reset All Filters
              </button>
            </div>
          )}

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. INTERACTIVE MULTI-LEVEL MALL MAP */}
      {/* ========================================================================= */}
      <section id="map" className="py-20 bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Wayfinding &amp; Floorplans</span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mt-1">Interactive Multi-Level Mall Map</h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-xl">
                Select any architectural level to view units, emergency routes, concierge desks, and tenant occupancy.
              </p>
            </div>

            {/* Floor Switcher Buttons */}
            <div className="flex flex-wrap items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
              {[1, 2, 3, 4, 5].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setSelectedFloor(lvl)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    selectedFloor === lvl
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Floor {lvl}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Active Floor Plan Display */}
          <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800 mb-8">
              <div>
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20">
                  FLOOR {selectedFloor} SCHEMATIC
                </span>
                <h3 className="text-xl font-bold text-white mt-2">
                  {floorData[selectedFloor as keyof typeof floorData].name}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {floorData[selectedFloor as keyof typeof floorData].desc}
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span>Active Retail</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                  <span>Concierge / Info</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span>Officer Post</span>
                </div>
              </div>
            </div>

            {/* Simulated Architectural Floor Blueprint Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {floorData[selectedFloor as keyof typeof floorData].units.map((unit) => {
                const isSelected = selectedMapUnit === unit.code;
                return (
                  <button
                    key={unit.code}
                    onClick={() => setSelectedMapUnit(unit.code)}
                    className={`p-4 rounded-xl text-left border transition-all relative flex flex-col justify-between min-h-[130px] group ${
                      isSelected
                        ? 'bg-amber-950/40 border-amber-400 ring-2 ring-amber-400/20 shadow-xl'
                        : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-xs font-bold text-slate-400">Unit #{unit.code}</span>
                        <span className={`w-2 h-2 rounded-full ${unit.color}`}></span>
                      </div>
                      <p className="font-bold text-xs text-white group-hover:text-amber-300 transition-colors leading-snug">
                        {unit.name}
                      </p>
                    </div>
                    <div className="pt-2 text-[10px] text-slate-400 uppercase tracking-wider flex items-center justify-between border-t border-slate-800">
                      <span>{unit.category}</span>
                      <span className="text-emerald-400 font-semibold font-mono">ACTIVE</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Highlighted Unit Info Strip */}
            <div className="mt-8 p-4 bg-slate-900 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-mono font-bold text-sm">
                  #{selectedMapUnit}
                </div>
                <div>
                  <p className="font-bold text-white text-sm">
                    {floorData[selectedFloor as keyof typeof floorData].units.find(u => u.code === selectedMapUnit)?.name || 'Select a unit to view details'}
                  </p>
                  <p className="text-slate-400 text-xs">
                    Level {selectedFloor} East Promenade &bull; Escalator &amp; Elevator Adjacent
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={onNavigateToLogin}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-2 rounded-lg font-semibold transition-colors flex items-center gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  <span>Inspect Floor As Officer</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. GOURMET DINING & SKYLINE CULINARY */}
      {/* ========================================================================= */}
      <section id="dining" className="py-20 bg-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Culinary Experiences</span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mt-1">Skyline Dining &amp; Artisan Cafés</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md">
              From Michelin-calibre tasting menus on the 5th-floor glasshouse terrace to world-class specialty espresso roasters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stores.filter(s => s.category === 'Dining & Gourmet').map((dining) => (
              <div
                key={dining.id}
                className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={dining.image}
                      alt={dining.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />
                    <span className="absolute top-3 left-3 bg-amber-500 text-slate-950 text-[10px] font-bold uppercase px-2 py-0.5 rounded shadow">
                      Floor {dining.floor} &bull; {dining.shopNumber}
                    </span>
                  </div>

                  <div className="p-6 space-y-3">
                    <h3 className="text-xl font-serif font-bold text-white group-hover:text-amber-400 transition-colors">
                      {dining.name}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {dining.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-slate-400 font-mono pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        {dining.hours}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <button
                    onClick={() => { setDiningReservationStore(dining); setReservationSuccess(false); }}
                    className="w-full bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <Utensils className="w-3.5 h-3.5" />
                    <span>Reserve Table / View Menu</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. UPCOMING MALL EVENTS */}
      {/* ========================================================================= */}
      <section id="events" className="py-20 bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Culture &amp; Entertainment</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">Upcoming Events &amp; Exhibitions</h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Join exclusive runway previews, technology expos, and sensory tasting masterclasses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {events.map((evt) => (
              <div 
                key={evt.id} 
                className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-xl flex flex-col justify-between group hover:border-slate-700 transition-all"
              >
                <div>
                  <div className="relative h-52 overflow-hidden">
                    <img 
                      src={evt.image} 
                      alt={evt.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                    <span className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded text-[11px] font-mono font-bold text-amber-400 border border-slate-700">
                      {evt.date}
                    </span>
                  </div>

                  <div className="p-6 space-y-3">
                    <h3 className="text-lg font-serif font-bold text-white group-hover:text-amber-400 transition-colors">
                      {evt.title}
                    </h3>
                    <div className="space-y-1 text-xs text-slate-400">
                      <p className="flex items-center gap-1.5 font-mono text-[11px]">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        {evt.time}
                      </p>
                      <p className="flex items-center gap-1.5 text-slate-400">
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        {evt.location}
                      </p>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed pt-2">
                      {evt.description}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <button
                    onClick={() => handleRsvp(evt.id, evt.title)}
                    className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-amber-400/50 text-slate-200 hover:text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                  >
                    {rsvpEvent === evt.id ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-400">RSVP Confirmed &bull; Added</span>
                      </>
                    ) : (
                      <>
                        <Calendar className="w-3.5 h-3.5 text-amber-400" />
                        <span>RSVP / Add to Calendar</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. EXCLUSIVE GUEST OFFERS */}
      {/* ========================================================================= */}
      <section id="offers" className="py-20 bg-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Seasonal Privileges</span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mt-1">Exclusive Boutique Offers</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md">
              Present digital voucher codes at flagship checkout counters for complimentary gifts and seasonal privileges.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {promotions.map((promo) => (
              <div 
                key={promo.code} 
                className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between space-y-4 hover:border-amber-500/40 transition-all shadow-lg"
              >
                <div className="space-y-2">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                    {promo.expire}
                  </span>
                  <div className="text-2xl font-serif font-bold text-amber-400">
                    {promo.discount}
                  </div>
                  <h4 className="text-sm font-bold text-white">
                    {promo.title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {promo.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <div className="flex items-center justify-between bg-slate-950 p-2 rounded-lg border border-slate-800">
                    <span className="font-mono text-xs font-bold text-slate-300">{promo.code}</span>
                    <button
                      onClick={() => handleCopyCode(promo.code)}
                      className="text-amber-400 hover:text-amber-300 text-xs font-bold flex items-center gap-1 transition-colors"
                      title="Copy code to clipboard"
                    >
                      {copiedCode === promo.code ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 text-[10px]">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span className="text-[10px]">Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. VISITOR SERVICES & LUXURY AMENITIES */}
      {/* ========================================================================= */}
      <section id="services" className="py-20 bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Guest Services</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">Curated Amenities &amp; Care</h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Designed to ensure an effortless, world-class experience throughout your visit.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
                <Car className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-white text-sm">Valet &amp; EV Fast Charging</h4>
              <p className="text-xs text-slate-400">1,200 secure underground bays with white-glove valet and Tesla Supercharger hubs.</p>
            </div>

            <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
                <Gift className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-white text-sm">VIP Concierge &amp; Styling</h4>
              <p className="text-xs text-slate-400">Private personal shopping lounges, luggage storage, and complimentary bespoke gift wrapping.</p>
            </div>

            <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
                <Wifi className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-white text-sm">High-Speed Wi-Fi &amp; Workstations</h4>
              <p className="text-xs text-slate-400">Seamless 1Gbps public Wi-Fi and executive workstations located in quiet atrium lounges.</p>
            </div>

            <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
                <Shield className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-white text-sm">24/7 Security &amp; Safety Officers</h4>
              <p className="text-xs text-slate-400">Dedicated floor supervisors, rapid medical responders, and multilingual information guides.</p>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 11. MANAGEMENT & TENANT GATEWAY SECTION */}
      {/* ========================================================================= */}
      <section className="py-20 bg-gradient-to-b from-slate-950 to-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30 p-8 sm:p-12 shadow-2xl">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-widest">
                <Lock className="w-3.5 h-3.5" />
                <span>Administrative &bull; Officer &bull; Merchant Portal</span>
              </div>
              <h3 className="text-3xl sm:text-4xl font-serif font-bold text-white">
                Mall Operations &amp; Commercial Tenant Portal
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                Are you a mall administrator, floor supervisor, or retail tenant? Sign in with your institutional credentials to manage commercial leases, schedule safety inspections, view billing statements, and track real-time occupancy.
              </p>
              
              <div className="pt-4 flex flex-wrap items-center gap-4">
                <button
                  onClick={onNavigateToLogin}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>Access Management Portal (/login)</span>
                </button>
              </div>

              {/* Quick evaluation shortcuts */}
              <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 flex flex-wrap items-center gap-4">
                <span className="font-semibold text-slate-300">Quick Portal Demo Logins:</span>
                <span className="font-mono text-amber-400">admin / admin123</span>
                <span>&bull;</span>
                <span className="font-mono text-amber-400">officer1 / officer123</span>
                <span>&bull;</span>
                <span className="font-mono text-amber-400">tenant1 / tenant123</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 12. STORE DETAILS MODAL */}
      {/* ========================================================================= */}
      {activeModalStore && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl">
            <div className="relative h-60">
              <img
                src={activeModalStore.image}
                alt={activeModalStore.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
              <button
                onClick={() => setActiveModalStore(null)}
                className="absolute top-4 right-4 bg-slate-950/80 text-white hover:text-amber-400 p-2 rounded-full border border-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">
                  Level {activeModalStore.floor} &bull; {activeModalStore.shopNumber}
                </span>
                <h3 className="text-2xl font-serif font-bold text-white mt-0.5">
                  {activeModalStore.name}
                </h3>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {activeModalStore.description}
              </p>

              {activeModalStore.offer && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs flex items-center gap-2">
                  <Tag className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span><strong>Current Privilege:</strong> {activeModalStore.offer}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Trading Hours</span>
                  <span className="text-white font-mono text-xs">{activeModalStore.hours}</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Contact Concierge</span>
                  <span className="text-white font-mono text-xs">{activeModalStore.phone}</span>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between gap-3">
                <a
                  href="#map"
                  onClick={() => {
                    setSelectedFloor(activeModalStore.floor);
                    setSelectedMapUnit(activeModalStore.shopNumber.replace('Shop ', ''));
                    setActiveModalStore(null);
                  }}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-lg text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                >
                  <Compass className="w-4 h-4" />
                  <span>Locate on Mall Map</span>
                </a>
                <button
                  onClick={() => setActiveModalStore(null)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 13. DINING RESERVATION MODAL */}
      {/* ========================================================================= */}
      {diningReservationStore && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Utensils className="w-5 h-5 text-amber-400" />
                <h3 className="font-serif font-bold text-white text-lg">Table Reservation</h3>
              </div>
              <button 
                onClick={() => setDiningReservationStore(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {reservationSuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="font-bold text-white text-base">Reservation Request Received!</h4>
                <p className="text-xs text-slate-300">
                  Your table at <strong>{diningReservationStore.name}</strong> for {reservationForm.guests} guests on {reservationForm.date} at {reservationForm.time} has been provisionally held.
                </p>
              </div>
            ) : (
              <form onSubmit={handleReservationSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Venue</label>
                  <input
                    type="text"
                    disabled
                    value={`${diningReservationStore.name} (Level ${diningReservationStore.floor})`}
                    className="w-full bg-slate-950 px-3 py-2 rounded-lg border border-slate-800 text-slate-400 font-medium"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={reservationForm.name}
                    onChange={(e) => setReservationForm({ ...reservationForm, name: e.target.value })}
                    placeholder="e.g. Marcus Sterling"
                    className="w-full bg-slate-950 px-3 py-2 rounded-lg border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Party Size</label>
                    <select
                      value={reservationForm.guests}
                      onChange={(e) => setReservationForm({ ...reservationForm, guests: e.target.value })}
                      className="w-full bg-slate-950 px-3 py-2 rounded-lg border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="1">1 Guest</option>
                      <option value="2">2 Guests (Table)</option>
                      <option value="4">4 Guests (Booth)</option>
                      <option value="6">6+ Guests (Private)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">Time</label>
                    <input
                      type="time"
                      value={reservationForm.time}
                      onChange={(e) => setReservationForm({ ...reservationForm, time: e.target.value })}
                      className="w-full bg-slate-950 px-3 py-2 rounded-lg border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Reservation Date</label>
                  <input
                    type="date"
                    value={reservationForm.date}
                    onChange={(e) => setReservationForm({ ...reservationForm, date: e.target.value })}
                    className="w-full bg-slate-950 px-3 py-2 rounded-lg border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-lg text-xs uppercase tracking-wider transition-colors"
                  >
                    Confirm Table Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 14. LUXURY FOOTER */}
      {/* ========================================================================= */}
      <footer className="bg-slate-950 border-t border-slate-900 pt-16 pb-12 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-900">
            {/* Column 1: Brand & Address */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5 text-white font-serif font-bold text-lg">
                <Building2 className="w-5 h-5 text-amber-400" />
                <span>NEXUS GRAND GALLERIA</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Metropolis City’s premier shopping, dining, and cultural destination. 60 international boutiques across 5 architectural levels.
              </p>
              <div className="space-y-1 text-slate-400 text-xs font-mono">
                <p>100 Galleria Boulevard, Metropolis City</p>
                <p>Concierge: +1 (555) 700-MALL</p>
                <p>guestservices@nexusmall.com</p>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase font-bold tracking-wider text-slate-200">Visitor Directory</h4>
              <ul className="space-y-2">
                <li><a href="#directory" className="hover:text-amber-400 transition-colors">Store &amp; Brand Directory</a></li>
                <li><a href="#dining" className="hover:text-amber-400 transition-colors">Skyline Dining &amp; Cafés</a></li>
                <li><a href="#map" className="hover:text-amber-400 transition-colors">Interactive Mall Map</a></li>
                <li><a href="#events" className="hover:text-amber-400 transition-colors">Calendar of Events</a></li>
                <li><a href="#offers" className="hover:text-amber-400 transition-colors">Exclusive Boutique Offers</a></li>
              </ul>
            </div>

            {/* Column 3: Management Portals */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase font-bold tracking-wider text-slate-200">Mall Operations</h4>
              <ul className="space-y-2">
                <li>
                  <button onClick={onNavigateToLogin} className="hover:text-amber-400 transition-colors flex items-center gap-1">
                    <Lock className="w-3 h-3 text-amber-400" />
                    <span>Management Portal Sign In</span>
                  </button>
                </li>
                <li><span className="text-slate-500">Commercial Tenant Leasing</span></li>
                <li><span className="text-slate-500">Floor Supervisor Inspection Protocols</span></li>
                <li><span className="text-slate-500">Billing &amp; Revenue Reconciliation</span></li>
                <li><span className="text-slate-500">Security &amp; Emergency Dispatch</span></li>
              </ul>
            </div>

            {/* Column 4: Newsletter & Privileges */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase font-bold tracking-wider text-slate-200">Galleria Gazette</h4>
              <p className="text-xs text-slate-400">
                Subscribe for private invitations to runway previews, chef tastings, and seasonal luxury gifts.
              </p>
              {newsletterSubscribed ? (
                <div className="p-2.5 bg-emerald-950/60 border border-emerald-800 rounded-lg text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Subscribed! Welcome to Galleria Privileges.</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    className="w-full bg-slate-900 px-3 py-2 rounded-lg border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2 rounded-lg text-xs uppercase tracking-wider transition-colors"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
            <p>&copy; 2026 Nexus Grand Galleria Mall Management System. BCA Academic Final-Year Project.</p>
            <div className="flex items-center gap-4">
              <span>Spring Boot 3.2.5</span>
              <span>&bull;</span>
              <span>Spring Data JPA</span>
              <span>&bull;</span>
              <span>Spring Security 6</span>
              <span>&bull;</span>
              <span>Thymeleaf + Bootstrap 5</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
