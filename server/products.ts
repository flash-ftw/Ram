import { Category, Product } from "@shared/schema";

export const sampleCategories: Omit<Category, "id">[] = [
  {
    name: "Furniture",
    slug: "furniture",
    image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=350"
  },
  {
    name: "Electronics",
    slug: "electronics",
    image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=350"
  },
  {
    name: "Lighting",
    slug: "lighting",
    image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=350"
  },
  {
    name: "Decor",
    slug: "decor",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=350"
  }
];

export const sampleProducts: Omit<Product, "id">[] = [
  {
    name: "Ergonomic Lounge Chair",
    slug: "ergonomic-lounge-chair",
    price: 299.99,
    originalPrice: 399.99,
    description: "Premium crafted ergonomic chair designed for maximum comfort and style. Our Ergonomic Lounge Chair combines style and comfort for the perfect addition to any living space.",
    features: "Premium solid wood frame construction\nHigh-density foam cushioning for maximum comfort\nStain-resistant fabric upholstery\nErgonomic design for proper posture support",
    categoryId: 1, // Furniture
    featured: true,
    mainImage: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=450",
    galleryImages: [
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
    ]
  },
  {
    name: "Brass Pendant Lamp",
    slug: "brass-pendant-lamp",
    price: 149.99,
    originalPrice: null,
    description: "Elegant pendant lamp with brass finish, perfect for dining rooms and entryways. This stylish lighting fixture adds a warm, sophisticated glow to any space.",
    features: "Genuine brass construction with premium finish\nAdjustable hanging height\nCompatible with LED bulbs\nDimmable with compatible switches\nEasy installation",
    categoryId: 3, // Lighting
    featured: true,
    mainImage: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=450",
    galleryImages: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
    ]
  },
  {
    name: "Premium Wireless Speaker",
    slug: "premium-wireless-speaker",
    price: 199.99,
    originalPrice: 249.99,
    description: "High-fidelity wireless speaker with minimalist design and exceptional sound quality. Experience room-filling sound with deep bass and crystal-clear highs.",
    features: "Bluetooth 5.0 connectivity\n20+ hour battery life\nWater-resistant design\nMulti-room pairing capability\nBuilt-in voice assistant support",
    categoryId: 2, // Electronics
    featured: true,
    mainImage: "https://images.unsplash.com/photo-1545454675-3531b543be5d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=450",
    galleryImages: [
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1558089687-f282ffcbc126?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
    ]
  },
  {
    name: "Artisan Ceramic Vase",
    slug: "artisan-ceramic-vase",
    price: 89.99,
    originalPrice: null,
    description: "Handcrafted ceramic vase with unique organic shape, perfect for modern interiors. Each piece is hand-thrown by skilled artisans, ensuring a one-of-a-kind addition to your home.",
    features: "100% handcrafted by skilled artisans\nDurable glazed finish\nWaterproof interior\nSuitable for fresh or dried arrangements\nFair trade certified",
    categoryId: 4, // Decor
    featured: true,
    mainImage: "https://pixabay.com/get/g3d3d82bdd41d82b996a914d87bc7e3a1b3592afc4e96ab4c54432bb877776558fc698fd14f5713024a2349783c5af3a478ef2becbbd4549721a520892fab0758_1280.jpg",
    galleryImages: [
      "https://pixabay.com/get/g3d3d82bdd41d82b996a914d87bc7e3a1b3592afc4e96ab4c54432bb877776558fc698fd14f5713024a2349783c5af3a478ef2becbbd4549721a520892fab0758_1280.jpg",
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
    ]
  },
  {
    name: "Modern Office Desk",
    slug: "modern-office-desk",
    price: 349.99,
    originalPrice: 429.99,
    description: "Sleek minimal desk with cable management system and spacious workspace. This modern desk combines functionality and style, perfect for home offices and workspaces.",
    features: "Durable engineered wood construction\nIntegrated cable management system\nSpacious drawer storage\nAdjustable feet for uneven floors\nEasy assembly",
    categoryId: 1, // Furniture
    featured: false,
    mainImage: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=450",
    galleryImages: [
      "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
    ]
  },
  {
    name: "Smart Home Speaker",
    slug: "smart-home-speaker",
    price: 129.99,
    originalPrice: 159.99,
    description: "Voice-controlled smart speaker with premium sound and home automation capabilities. Control your smart home, play music, get answers to questions, and more.",
    features: "Voice assistant technology\nMulti-room audio support\nSmart home device control\nHigh-quality omnidirectional sound\nPrivacy features with mic mute option",
    categoryId: 2, // Electronics
    featured: false,
    mainImage: "https://images.unsplash.com/photo-1558089687-f282ffcbc126?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=450",
    galleryImages: [
      "https://images.unsplash.com/photo-1558089687-f282ffcbc126?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
    ]
  },
  {
    name: "Adjustable Floor Lamp",
    slug: "adjustable-floor-lamp",
    price: 179.99,
    originalPrice: null,
    description: "Contemporary floor lamp with adjustable arm and dimmable LED light. The flexible arm allows you to direct light exactly where you need it, perfect for reading or accent lighting.",
    features: "Energy-efficient LED technology\nFully adjustable arm and head\nTouch-sensitive dimmer switch\nHeavy-duty weighted base\nModern matte finish",
    categoryId: 3, // Lighting
    featured: false,
    mainImage: "https://images.unsplash.com/photo-1540932239986-30128078f3c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=450",
    galleryImages: [
      "https://images.unsplash.com/photo-1540932239986-30128078f3c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
    ]
  },
  {
    name: "Abstract Wall Art",
    slug: "abstract-wall-art",
    price: 119.99,
    originalPrice: 149.99,
    description: "Hand-painted abstract canvas art to add color and personality to any space. Each piece is individually created by talented artists, making your art truly unique.",
    features: "Original handcrafted artwork\nPremium acrylic paints on canvas\nGallery wrapped edges\nReady to hang with mounting hardware included\nSigned by the artist",
    categoryId: 4, // Decor
    featured: false,
    mainImage: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=450",
    galleryImages: [
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
    ]
  },
  {
    name: "Storage Coffee Table",
    slug: "storage-coffee-table",
    price: 249.99,
    originalPrice: 299.99,
    description: "Multi-functional coffee table with hidden storage compartments. This stylish table offers practical storage solutions while maintaining a sleek, modern aesthetic.",
    features: "Lift-top mechanism for easy access\nHidden storage compartment\nSolid wood construction\nSoft-close hinges\nWater-resistant finish",
    categoryId: 1, // Furniture
    featured: false,
    mainImage: "https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=450",
    galleryImages: [
      "https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
    ]
  },
  {
    name: "Premium Smart Watch",
    slug: "premium-smart-watch",
    price: 199.99,
    originalPrice: 249.99,
    description: "Advanced smart watch with health monitoring and notifications. Track your fitness goals, receive notifications, and stay connected with this stylish, feature-rich smartwatch.",
    features: "Health & fitness tracking\nHeart rate & sleep monitoring\nWater resistant to 50m\n5-day battery life\nTouchscreen display with customizable faces",
    categoryId: 2, // Electronics
    featured: false,
    mainImage: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=450",
    galleryImages: [
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
      "https://images.unsplash.com/photo-1550009158-9ebf69173e03?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
    ]
  }
];
