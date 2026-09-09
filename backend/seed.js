import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';
import Service from './models/Service.js';
import Category from './models/Category.js';
import Booking from './models/Booking.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/TalentConnect';

const categoriesData = [
  { name: 'Makeup Artists', icon: 'sparkles', color: '#ec4899', slug: 'makeup-artists' },
  { name: 'Mehndi Artists', icon: 'flower-oblong', color: '#f59e0b', slug: 'mehndi-artists' },
  { name: 'Decorators', icon: 'palette', color: '#10b981', slug: 'decorators' },
  { name: 'Caterers', icon: 'utensils', color: '#ef4444', slug: 'caterers' },
  { name: 'Photographers', icon: 'camera', color: '#3b82f6', slug: 'photographers' },
  { name: 'Videographers', icon: 'video', color: '#8b5cf6', slug: 'videographers' },
  { name: 'DJs', icon: 'music-note-list', color: '#a855f7', slug: 'djs' },
  { name: 'Singers', icon: 'mic', color: '#ec4899', slug: 'singers' },
  { name: 'Dancers', icon: 'footprints', color: '#f43f5e', slug: 'dancers' },
  { name: 'Anchors', icon: 'megaphone', color: '#06b6d4', slug: 'anchors' },
  { name: 'Wedding Planners', icon: 'heart', color: '#f43f5e', slug: 'wedding-planners' },
  { name: 'Event Organizers', icon: 'calendar-event', color: '#6366f1', slug: 'event-organizers' },
];

const artistsData = [
  {
    name: 'Priya Sharma',
    email: 'kwatrapranjal@gmail.com',
    role: 'artist',
    city: 'Delhi',
    phone: '9876543210',
    avatar: 'https://images.unsplash.com/photo-1594744803329-e58b31de215f?auto=format&fit=crop&w=150&h=150&q=80',
    service: {
      category: 'Makeup Artists',
      description: 'Award-winning bridal makeup artist specializing in modern, elegant HD & Airbrush wedding makeovers. With over 8 years of experience, Priya and her team deliver styling that makes every bride look flawless and radiant on her special day.',
      image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80'
      ],
      price: 15000,
      rating: 4.9,
      reviewsCount: 32,
      packages: [
        { name: 'Bridal HD Makeup', price: 15000, description: 'Complete HD bridal makeup, hair styling, draping, and lashes.', features: ['HD Makeup', 'Bridal Hairstyling', 'Saree/Dupatta Draping', 'Premium Lashes'] },
        { name: 'Bridal Airbrush Makeup', price: 22000, description: 'Flawless water-resistant airbrush makeup, hair styling, draping.', features: ['Airbrush Makeup', 'Hairstyling', 'Jewelry Setting', 'Dupatta Draping', 'Premium Lashes'] }
      ]
    }
  },
  {
    name: 'Aaradhya Mehndi Arts',
    email: 'aaradhya@talentconnect.com',
    role: 'artist',
    city: 'Mumbai',
    phone: '9876543211',
    avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=150&h=150&q=80',
    service: {
      category: 'Mehndi Artists',
      description: 'Specialists in intricate Marwari, Arabic, Zardozi, and contemporary custom bridal mehndi layouts. Using only 100% organic, dark-staining homemade henna paste to ensure a safe, rich color for your celebrations.',
      image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80'
      ],
      price: 8000,
      rating: 4.8,
      reviewsCount: 19,
      packages: [
        { name: 'Bridal Standard Mehndi', price: 8000, description: 'Traditional intricate bridal mehndi up to elbows & feet.', features: ['Marwari Bridal Pattern', 'Mehndi on Both Sides', 'Feet Mehndi up to Ankles', 'Organic Paste Included'] },
        { name: 'Premium Full Bridal', price: 12000, description: 'Intricate custom portrait mehndi up to mid-arms and knees.', features: ['Portrait Figures (Bride/Groom)', 'Design up to Mid-Arms', 'Full Feet up to Mid-Calves', 'Organic Paste', 'Post-Mehndi Care Kit'] }
      ]
    }
  },
  {
    name: 'Vibrant Events & Decors',
    email: 'vibrant@talentconnect.com',
    role: 'artist',
    city: 'Bangalore',
    phone: '9876543212',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
    service: {
      category: 'Decorators',
      description: 'Transforming banquets and lawns into fairytale settings with floral designs, ambient lighting, and bespoke themes. We specialize in destination weddings, corporate galas, and intimate backyard celebrations.',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1478812954026-9c750f0e89fc?auto=format&fit=crop&w=600&q=80'
      ],
      price: 40000,
      rating: 4.7,
      reviewsCount: 24,
      packages: [
        { name: 'Haldi/Mehendi Decor', price: 40000, description: 'Floral backdrop, seating arrangement, photobooth, props.', features: ['Marigold Floral Backdrop', 'Traditional Jhoola/Seating', '4 Props & Selfie Stand', 'Warm Lighting Installation'] },
        { name: 'Grand Wedding Stage', price: 120000, description: 'Exquisite royal floral stage, carpet, walkway, ceiling draping.', features: ['Premium Imported Flowers', 'Stage Backdrop Setup', 'Carpeted Walkway with Pillars', 'Draped Ceilings', 'Full Ambient LED Spotlights'] }
      ]
    }
  },
  {
    name: 'Royal Feast Catering',
    email: 'royal@talentconnect.com',
    role: 'artist',
    city: 'Jaipur',
    phone: '9876543213',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
    service: {
      category: 'Caterers',
      description: 'Crafting unforgettable culinary journeys with authentic Rajasthani, North Indian, Punjabi, Mughlai, Chinese, and Continental menus. Highly trained live-kitchen chefs, premium layouts, and impeccable hospitality service.',
      image: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80'
      ],
      price: 35000,
      rating: 4.8,
      reviewsCount: 45,
      packages: [
        { name: 'Silver Buffet (Per Plate)', price: 800, description: 'Standard menu with 2 starters, 3 main course dishes, 2 desserts.', features: ['Welcome Drinks (2)', 'Starters (2 Veg)', 'Main Course (3 Veg)', 'Breads & Rice', 'Desserts (2)'] },
        { name: 'Platinum Live Buffet (Per Plate)', price: 1500, description: 'Premium non-veg & veg menu with live counters, mocktails, premium desserts.', features: ['Assorted Mocktails (4)', 'Starters (3 Veg, 2 Non-veg)', 'Live Pasta & Chaat Counter', 'Main Course (4 Veg, 2 Non-veg)', 'Artisanal Desserts (4)'] }
      ]
    }
  },
  {
    name: 'Aman Verma Photography',
    email: 'aman@talentconnect.com',
    role: 'artist',
    city: 'Mumbai',
    phone: '9876543214',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80',
    service: {
      category: 'Photographers',
      description: 'Candid wedding and portrait photographer passionate about capturing raw emotions, joyful laughs, and beautiful connections. Aman Verma has shot over 150+ weddings across India and international destinations.',
      image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=600&q=80'
      ],
      price: 25000,
      rating: 4.9,
      reviewsCount: 56,
      packages: [
        { name: 'Pre-Wedding Shoot', price: 25000, description: '1-day pre-wedding photography shoot at 2 outdoor locations.', features: ['4-6 Hours Session', '2 Outdoor Locations', '40 Edited High-Res Photos', 'Cinematic Photo Teaser'] },
        { name: 'Full Wedding Photography', price: 60000, description: 'Candid & traditional coverage of wedding and reception (2 days).', features: ['2 Lead Photographers', 'Candid & Traditional Coverage', 'Premium Leather-Bound Album (2)', 'Full Digital Delivery within 4 weeks'] }
      ]
    }
  },
  {
    name: 'CineLove Films',
    email: 'cinelove@talentconnect.com',
    role: 'artist',
    city: 'Delhi',
    phone: '9876543215',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80',
    service: {
      category: 'Videographers',
      description: 'Premium wedding cinematography studio creating visual masterpieces. We write and direct cinematic films that tell your love story, utilizing 4K cinema cameras, aerial drones, and award-winning editors.',
      image: 'https://images.unsplash.com/photo-1478812954026-9c750f0e89fc?auto=format&fit=crop&w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=600&q=80'
      ],
      price: 30000,
      rating: 4.8,
      reviewsCount: 28,
      packages: [
        { name: 'Teaser & Highlights', price: 30000, description: 'Cinematic 3-minute wedding teaser film and aerial drone footages.', features: ['1 Lead Cinematographer', '4K Camera Equipment', 'Drone Aerial Shots', '3-Min Edited Wedding Teaser'] },
        { name: 'Complete Wedding Documentary', price: 80000, description: 'Bespoke cinematic narrative film + long traditional highlight video.', features: ['2 Cinematographers', '4K Cinematic Camera Setups', 'Full Length Film (40-60 Mins)', '3-Min Instagram Teaser Film', 'Full Raw Footage Delivery'] }
      ]
    }
  },
  {
    name: 'DJ Rohit',
    email: 'rohit@talentconnect.com',
    role: 'artist',
    city: 'Goa',
    phone: '9876543216',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&h=150&q=80',
    service: {
      category: 'DJs',
      description: 'DJ Rohit is famous for packing dance floors with a blend of Bollywood, Punjabi, EDM, commercial house, and hip hop tracks. Top-tier Pioneer consoles, customized party sets, and live audio integration.',
      image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80'
      ],
      price: 15000,
      rating: 4.9,
      reviewsCount: 38,
      packages: [
        { name: 'Sangeet Party DJ', price: 15000, description: '4 hours party music, sound system, and cordless microphones.', features: ['4-Hour Non-stop Music Set', 'Pioneer DJ Console Setup', 'JBL Sound System (2 Top Speakers)', 'Wireless Handheld Mics (2)'] },
        { name: 'Premium DJ & Stage Lights', price: 30000, description: 'Uncapped party DJ service with premium line array sound systems, trussing and moving head lasers.', features: ['Unlimited Hours DJ Service', 'Subwoofers & Line Array Sound', 'Stage Moving-Head Laser Lights', 'Full Metal Truss Setup', 'Smoke Machine Effect'] }
      ]
    }
  },
  {
    name: 'Kavya Nair',
    email: 'kavya@talentconnect.com',
    role: 'artist',
    city: 'Chennai',
    phone: '9876543217',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=150&h=150&q=80',
    service: {
      category: 'Singers',
      description: 'Sultry-voiced playback and live stage singer performing Bollywood hits, romantic ghazals, Sufi classics, and regional melodies. Kavya brings a captivating stage energy to corporate galas, weddings, and concerts.',
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=600&q=80'
      ],
      price: 20000,
      rating: 5.0,
      reviewsCount: 62,
      packages: [
        { name: 'Acoustic Solo Session', price: 20000, description: '2 hours of romantic acoustic session with solo singer + 1 guitarist.', features: ['Solo Vocalist (Kavya)', '1 Professional Guitarist Accompaniment', 'Romantic/Unplugged Setlist', 'Basic Stage Monitors'] },
        { name: 'Full Live Band Performance', price: 50000, description: '3 hours high-energy Bollywood, Sufi, Pop gig with full live instrumental band.', features: ['Vocalist (Kavya) + 4 Band Members', 'Drums, Keyboard, Bass, Lead Guitar', 'High-Octane Bollywood & Sufi Mix', 'Complete Sound Engineering Team'] }
      ]
    }
  },
  {
    name: 'Rhythmica Dance Group',
    email: 'rhythmica@talentconnect.com',
    role: 'artist',
    city: 'Kolkata',
    phone: '9876543218',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150&q=80',
    service: {
      category: 'Dancers',
      description: 'Professional dance troupe specializing in thematic wedding entries, Bollywood flashmobs, traditional Kathak/Bharatnatyam acts, and high-energy hip-hop backup dance. We choreograph family items and customize entry concepts.',
      image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?auto=format&fit=crop&w=600&q=80'
      ],
      price: 18000,
      rating: 4.7,
      reviewsCount: 14,
      packages: [
        { name: 'Wedding Couple Entry Act', price: 18000, description: 'Bespoke bride & groom entry choreography with 4 troupe dancers.', features: ['Troupe Dancers (4)', 'Props & Costume Coordination', 'Bride/Groom Entry Choreography', '1 Dry Run Rehearsal'] },
        { name: 'Troupe Thematic Performance', price: 45000, description: 'Full event performance including 3 grand thematic routines (8-10 dancers).', features: ['8 Professional Dancers', '3 Dynamic Thematic Dance Acts', 'Custom Costumes & LED Integration', 'Choreographer Supervision'] }
      ]
    }
  },
  {
    name: 'Sahil Mehta',
    email: 'sahil@talentconnect.com',
    role: 'artist',
    city: 'Pune',
    phone: '9876543219',
    avatar: 'https://images.unsplash.com/photo-1500048993953-d23a436266cf?auto=format&fit=crop&w=150&h=150&q=80',
    service: {
      category: 'Anchors',
      description: 'Charismatic, fluent English/Hindi emcee and anchor. Specializes in interactive games, crowd integration, and smooth timeline hostings for sangeets, weddings, corporate launches, and trade shows.',
      image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=600&q=80'
      ],
      price: 12000,
      rating: 4.9,
      reviewsCount: 22,
      packages: [
        { name: 'Sangeet Hosting', price: 12000, description: 'Anchoring sangeet ceremony with fun games and guest interactions.', features: ['Sangeet Ceremony Emcee', 'Guest Interactive Fun Games', 'Coordination of Family Dance Items', 'Standard Handheld Mic Accessories'] },
        { name: 'Grand Reception MC', price: 25000, description: 'Corporate style premium reception hosting, timeline management, formal announcements.', features: ['Full Reception Emcee Duty', 'Formal Guest Welcomes', 'Timeline Management & Runs', 'VIP Guest Interviews'] }
      ]
    }
  },
  {
    name: 'Dreams & Vows Weddings',
    email: 'dreams@talentconnect.com',
    role: 'artist',
    city: 'Udaipur',
    phone: '9876543220',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80',
    service: {
      category: 'Wedding Planners',
      description: 'End-to-end luxury wedding planning and coordination boutique based in Udaipur. Specializing in destination palace weddings, vendor negotiations, timeline mapping, guest logistics, and creative directions.',
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80'
      ],
      price: 75000,
      rating: 4.8,
      reviewsCount: 30,
      packages: [
        { name: 'On-Day Coordination', price: 75000, description: 'Coordination and management of vendors, timelines, and guest relations on the main event day.', features: ['1 Lead Coordinator + 2 Assistants', 'On-site Vendor Management', 'Timeline Execution & Spot Checks', 'Guest Hospitality Desk Setup'] },
        { name: 'Complete Wedding Planning', price: 250000, description: 'Full planning from venue selection, negotiations, booking management, design styling, and execution.', features: ['Palace Destination Wedding Planning', 'Complete Vendor Hiring & Budgeting', 'Creative Layout & Stage Designs', 'Logistics Management for up to 300 Guests', '4-Person On-site Command Team'] }
      ]
    }
  },
  {
    name: 'Grand Celebrate Events',
    email: 'grand@talentconnect.com',
    role: 'artist',
    city: 'Gurgaon',
    phone: '9876543221',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&h=150&q=80',
    service: {
      category: 'Event Organizers',
      description: 'Full-service management agency executing corporate summits, trade exhibitions, birthdays, anniversaries, and theme parties. Seamless setups, digital check-ins, VIP security, and immersive styling.',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
      images: [
        'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80'
      ],
      price: 50000,
      rating: 4.6,
      reviewsCount: 16,
      packages: [
        { name: 'Premium Theme Party', price: 50000, description: 'Organization of theme birthday/anniversary parties (up to 100 guests).', features: ['Theme Concept Planning', 'Invitations & Digital RSVPs', 'Emcee Host + Music Playlists', 'Full Venue Setup & Cleanup'] },
        { name: 'Corporate Summit Coordinator', price: 150000, description: 'Full logistics and stage management for corporate events and annual days.', features: ['Corporate Event Command Team', 'AV Production & Large LED Walls', 'VIP Lounge/Greenroom Setups', 'Attendee Registrations & Badges'] }
      ]
    }
  }
];

async function seed() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(MONGO_URI);
    console.log('Database connected!');

    // Clean databases
    console.log('Cleaning collections...');
    await User.deleteMany({});
    await Service.deleteMany({});
    await Category.deleteMany({});
    await Booking.deleteMany({});
    console.log('Collections cleared!');

    // Seed Categories
    console.log('Seeding categories...');
    const insertedCategories = await Category.insertMany(categoriesData);
    console.log(`Successfully seeded ${insertedCategories.length} categories.`);

    // Seed Client User
    console.log('Seeding test client...');
    const clientUser = await User.create({
      name: 'Pranjal Kwatra',
      email: 'pranjal.kwatra@gmail.com',
      password: 'password123',
      role: 'client',
      city: 'Delhi',
      phone: '9898989898',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80',
      isVerified: true
    });
    console.log('Client user created:', clientUser.email);

    // Seed Artists and their Services
    console.log('Seeding artist accounts and service listings...');
    for (const art of artistsData) {
      const sampleQuals = [
        {
          title: `Certified Professional in ${art.service.category}`,
          issuer: 'National Academy of Performing & Creative Arts',
          year: '2022',
          isAiVerified: true,
          isDigiLockerVerified: true,
          score: 98,
        }
      ];

      const sampleCerts = [
        {
          title: `Masterclass Excellence in ${art.service.category}`,
          category: 'Professional Talent Skill',
          issuer: 'Skill India / NSDC Certified Guild',
          credentialId: `NSDC-${Math.floor(100000 + Math.random() * 900000)}`,
          verifiedBadge: 'DigiLocker & AI Verified',
          aiConfidence: 99,
        }
      ];

      // 1. Create artist user
      const artistUser = await User.create({
        name: art.name,
        email: art.email,
        password: 'password123', // standard test password
        role: 'artist',
        city: art.city,
        phone: art.phone,
        avatar: art.avatar,
        isVerified: true,
        emailVerified: true,
        phoneVerified: true,
        docVerified: true,
        paymentComplete: true,
        digilockerVerified: true,
        aiVerificationScore: 98,
        qualifications: sampleQuals,
        certificates: sampleCerts,
      });

      // 2. Create service listing referencing artistId
      await Service.create({
        artistId: artistUser._id,
        name: art.name,
        category: art.service.category,
        description: art.service.description,
        image: art.service.image,
        images: art.service.images,
        price: art.service.price,
        city: art.city,
        rating: art.service.rating,
        reviewsCount: art.service.reviewsCount,
        packages: art.service.packages,
        isVerified: true,
        digilockerVerified: true,
        aiVerificationScore: 98,
        qualifications: sampleQuals,
        certificates: sampleCerts,
        status: 'active',
        // pre-populate with some sample reviews
        reviewsList: [
          {
            userId: clientUser._id,
            userName: clientUser.name,
            userAvatar: clientUser.avatar,
            rating: Math.floor(art.service.rating),
            comment: `Amazing performance! ${art.name} did an outstanding job at our family function last month. Highly recommended!`,
            date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7) // 7 days ago
          }
        ]
      });
      console.log(`Seeded artist + service listing: ${art.name} (${art.service.category})`);
    }

    console.log('Seeding completed successfully! 🎉');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed with error:', error);
    process.exit(1);
  }
}

seed();
