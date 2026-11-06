import { 
  Product, 
  Customer, 
  Supplier, 
  Invoice, 
  Expense, 
  OnlineOrder, 
  BusinessSettings, 
  InventoryMovement,
  CustomerLedgerEntry,
  SupplierLedgerEntry
} from '../types/database';

export const INITIAL_SETTINGS: BusinessSettings = {
  businessName: 'SETHI BOOT HOUSE',
  tagline: 'All Kinds of Footwear for Gents, Ladies & Kids',
  address: 'Main Road, Near Bus Stand',
  city: 'Ratia',
  state: 'Haryana',
  pincode: '125051',
  phone: '+91 98960 12345',
  email: 'sethiboothouse.ratia@gmail.com',
  gstin: '06AAAFS1234B1Z9',
  panNumber: 'AAAFS1234B',
  bankName: 'Punjab National Bank, Ratia',
  bankAccountNumber: '0345002100018899',
  bankIfsc: 'PUNB0034500',
  upiId: '9896012345@pnb',
  invoicePrefix: 'SBH/26-27/',
  invoiceNextNumber: 1045,
  printFormat: 'thermal_80mm',
  loyaltyPointsPer100Rs: 1,
  loyaltyRedemptionRate: 1, // 1 point = 1 INR
  whatsappEnabled: true,
  whatsappApiKey: 'WA-DEMO-RATIA-SBH-2026',
  smsEnabled: false,
  negativeStockAllowed: false
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-campus-oxyfit',
    name: 'Campus OXYFIT Running Shoes',
    description: 'High-rebound breathable mesh sports running shoes with memory tech insole',
    brand: 'Campus',
    category: 'Sports Shoes',
    gender: 'Men',
    manufacturer: 'Campus Activewear Ltd, New Delhi',
    hsnCode: '6404',
    gstRate: 12,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
    status: 'active',
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-01-15T10:00:00Z',
    variants: [
      { id: 'var-oxy-blk-7', productId: 'prod-campus-oxyfit', sku: 'CAMP-OXY-BLK-7', barcode: '890123400701', size: '7', color: 'Black/Red', purchaseCost: 820, mrp: 1699, sellingPrice: 1399, stockQuantity: 8, reorderLevel: 3 },
      { id: 'var-oxy-blk-8', productId: 'prod-campus-oxyfit', sku: 'CAMP-OXY-BLK-8', barcode: '890123400702', size: '8', color: 'Black/Red', purchaseCost: 820, mrp: 1699, sellingPrice: 1399, stockQuantity: 12, reorderLevel: 4 },
      { id: 'var-oxy-blk-9', productId: 'prod-campus-oxyfit', sku: 'CAMP-OXY-BLK-9', barcode: '890123400703', size: '9', color: 'Black/Red', purchaseCost: 820, mrp: 1699, sellingPrice: 1399, stockQuantity: 6, reorderLevel: 3 },
      { id: 'var-oxy-blk-10', productId: 'prod-campus-oxyfit', sku: 'CAMP-OXY-BLK-10', barcode: '890123400704', size: '10', color: 'Black/Red', purchaseCost: 820, mrp: 1699, sellingPrice: 1399, stockQuantity: 2, reorderLevel: 3 }
    ]
  },
  {
    id: 'prod-sparx-sm734',
    name: 'Sparx SM-734 Casual Walking Shoes',
    description: 'Durable lightweight slip-on everyday sneakers with EVA sole',
    brand: 'Sparx',
    category: 'Casual Shoes',
    gender: 'Men',
    manufacturer: 'Relaxo Footwears Ltd, Delhi',
    hsnCode: '6404',
    gstRate: 5,
    imageUrl: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&auto=format&fit=crop&q=80',
    status: 'active',
    createdAt: '2026-01-16T11:00:00Z',
    updatedAt: '2026-01-16T11:00:00Z',
    variants: [
      { id: 'var-sm734-gry-6', productId: 'prod-sparx-sm734', sku: 'SPX-SM734-GRY-6', barcode: '890234500601', size: '6', color: 'Grey/Navy', purchaseCost: 540, mrp: 999, sellingPrice: 899, stockQuantity: 5, reorderLevel: 2 },
      { id: 'var-sm734-gry-7', productId: 'prod-sparx-sm734', sku: 'SPX-SM734-GRY-7', barcode: '890234500602', size: '7', color: 'Grey/Navy', purchaseCost: 540, mrp: 999, sellingPrice: 899, stockQuantity: 9, reorderLevel: 3 },
      { id: 'var-sm734-gry-8', productId: 'prod-sparx-sm734', sku: 'SPX-SM734-GRY-8', barcode: '890234500603', size: '8', color: 'Grey/Navy', purchaseCost: 540, mrp: 999, sellingPrice: 899, stockQuantity: 14, reorderLevel: 4 },
      { id: 'var-sm734-gry-9', productId: 'prod-sparx-sm734', sku: 'SPX-SM734-GRY-9', barcode: '890234500604', size: '9', color: 'Grey/Navy', purchaseCost: 540, mrp: 999, sellingPrice: 899, stockQuantity: 1, reorderLevel: 3 }
    ]
  },
  {
    id: 'prod-bata-formal',
    name: 'Bata Formal Derby Leather Shoes',
    description: 'Genuine leather executive dress shoes with cushioned footbed and anti-skid TPR sole',
    brand: 'Bata',
    category: 'Formal Shoes',
    gender: 'Men',
    manufacturer: 'Bata India Limited, Gurugram',
    hsnCode: '6403',
    gstRate: 12,
    imageUrl: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&auto=format&fit=crop&q=80',
    status: 'active',
    createdAt: '2026-01-20T12:00:00Z',
    updatedAt: '2026-01-20T12:00:00Z',
    variants: [
      { id: 'var-bata-der-tan-7', productId: 'prod-bata-formal', sku: 'BATA-DER-TAN-7', barcode: '890345600701', size: '7', color: 'Tan Brown', purchaseCost: 1150, mrp: 2499, sellingPrice: 2199, stockQuantity: 4, reorderLevel: 2 },
      { id: 'var-bata-der-tan-8', productId: 'prod-bata-formal', sku: 'BATA-DER-TAN-8', barcode: '890345600702', size: '8', color: 'Tan Brown', purchaseCost: 1150, mrp: 2499, sellingPrice: 2199, stockQuantity: 7, reorderLevel: 2 },
      { id: 'var-bata-der-tan-9', productId: 'prod-bata-formal', sku: 'BATA-DER-TAN-9', barcode: '890345600703', size: '9', color: 'Tan Brown', purchaseCost: 1150, mrp: 2499, sellingPrice: 2199, stockQuantity: 5, reorderLevel: 2 },
      { id: 'var-bata-der-blk-8', productId: 'prod-bata-formal', sku: 'BATA-DER-BLK-8', barcode: '890345600801', size: '8', color: 'Classic Black', purchaseCost: 1150, mrp: 2499, sellingPrice: 2199, stockQuantity: 6, reorderLevel: 2 }
    ]
  },
  {
    id: 'prod-redchief-boots',
    name: 'Red Chief Rough & Tough Rust Leather Boots',
    description: 'High-ankle heavy-duty genuine nubuck leather boots with deep traction cleated sole',
    brand: 'Red Chief',
    category: 'Boots',
    gender: 'Men',
    manufacturer: 'Leayan Global Pvt Ltd, Kanpur',
    hsnCode: '6403',
    gstRate: 12,
    imageUrl: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=600&auto=format&fit=crop&q=80',
    status: 'active',
    createdAt: '2026-02-01T09:00:00Z',
    updatedAt: '2026-02-01T09:00:00Z',
    variants: [
      { id: 'var-rc-rust-7', productId: 'prod-redchief-boots', sku: 'RC-RUST-7', barcode: '890456700701', size: '7', color: 'Rust Brown', purchaseCost: 2200, mrp: 4495, sellingPrice: 3899, stockQuantity: 3, reorderLevel: 2 },
      { id: 'var-rc-rust-8', productId: 'prod-redchief-boots', sku: 'RC-RUST-8', barcode: '890456700702', size: '8', color: 'Rust Brown', purchaseCost: 2200, mrp: 4495, sellingPrice: 3899, stockQuantity: 6, reorderLevel: 2 },
      { id: 'var-rc-rust-9', productId: 'prod-redchief-boots', sku: 'RC-RUST-9', barcode: '890456700703', size: '9', color: 'Rust Brown', purchaseCost: 2200, mrp: 4495, sellingPrice: 3899, stockQuantity: 4, reorderLevel: 2 }
    ]
  },
  {
    id: 'prod-relaxo-bahamas',
    name: 'Relaxo Bahamas Soft Comfort Flip-Flops',
    description: 'Waterproof printed soft rubber daily slippers for home and summer wear',
    brand: 'Relaxo',
    category: 'Slippers',
    gender: 'Unisex',
    manufacturer: 'Relaxo Footwears Ltd, Bahadurgarh',
    hsnCode: '6402',
    gstRate: 5,
    imageUrl: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=600&auto=format&fit=crop&q=80',
    status: 'active',
    createdAt: '2026-02-05T10:00:00Z',
    updatedAt: '2026-02-05T10:00:00Z',
    variants: [
      { id: 'var-bah-blu-6', productId: 'prod-relaxo-bahamas', sku: 'REL-BAH-BLU-6', barcode: '890567800601', size: '6', color: 'Royal Blue', purchaseCost: 110, mrp: 219, sellingPrice: 199, stockQuantity: 18, reorderLevel: 5 },
      { id: 'var-bah-blu-7', productId: 'prod-relaxo-bahamas', sku: 'REL-BAH-BLU-7', barcode: '890567800602', size: '7', color: 'Royal Blue', purchaseCost: 110, mrp: 219, sellingPrice: 199, stockQuantity: 24, reorderLevel: 6 },
      { id: 'var-bah-blu-8', productId: 'prod-relaxo-bahamas', sku: 'REL-BAH-BLU-8', barcode: '890567800603', size: '8', color: 'Royal Blue', purchaseCost: 110, mrp: 219, sellingPrice: 199, stockQuantity: 20, reorderLevel: 6 },
      { id: 'var-bah-blu-9', productId: 'prod-relaxo-bahamas', sku: 'REL-BAH-BLU-9', barcode: '890567800604', size: '9', color: 'Royal Blue', purchaseCost: 110, mrp: 219, sellingPrice: 199, stockQuantity: 15, reorderLevel: 5 }
    ]
  },
  {
    id: 'prod-action-school',
    name: 'Action Gola Black Velcro School Shoes',
    description: 'School uniform approved durable synthetic leather shoes with high-grip PVC sole',
    brand: 'Action',
    category: 'School Shoes',
    gender: 'Kids',
    manufacturer: 'Action Shoes, Delhi',
    hsnCode: '6402',
    gstRate: 5,
    imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=80',
    status: 'active',
    createdAt: '2026-02-10T10:00:00Z',
    updatedAt: '2026-02-10T10:00:00Z',
    variants: [
      { id: 'var-act-sch-3', productId: 'prod-action-school', sku: 'ACT-SCH-3', barcode: '890678900301', size: '3', color: 'All Black', purchaseCost: 260, mrp: 499, sellingPrice: 450, stockQuantity: 12, reorderLevel: 4 },
      { id: 'var-act-sch-4', productId: 'prod-action-school', sku: 'ACT-SCH-4', barcode: '890678900302', size: '4', color: 'All Black', purchaseCost: 280, mrp: 549, sellingPrice: 499, stockQuantity: 15, reorderLevel: 4 },
      { id: 'var-act-sch-5', productId: 'prod-action-school', sku: 'ACT-SCH-5', barcode: '890678900303', size: '5', color: 'All Black', purchaseCost: 310, mrp: 599, sellingPrice: 549, stockQuantity: 10, reorderLevel: 4 }
    ]
  },
  {
    id: 'prod-paragon-sandals',
    name: 'Paragon Soleplus Comfort Wedge Ladies Sandals',
    description: 'Ergonomic soft-cushion festive and daily wear ladies open-toe ethnic sandals',
    brand: 'Paragon',
    category: 'Sandals',
    gender: 'Women',
    manufacturer: 'Paragon Polymer Products, Kottayam',
    hsnCode: '6402',
    gstRate: 5,
    imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&auto=format&fit=crop&q=80',
    status: 'active',
    createdAt: '2026-02-12T10:00:00Z',
    updatedAt: '2026-02-12T10:00:00Z',
    variants: [
      { id: 'var-par-lad-5', productId: 'prod-paragon-sandals', sku: 'PAR-LAD-GOLD-5', barcode: '890789000501', size: '5', color: 'Rose Gold', purchaseCost: 380, mrp: 749, sellingPrice: 679, stockQuantity: 8, reorderLevel: 3 },
      { id: 'var-par-lad-6', productId: 'prod-paragon-sandals', sku: 'PAR-LAD-GOLD-6', barcode: '890789000502', size: '6', color: 'Rose Gold', purchaseCost: 380, mrp: 749, sellingPrice: 679, stockQuantity: 11, reorderLevel: 3 },
      { id: 'var-par-lad-7', productId: 'prod-paragon-sandals', sku: 'PAR-LAD-GOLD-7', barcode: '890789000503', size: '7', color: 'Rose Gold', purchaseCost: 380, mrp: 749, sellingPrice: 679, stockQuantity: 9, reorderLevel: 3 }
    ]
  },
  {
    id: 'prod-nike-court-vision',
    name: 'Nike Court Vision Low',
    description: 'Crisp leather low-top basketball-inspired retro sneakers with classic vulcanised cupsole and perforated toe box.',
    brand: 'Nike',
    category: 'Sneakers',
    gender: 'Men',
    manufacturer: 'Nike India Pvt Ltd, Bangalore',
    hsnCode: '6404',
    gstRate: 12,
    imageUrl: '/assets/aistudio/prod_nike_court.png',
    status: 'active',
    createdAt: '2026-02-15T10:00:00Z',
    updatedAt: '2026-02-15T10:00:00Z',
    variants: [
      { id: 'var-nike-cvl-wht-7', productId: 'prod-nike-court-vision', sku: 'NIKE-CVL-WHT-7', barcode: '890890100701', size: '7', color: 'White / Black', purchaseCost: 3200, mrp: 5499, sellingPrice: 4299, stockQuantity: 6, reorderLevel: 2 },
      { id: 'var-nike-cvl-wht-8', productId: 'prod-nike-court-vision', sku: 'NIKE-CVL-WHT-8', barcode: '890890100702', size: '8', color: 'White / Black', purchaseCost: 3200, mrp: 5499, sellingPrice: 4299, stockQuantity: 10, reorderLevel: 3 },
      { id: 'var-nike-cvl-wht-9', productId: 'prod-nike-court-vision', sku: 'NIKE-CVL-WHT-9', barcode: '890890100703', size: '9', color: 'White / Black', purchaseCost: 3200, mrp: 5499, sellingPrice: 4299, stockQuantity: 8, reorderLevel: 3 },
      { id: 'var-nike-cvl-wht-10', productId: 'prod-nike-court-vision', sku: 'NIKE-CVL-WHT-10', barcode: '890890100704', size: '10', color: 'White / Black', purchaseCost: 3200, mrp: 5499, sellingPrice: 4299, stockQuantity: 4, reorderLevel: 2 }
    ]
  },
  {
    id: 'prod-adidas-grand-court',
    name: 'Adidas Grand Court',
    description: 'Timeless court silhouette with Cloudfoam Comfort sockliner and signature contrast 3-Stripes branding.',
    brand: 'Adidas',
    category: 'Casual Shoes',
    gender: 'Unisex',
    manufacturer: 'Adidas India Marketing Pvt Ltd, Gurugram',
    hsnCode: '6404',
    gstRate: 12,
    imageUrl: '/assets/aistudio/prod_adidas_gc.png',
    status: 'active',
    createdAt: '2026-02-16T10:00:00Z',
    updatedAt: '2026-02-16T10:00:00Z',
    variants: [
      { id: 'var-adi-gc-blk-7', productId: 'prod-adidas-grand-court', sku: 'ADI-GC-BLK-7', barcode: '890901200701', size: '7', color: 'Cloud White / Black', purchaseCost: 2400, mrp: 4999, sellingPrice: 3499, stockQuantity: 7, reorderLevel: 2 },
      { id: 'var-adi-gc-blk-8', productId: 'prod-adidas-grand-court', sku: 'ADI-GC-BLK-8', barcode: '890901200702', size: '8', color: 'Cloud White / Black', purchaseCost: 2400, mrp: 4999, sellingPrice: 3499, stockQuantity: 12, reorderLevel: 3 },
      { id: 'var-adi-gc-blk-9', productId: 'prod-adidas-grand-court', sku: 'ADI-GC-BLK-9', barcode: '890901200703', size: '9', color: 'Cloud White / Black', purchaseCost: 2400, mrp: 4999, sellingPrice: 3499, stockQuantity: 9, reorderLevel: 3 }
    ]
  },
  {
    id: 'prod-puma-electrify-nitro',
    name: 'Puma Electrify Nitro',
    description: 'Advanced dual-density NITRO FOAM cushioning with engineered breathable mesh and high-traction PUMAGRIP rubber outsole.',
    brand: 'Puma',
    category: 'Sports Shoes',
    gender: 'Men',
    manufacturer: 'Puma Sports India Pvt Ltd, Bangalore',
    hsnCode: '6404',
    gstRate: 12,
    imageUrl: '/assets/aistudio/prod_puma_nitro.png',
    status: 'active',
    createdAt: '2026-02-18T10:00:00Z',
    updatedAt: '2026-02-18T10:00:00Z',
    variants: [
      { id: 'var-puma-en-org-7', productId: 'prod-puma-electrify-nitro', sku: 'PUMA-EN3-ORG-7', barcode: '890112300701', size: '7', color: 'Black / White', purchaseCost: 2700, mrp: 5299, sellingPrice: 3999, stockQuantity: 5, reorderLevel: 2 },
      { id: 'var-puma-en-org-8', productId: 'prod-puma-electrify-nitro', sku: 'PUMA-EN3-ORG-8', barcode: '890112300702', size: '8', color: 'Black / White', purchaseCost: 2700, mrp: 5299, sellingPrice: 3999, stockQuantity: 8, reorderLevel: 2 },
      { id: 'var-puma-en-org-9', productId: 'prod-puma-electrify-nitro', sku: 'PUMA-EN3-ORG-9', barcode: '890112300703', size: '9', color: 'Black / White', purchaseCost: 2700, mrp: 5299, sellingPrice: 3999, stockQuantity: 7, reorderLevel: 2 }
    ]
  },
  {
    id: 'prod-skechers-gowalk6',
    name: 'Skechers Go Walk 6',
    description: 'Ultra-lightweight responsive ULTRA GO cushioning with Hyper Pillar Technology and Air-Cooled Goga Mat insole.',
    brand: 'Skechers',
    category: 'Casual Shoes',
    gender: 'Men',
    manufacturer: 'Skechers South Asia Pvt Ltd, Mumbai',
    hsnCode: '6404',
    gstRate: 12,
    imageUrl: '/assets/aistudio/prod_skechers_gw6.png',
    status: 'active',
    createdAt: '2026-02-20T10:00:00Z',
    updatedAt: '2026-02-20T10:00:00Z',
    variants: [
      { id: 'var-skc-gw6-nvy-7', productId: 'prod-skechers-gowalk6', sku: 'SKC-GW6-NVY-7', barcode: '890223400701', size: '7', color: 'Navy Blue', purchaseCost: 3200, mrp: 5999, sellingPrice: 4799, stockQuantity: 6, reorderLevel: 2 },
      { id: 'var-skc-gw6-nvy-8', productId: 'prod-skechers-gowalk6', sku: 'SKC-GW6-NVY-8', barcode: '890223400702', size: '8', color: 'Navy Blue', purchaseCost: 3200, mrp: 5999, sellingPrice: 4799, stockQuantity: 11, reorderLevel: 3 },
      { id: 'var-skc-gw6-nvy-9', productId: 'prod-skechers-gowalk6', sku: 'SKC-GW6-NVY-9', barcode: '890223400703', size: '9', color: 'Navy Blue', purchaseCost: 3200, mrp: 5999, sellingPrice: 4799, stockQuantity: 8, reorderLevel: 2 }
    ]
  },
  {
    id: 'prod-reebok-floatride',
    name: 'Reebok Floatride Energy Daily',
    description: 'Responsive lightweight daily running shoe with Floatride Energy Foam and breathable engineered ripstop mesh.',
    brand: 'Reebok',
    category: 'Sports Shoes',
    gender: 'Men',
    manufacturer: 'Reebok India, Gurugram',
    hsnCode: '6404',
    gstRate: 12,
    imageUrl: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=800&auto=format&fit=crop&q=80',
    status: 'active',
    createdAt: '2026-02-22T10:00:00Z',
    updatedAt: '2026-02-22T10:00:00Z',
    variants: [
      { id: 'var-rbk-flt-blk-8', productId: 'prod-reebok-floatride', sku: 'RBK-FLT-BLK-8', barcode: '890334500801', size: '8', color: 'Core Black / Solar Acid', purchaseCost: 3600, mrp: 6599, sellingPrice: 5199, stockQuantity: 9, reorderLevel: 2 },
      { id: 'var-rbk-flt-blk-9', productId: 'prod-reebok-floatride', sku: 'RBK-FLT-BLK-9', barcode: '890334500802', size: '9', color: 'Core Black / Solar Acid', purchaseCost: 3600, mrp: 6599, sellingPrice: 5199, stockQuantity: 6, reorderLevel: 2 }
    ]
  },
  {
    id: 'prod-woodland-boots',
    name: 'Woodland Khaki Leather Trekking Boots',
    description: 'Rugged water-resistant nubuck leather hiking boots with heavy lugged rubber outsole and shock-absorbing collar.',
    brand: 'Woodland',
    category: 'Boots',
    gender: 'Men',
    manufacturer: 'Aero Club Woodland, New Delhi',
    hsnCode: '6403',
    gstRate: 12,
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80',
    status: 'active',
    createdAt: '2026-02-25T10:00:00Z',
    updatedAt: '2026-02-25T10:00:00Z',
    variants: [
      { id: 'var-wdl-khk-7', productId: 'prod-woodland-boots', sku: 'WDL-KHK-7', barcode: '890445600701', size: '7', color: 'Khaki Olive', purchaseCost: 2600, mrp: 4995, sellingPrice: 4299, stockQuantity: 5, reorderLevel: 2 },
      { id: 'var-wdl-khk-8', productId: 'prod-woodland-boots', sku: 'WDL-KHK-8', barcode: '890445600702', size: '8', color: 'Khaki Olive', purchaseCost: 2600, mrp: 4995, sellingPrice: 4299, stockQuantity: 8, reorderLevel: 2 },
      { id: 'var-wdl-khk-9', productId: 'prod-woodland-boots', sku: 'WDL-KHK-9', barcode: '890445600703', size: '9', color: 'Khaki Olive', purchaseCost: 2600, mrp: 4995, sellingPrice: 4299, stockQuantity: 4, reorderLevel: 2 }
    ]
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-baldev-1',
    name: 'S. Baldev Singh Dhillon',
    phone: '9896123456',
    whatsapp: '9896123456',
    email: 'baldev.dhillon@yahoo.com',
    address: 'Near Old Anaj Mandi, Tohana Road',
    city: 'Ratia',
    state: 'Haryana',
    pincode: '125051',
    birthday: '1978-04-14',
    gender: 'Male',
    customerType: 'VIP',
    preferredBrands: ['Red Chief', 'Bata'],
    preferredSizes: ['8', '9'],
    outstandingBalance: 0,
    loyaltyPoints: 340,
    totalPurchasesCount: 8,
    totalSpent: 18450,
    notes: 'Regular family buyer for sports & formal shoes',
    createdAt: '2025-06-12T09:00:00Z'
  },
  {
    id: 'cust-jagdish-2',
    name: 'Jagdish Chander Mittal',
    phone: '9416045678',
    whatsapp: '9416045678',
    address: 'Shop No 14, Grain Market',
    city: 'Ratia',
    state: 'Haryana',
    pincode: '125051',
    customerType: 'Regular',
    preferredBrands: ['Campus', 'Sparx'],
    preferredSizes: ['7', '8'],
    outstandingBalance: 1200,
    loyaltyPoints: 115,
    totalPurchasesCount: 5,
    totalSpent: 9600,
    notes: 'Khata account customer. Clears balance at month-end',
    createdAt: '2025-08-20T11:00:00Z'
  },
  {
    id: 'cust-meenakshi-3',
    name: 'Meenakshi Rani',
    phone: '9812034567',
    whatsapp: '9812034567',
    address: 'Model Town, Near DAV School',
    city: 'Ratia',
    state: 'Haryana',
    pincode: '125051',
    birthday: '1989-11-22',
    gender: 'Female',
    customerType: 'Regular',
    preferredBrands: ['Paragon', 'Bata'],
    preferredSizes: ['5', '6'],
    outstandingBalance: 0,
    loyaltyPoints: 85,
    totalPurchasesCount: 3,
    totalSpent: 3950,
    notes: 'Buys school shoes for kids and comfort sandals',
    createdAt: '2025-09-05T14:30:00Z'
  },
  {
    id: 'cust-sandeep-4',
    name: 'Sandeep Kumar Bishnoi',
    phone: '7015098765',
    whatsapp: '7015098765',
    address: 'Village Alawalpur, Tehsil Ratia',
    city: 'Ratia',
    state: 'Haryana',
    pincode: '125051',
    customerType: 'Regular',
    preferredBrands: ['Sparx', 'Campus'],
    preferredSizes: ['8', '9'],
    outstandingBalance: 0,
    loyaltyPoints: 140,
    totalPurchasesCount: 4,
    totalSpent: 6200,
    notes: 'Young athlete, prefers running and gym footwear',
    createdAt: '2025-11-10T16:00:00Z'
  }
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'sup-haryana-dist',
    name: 'Haryana Footwear Agency',
    companyName: 'Haryana Footwear Distributors Pvt Ltd',
    contactPerson: 'Sunil Goyal',
    phone: '+91 98120 44556',
    email: 'haryanafootwear.hisar@gmail.com',
    address: 'Rohtak Road, Opposite New Bus Stand',
    city: 'Hisar',
    state: 'Haryana',
    gstin: '06AABCH8899K1Z4',
    paymentTerms: '30 Days Credit',
    openingBalance: 0,
    outstandingBalance: 24500,
    totalPurchases: 182000,
    createdAt: '2025-04-01T10:00:00Z'
  },
  {
    id: 'sup-sadar-delhi',
    name: 'Aggarwal Footwear Company',
    companyName: 'Aggarwal Shoe Traders Delhi',
    contactPerson: 'Mukesh Aggarwal',
    phone: '+91 98110 33221',
    email: 'aggarwal.sadarbazar@gmail.com',
    address: 'Shop 42, Footwear Market, Sadar Bazar',
    city: 'Delhi',
    state: 'Delhi',
    gstin: '07AAACA1234D1ZF',
    paymentTerms: 'Immediate or 15 days',
    openingBalance: 0,
    outstandingBalance: 12800,
    totalPurchases: 240000,
    createdAt: '2025-04-10T11:00:00Z'
  },
  {
    id: 'sup-sirsa-wholesalers',
    name: 'Shri Shyam Footwear',
    companyName: 'Shri Shyam Footwear Wholesalers',
    contactPerson: 'Pawan Sharma',
    phone: '+91 94165 77889',
    email: 'shyamfootwear.sirsa@gmail.com',
    address: 'Cinema Road',
    city: 'Sirsa',
    state: 'Haryana',
    gstin: '06AAXPS9876C1Z2',
    paymentTerms: 'Weekly Clearing',
    openingBalance: 0,
    outstandingBalance: 0,
    totalPurchases: 94000,
    createdAt: '2025-05-15T12:00:00Z'
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-1044',
    invoiceNumber: 'SBH/26-27/1044',
    invoiceType: 'gst_tax_invoice',
    status: 'completed',
    date: '2026-11-04T07:30:00Z',
    customerId: 'cust-baldev-1',
    customerName: 'S. Baldev Singh Dhillon',
    customerPhone: '9896123456',
    customerAddress: 'Tohana Road, Ratia',
    items: [
      {
        id: 'item-1044-1',
        productId: 'prod-campus-oxyfit',
        variantId: 'var-oxy-blk-8',
        productName: 'Campus OXYFIT Running Shoes',
        brand: 'Campus',
        size: '8',
        color: 'Black/Red',
        sku: 'CAMP-OXY-BLK-8',
        barcode: '890123400702',
        hsnCode: '6404',
        quantity: 1,
        mrp: 1699,
        rate: 1399,
        discountPercent: 7.08,
        discountAmount: 99,
        taxableValue: 1160.71,
        gstRate: 12,
        cgstAmount: 69.64,
        sgstAmount: 69.64,
        igstAmount: 0,
        total: 1300
      }
    ],
    subtotal: 1399,
    discountTotal: 99,
    taxableTotal: 1160.71,
    cgstTotal: 69.64,
    sgstTotal: 69.64,
    igstTotal: 0,
    roundOff: 0.01,
    grandTotal: 1300,
    payments: [
      { method: 'upi', amount: 1300, reference: 'UPI-9896012-789' }
    ],
    channel: 'pos',
    cashierName: 'Gurpreet Singh',
    notes: 'Sold at store counter',
    createdAt: '2026-11-04T07:30:00Z'
  },
  {
    id: 'inv-1043',
    invoiceNumber: 'SBH/26-27/1043',
    invoiceType: 'gst_tax_invoice',
    status: 'completed',
    date: '2026-11-03T16:15:00Z',
    customerId: 'cust-jagdish-2',
    customerName: 'Jagdish Chander Mittal',
    customerPhone: '9416045678',
    customerAddress: 'Grain Market, Ratia',
    items: [
      {
        id: 'item-1043-1',
        productId: 'prod-sparx-sm734',
        variantId: 'var-sm734-gry-8',
        productName: 'Sparx SM-734 Casual Walking Shoes',
        brand: 'Sparx',
        size: '8',
        color: 'Grey/Navy',
        sku: 'SPX-SM734-GRY-8',
        barcode: '890234500603',
        hsnCode: '6404',
        quantity: 1,
        mrp: 999,
        rate: 899,
        discountPercent: 0,
        discountAmount: 0,
        taxableValue: 856.19,
        gstRate: 5,
        cgstAmount: 21.40,
        sgstAmount: 21.40,
        igstAmount: 0,
        total: 899
      }
    ],
    subtotal: 899,
    discountTotal: 0,
    taxableTotal: 856.19,
    cgstTotal: 21.40,
    sgstTotal: 21.40,
    igstTotal: 0,
    roundOff: 0.01,
    grandTotal: 899,
    payments: [
      { method: 'cash', amount: 899 }
    ],
    cashTendered: 1000,
    changeDue: 101,
    channel: 'pos',
    cashierName: 'Jonny Sethi',
    createdAt: '2026-11-03T16:15:00Z'
  }
];

export const INITIAL_EXPENSES: Expense[] = [
  {
    id: 'exp-1',
    voucherNumber: 'EXP-2026-081',
    category: 'Electricity',
    amount: 3450,
    paymentMethod: 'upi',
    paidTo: 'DHBVN Haryana Electricity',
    date: '2026-11-02',
    description: 'Store electricity bill for October 2026',
    recordedBy: 'Ramesh Bansal'
  },
  {
    id: 'exp-2',
    voucherNumber: 'EXP-2026-082',
    category: 'Packaging & Bags',
    amount: 1200,
    paymentMethod: 'cash',
    paidTo: 'Ratia Plastic & Carry Bags',
    date: '2026-11-03',
    description: '500 Printed cloth carry bags with Sethi Boot House logo',
    recordedBy: 'Gurpreet Singh'
  },
  {
    id: 'exp-3',
    voucherNumber: 'EXP-2026-083',
    category: 'Tea & Refreshments',
    amount: 150,
    paymentMethod: 'cash',
    paidTo: 'Sharma Tea Stall Ratia',
    date: '2026-11-04',
    description: 'Daily staff tea and customer refreshments',
    recordedBy: 'Gurpreet Singh'
  }
];

export const INITIAL_ONLINE_ORDERS: OnlineOrder[] = [
  {
    id: 'ord-on-101',
    orderNumber: 'ORD-ON-101',
    customerName: 'Navjot Singh',
    phone: '9872154321',
    shippingAddress: 'House 84, Urban Estate, Phase 2',
    city: 'Fatehabad',
    state: 'Haryana',
    pincode: '125050',
    items: [
      {
        productId: 'prod-campus-oxyfit',
        variantId: 'var-oxy-blk-9',
        productName: 'Campus OXYFIT Running Shoes',
        size: '9',
        color: 'Black/Red',
        quantity: 1,
        price: 1399,
        total: 1399
      }
    ],
    totalAmount: 1399,
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    status: 'new',
    createdAt: '2026-11-04T06:15:00Z'
  }
];

export const INITIAL_MOVEMENTS: InventoryMovement[] = [
  {
    id: 'mov-1',
    productId: 'prod-campus-oxyfit',
    variantId: 'var-oxy-blk-8',
    productName: 'Campus OXYFIT Running Shoes',
    variantDetails: 'Size 8 - Black/Red',
    quantity: -1,
    previousStock: 13,
    newStock: 12,
    movementType: 'sale',
    referenceId: 'SBH/26-27/1044',
    reason: 'POS Counter Sale to Baldev Singh',
    userName: 'Gurpreet Singh',
    createdAt: '2026-11-04T07:30:00Z'
  },
  {
    id: 'mov-2',
    productId: 'prod-sparx-sm734',
    variantId: 'var-sm734-gry-8',
    productName: 'Sparx SM-734 Casual Walking Shoes',
    variantDetails: 'Size 8 - Grey/Navy',
    quantity: -1,
    previousStock: 15,
    newStock: 14,
    movementType: 'sale',
    referenceId: 'SBH/26-27/1043',
    reason: 'POS Counter Sale to Jagdish Chander',
    userName: 'Kuldeep Sethi',
    createdAt: '2026-11-03T16:15:00Z'
  }
];

export const INITIAL_CUSTOMER_LEDGER: CustomerLedgerEntry[] = [
  {
    id: 'cled-1',
    customerId: 'cust-jagdish-2',
    date: '2026-10-25',
    description: 'Credit Sale of Bata Shoes - Inv SBH-992',
    referenceType: 'sale',
    referenceId: 'SBH/26-27/0992',
    debit: 2199,
    credit: 0,
    balance: 2199
  },
  {
    id: 'cled-2',
    customerId: 'cust-jagdish-2',
    date: '2026-10-30',
    description: 'Cash payment received on Khata account',
    referenceType: 'payment_received',
    referenceId: 'RCP-542',
    debit: 0,
    credit: 999,
    balance: 1200
  }
];

export const INITIAL_SUPPLIER_LEDGER: SupplierLedgerEntry[] = [
  {
    id: 'sled-1',
    supplierId: 'sup-haryana-dist',
    date: '2026-10-15',
    description: 'Goods Received - Invoice HFD-4421 (Campus & Sparx lot)',
    referenceType: 'purchase',
    referenceId: 'PO-2026-039',
    debit: 0,
    credit: 54500,
    balance: 54500
  },
  {
    id: 'sled-2',
    supplierId: 'sup-haryana-dist',
    date: '2026-10-28',
    description: 'RTGS Bank Payment from PNB Ratia Account',
    referenceType: 'payment_made',
    referenceId: 'PMT-904',
    debit: 30000,
    credit: 0,
    balance: 24500
  }
];
