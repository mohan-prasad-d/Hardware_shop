import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  torqueRating?: string;
  battery?: string;
  rpm?: string;
  chuck?: string;
  weight?: string;
  warranty: string;
  rating: number;
  reviewsCount: number;
  inStock: number;
  image: string;
  description: string;
  specs: Record<string, string>;
  features: string[];
}

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  companyName?: string;
  shippingAddress: string;
  city: string;
  postalCode: string;
  paymentMethod: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: 'PROCESSING' | 'CONFIRMED' | 'DISPATCHED' | 'DELIVERED';
  createdAt: string;
  estimatedDelivery: string;
  trackingNumber: string;
}

// In-memory catalog database
const PRODUCTS: Product[] = [
  {
    id: 'fp-titan-24v',
    name: 'Titan-X 24V Brushless Impact Driver',
    category: 'Power Tools',
    price: 219.00,
    originalPrice: 249.00,
    torqueRating: '245 Nm',
    battery: '24V 5.0Ah Li-Ion High-Drain',
    rpm: '0 - 3,800 RPM',
    chuck: '1/4-in Quick-Hex Auto-Lock',
    weight: '1.28 kg (tool only)',
    warranty: '5-Year Commercial Heavy-Duty Warranty',
    rating: 4.95,
    reviewsCount: 148,
    inStock: 34,
    image: '/src/assets/images/product_impact_driver_1791194386696.jpg',
    description: 'Engineered for commercial contractors and structural assembly. The Titan-X features an enclosed neodymium stator core delivering zero-drag rotation with 245 Nm sustained rotary torque.',
    specs: {
      'Motor Type': 'Series-8 High-Flux Brushless',
      'Max Rotary Torque': '245 Nm / 2,168 in-lbs',
      'No-Load Speed': '0 - 1,200 / 2,400 / 3,800 RPM',
      'Impact Frequency': '0 - 4,200 IPM',
      'Chuck System': '1/4" Hex Dual Ball-Detent Quick Release',
      'Housing': 'Glass-Filled Nylon with Cast Magnesium Front Gearbox',
      'Drop Rating': '3-Meter Concrete Drop Certified (MIL-STD 810H)',
      'Illumination': 'Twin Forward 180-Lumen Halo LEDs'
    },
    features: [
      'Neodymium brushless rotor with active thermal dissipation fins',
      'Tri-speed planetary transmission forged from S2 tool steel',
      'Electronic torque governor prevents fastener head stripping',
      'CoolPack 24V battery architecture with cell-level heat sink channels'
    ]
  },
  {
    id: 'fp-torque-micrometer',
    name: 'Apex-Cal 1/2" Digital Angle-Torque Wrench',
    category: 'Precision Measurement',
    price: 289.00,
    torqueRating: '20 - 350 Nm (±1%)',
    battery: 'USB-C Fast Rechargeable Li-Po',
    rpm: '72-Tooth Ratchet (5° Arc)',
    chuck: '1/2-in Cr-V Square Drive',
    weight: '1.45 kg',
    warranty: 'Lifetime NIST-Traceable Calibration',
    rating: 4.98,
    reviewsCount: 92,
    inStock: 19,
    image: '/src/assets/images/product_digital_torque_wrench_1791194398479.jpg',
    description: 'Micrometer-calibrated digital torque and angle instrument for heavy plant, automotive suspension, and structural steel flange bolting with live haptic feedback.',
    specs: {
      'Measurement Range': '20.0 - 350.0 Nm / 14.7 - 258.0 ft-lb',
      'Accuracy Rating': '±1% Clockwise, ±1.5% Counter-Clockwise',
      'Display': 'Transflective High-Contrast OLED with Angle Sensor',
      'Alert Feedback': 'Progressive Multi-LED Bar + Acoustic Buzzer + Handle Haptic Vibration',
      'Memory Capacity': '500 Fastener Records with USB-C CSV Export',
      'Certification': 'Individually Serialized NIST Certificate Included'
    },
    features: [
      'Simultaneous torque-to-yield angle tracking in one pass',
      'Cast chrome-vanadium 72-tooth head with directional reverse lever',
      'IP65 water & hydraulic fluid resistant sealed keypad',
      'Quick-switch units: Nm, ft-lb, in-lb, kg-cm'
    ]
  },
  {
    id: 'fp-green-laser-360',
    name: 'SpectraBeam 3x360° Industrial Rotary Green Laser',
    category: 'Precision Measurement',
    price: 345.00,
    originalPrice: 389.00,
    torqueRating: 'N/A',
    battery: 'Dual 4000mAh Lithium Pack',
    rpm: 'Self-Leveling ±4°',
    chuck: '1/4" & 5/8" Tripod Thread',
    weight: '0.94 kg',
    warranty: '3-Year Drop & Shock Guarantee',
    rating: 4.91,
    reviewsCount: 76,
    inStock: 22,
    image: '/src/assets/images/product_laser_level_system_1791194423910.jpg',
    description: 'Triple 360-degree green laser plane system with true high-visibility semiconductor diodes visible up to 80m. Drop-damped pendulum locking mechanism protects optics in transit.',
    specs: {
      'Laser Spectrum': '515nm German Osram Pure Green Diode (Class II)',
      'Operating Range': '80m line visual (120m with optical receiver)',
      'Levelling Accuracy': '±1.5mm @ 10m (±1/16" @ 33ft)',
      'Self-Levelling Window': '±4° Auto-Level with Out-of-Level Buzzer',
      'Enclosure Protection': 'IP65 Water Jet & Industrial Particulate Guard',
      'Mounting Interface': '1/4"-20 Brass Bushing + 5/8"-11 Heavy Tripod Port'
    },
    features: [
      'Three 360-degree planes (1 horizontal, 2 vertical) for complete room squaring',
      'Pendulum magnetic damping with mechanical transport lock',
      'Pulse mode compatible with outdoor rotary laser detectors',
      'Includes fine-adjustment micro-dial wall bracket and rugged hard case'
    ]
  },
  {
    id: 'fp-impact-bits-100',
    name: 'Vanguard TiN Shockwave Impact Bit Vault (100-pc)',
    category: 'Accessories',
    price: 64.50,
    originalPrice: 79.00,
    torqueRating: 'High-Tension S2',
    battery: 'N/A',
    rpm: 'Rated to 300 Nm',
    chuck: '1/4-in Precision Hex Shank',
    weight: '1.10 kg',
    warranty: 'Lifetime Shatter Replacement',
    rating: 4.89,
    reviewsCount: 234,
    inStock: 85,
    image: '/src/assets/images/product_impact_bit_set_1791194411362.jpg',
    description: 'Engineered specifically for heavy pulse impact drivers. Cold-forged S2 alloy steel with computer-modeled geometric torsion zone absorbs peak rotary shocks.',
    specs: {
      'Steel Formulation': 'Modified S2 High-Manganese Shock Alloy',
      'Surface Hardness': '60-62 HRC with TiN Gold Vapor Coating',
      'Torsion Technology': 'Laser-Etched Geometric Elastic Torsion Neck',
      'Tip Types': 'Phillips, Torx Tamper-Proof, Pozidriv, Hex Metric, Square Recess',
      'Storage Case': 'Reinforced Impact Polycarbonate with Rubber Gasket'
    },
    features: [
      'CNC milled magnetic tips eliminate cam-out slippage and stripped screws',
      'Titanium Nitride coating reduces friction heat by 35%',
      'Includes 3 quick-change magnetic bit holders and socket adapters',
      'Lifetime warranty: if any bit snaps, we ship an immediate replacement'
    ]
  },
  {
    id: 'fp-plunge-saw-185',
    name: 'PrecisionCut 185mm Industrial Plunge Track Saw',
    category: 'Power Tools',
    price: 379.00,
    torqueRating: '1800W Equivalent',
    battery: 'Corded 230V / 110V Pro Line',
    rpm: '2,000 - 5,500 RPM Constant',
    chuck: '20mm Bore Arbour',
    weight: '4.8 kg',
    warranty: '5-Year Commercial Warranty',
    rating: 4.93,
    reviewsCount: 62,
    inStock: 16,
    image: '/src/assets/images/hero_workshop_machinery_1791194370329.jpg',
    description: 'Dead-straight splinter-free sheet cutting. Features anti-kickback pawl, riving knife, and fine-calibrated bevel tilt from -1° to +48° with positive stops.',
    specs: {
      'Input Power': '1,400W High-Torque Motor with Soft-Start Electronics',
      'Max Cutting Depth': '66mm @ 90° (59mm on track), 48mm @ 45°',
      'Speed Regulation': 'Electronic Constant Speed Governor under load',
      'Dust Extraction': 'Rotatable 36mm Dust Port with 92% Capture Efficiency',
      'Rail Compatibility': 'Festool, Makita, and Bosch Track Extrusion Profile'
    },
    features: [
      'Dual guide groove base plate for precision track alignment',
      'Mechanical riving knife rises and plunges with the blade',
      'Fine micro-adjusters remove all sideways track play',
      'Includes 48-tooth micro-grain tungsten carbide tipped blade'
    ]
  },
  {
    id: 'fp-silent-compressor',
    name: 'Cyclone Ultra-Silent 10-Bar Twin-Tank Air System',
    category: 'Pneumatics',
    price: 435.00,
    torqueRating: '10 Bar (145 PSI)',
    battery: '2.0 HP Induction Motor',
    rpm: '1,420 RPM Low-Speed',
    chuck: 'Twin 1/4" Euro Quick-Couplers',
    weight: '26.5 kg',
    warranty: '4-Year Commercial Warranty',
    rating: 4.88,
    reviewsCount: 44,
    inStock: 12,
    image: '/src/assets/images/hero_workshop_machinery_1791194370329.jpg',
    description: 'Ultra-low acoustic profile compressor (only 59 dBA) designed for indoor carpentry, cabinetry installations, and workshop pneumatic tools without ear fatigue.',
    specs: {
      'Operating Sound': '59 dBA @ 1 Meter (Normal Conversation Level)',
      'Max Pressure': '10.0 Bar / 145 PSI',
      'Free Air Delivery': '190 L/min @ 6 Bar (6.7 CFM)',
      'Tank Volume': '24 Litre Dual Horizontal Steel Reservoir',
      'Pump Architecture': 'Dual 4-Cylinder Oil-Free Maintenance-Free Head'
    },
    features: [
      'Pure copper low-RPM induction motor for extended service life',
      'Integrated water trap separator and precision regulator gauges',
      'Anti-vibration oversized solid rubber all-terrain wheels',
      'Cold-start unloader valve for effortless sub-zero operation'
    ]
  }
];

// In-memory orders database with pre-seeded sample order for lookup demo
const ORDERS: Map<string, Order> = new Map([
  [
    'FP-9824-X',
    {
      id: 'FP-9824-X',
      customerName: 'Marcus Sterling',
      customerEmail: 'contractor@apexstructural.com',
      companyName: 'Apex Structural Engineering Ltd',
      shippingAddress: '420 Industrial Parkway, Berth 7',
      city: 'Chicago, IL',
      postalCode: '60607',
      paymentMethod: 'Commercial Purchase Order / Net 30',
      items: [
        {
          productId: 'fp-titan-24v',
          name: 'Titan-X 24V Brushless Impact Driver',
          price: 219.00,
          quantity: 2
        },
        {
          productId: 'fp-impact-bits-100',
          name: 'Vanguard TiN Shockwave Impact Bit Vault (100-pc)',
          price: 64.50,
          quantity: 2
        }
      ],
      subtotal: 567.00,
      tax: 45.36,
      shipping: 0.00,
      total: 612.36,
      status: 'DISPATCHED',
      createdAt: '2026-10-04T14:22:00.000Z',
      estimatedDelivery: '2026-10-06T17:00:00.000Z',
      trackingNumber: 'FPX-7749-99201-US'
    }
  ]
]);

// Quotes submitted by contractors
const QUOTES: any[] = [];

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // 1. API: Get all products
  app.get('/api/products', (req: Request, res: Response) => {
    const { category, search, sort } = req.query;
    let filtered = [...PRODUCTS];

    if (category && category !== 'All Equipment') {
      filtered = filtered.filter(p => p.category.toLowerCase() === String(category).toLowerCase());
    }

    if (search) {
      const q = String(search).toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    if (sort === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    res.json({
      success: true,
      total: filtered.length,
      products: filtered
    });
  });

  // 2. API: Get single product by ID
  app.get('/api/products/:id', (req: Request, res: Response) => {
    const product = PRODUCTS.find(p => p.id === req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found in hardware depot.' });
    }
    res.json({ success: true, product });
  });

  // 3. API: Create Order / Checkout
  app.post('/api/orders', (req: Request, res: Response) => {
    const {
      customerName,
      customerEmail,
      companyName,
      shippingAddress,
      city,
      postalCode,
      paymentMethod = 'Credit / Corporate Procurement',
      items
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, error: 'Equipment cart cannot be empty.' });
    }

    if (!customerEmail || !customerName || !shippingAddress) {
      return res.status(400).json({ success: false, error: 'Recipient name, email and job-site address are required.' });
    }

    // Calculate verified totals
    let subtotal = 0;
    const validatedItems: OrderItem[] = [];

    for (const item of items) {
      const matched = PRODUCTS.find(p => p.id === item.productId || p.id === item.id);
      if (matched) {
        const qty = Math.max(1, parseInt(item.quantity) || 1);
        subtotal += matched.price * qty;
        validatedItems.push({
          productId: matched.id,
          name: matched.name,
          price: matched.price,
          quantity: qty
        });
      }
    }

    if (validatedItems.length === 0) {
      return res.status(400).json({ success: false, error: 'No valid hardware products found in cart.' });
    }

    const tax = Math.round(subtotal * 0.08 * 100) / 100;
    const shipping = subtotal > 150 ? 0 : 18.00;
    const total = Math.round((subtotal + tax + shipping) * 100) / 100;

    // Generate Order Reference
    const orderId = `FP-${Math.floor(1000 + Math.random() * 9000)}-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`;
    const trackingNumber = `FPX-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(10000 + Math.random() * 90000)}-US`;

    const newOrder: Order = {
      id: orderId,
      customerName,
      customerEmail,
      companyName,
      shippingAddress,
      city: city || 'Standard Logistics Hub',
      postalCode: postalCode || '00000',
      paymentMethod,
      items: validatedItems,
      subtotal,
      tax,
      shipping,
      total,
      status: 'CONFIRMED',
      createdAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
      trackingNumber
    };

    ORDERS.set(orderId, newOrder);

    res.status(201).json({
      success: true,
      message: 'Hardware purchase order confirmed. Allocated to warehouse queue.',
      order: newOrder
    });
  });

  // 4. API: Get Order Status / Tracking
  app.get('/api/orders/:id', (req: Request, res: Response) => {
    const orderId = req.params.id.trim().toUpperCase();
    const order = ORDERS.get(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: `Order reference ${orderId} not found in logistics registry.`
      });
    }
    res.json({ success: true, order });
  });

  // 5. API: Submit Contractor Bulk RFQ (Request for Quote)
  app.post('/api/rfq', (req: Request, res: Response) => {
    const { companyName, contactName, email, phone, projectType, estimatedUnits, notes } = req.body;
    if (!email || !contactName) {
      return res.status(400).json({ success: false, error: 'Contact name and corporate email required.' });
    }

    const rfqId = `RFQ-${Math.floor(10000 + Math.random() * 90000)}`;
    const record = {
      rfqId,
      companyName: companyName || 'Independent General Contractor',
      contactName,
      email,
      phone: phone || 'N/A',
      projectType: projectType || 'Commercial Construction',
      estimatedUnits: estimatedUnits || '25-50 Units',
      notes: notes || '',
      submittedAt: new Date().toISOString(),
      status: 'UNDER_ACCOUNT_EXECUTIVE_REVIEW'
    };
    QUOTES.push(record);

    res.status(201).json({
      success: true,
      message: 'Commercial contractor RFQ filed. An engineering account rep will dispatch custom volume pricing within 2 hours.',
      quoteReference: rfqId
    });
  });

  // 6. Vite or Static Production middleware
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, () => {
    console.log(`[ForgePoint Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
