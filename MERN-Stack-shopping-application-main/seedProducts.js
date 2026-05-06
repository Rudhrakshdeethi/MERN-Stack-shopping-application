/**
 * seedProducts.js
 * Run: node seedProducts.js
 * Optional: node seedProducts.js --replace
 */

try {
  require('dotenv').config();
} catch (error) {
  // dotenv is optional here; the script still works with the built-in fallback URI.
}

require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const Shopproduct = require('./models/Shopproduct');


const MONGO_URI = process.env.MONGODB_URI;

const products = [
  {
    title: 'Apple iPhone 15 (128GB) - Black',
    category: 'Smartphone',
    brand: 'Apple',
    description: 'Dynamic Island, 48MP main camera, USB-C, A16 Bionic chip. The most advanced iPhone yet.',
    features: [
      '6.1-inch Super Retina XDR display with Dynamic Island',
      '48MP Main | 12MP Ultra Wide | 12MP TrueDepth front camera',
      'A16 Bionic chip - fastest chip ever in a smartphone',
      'USB-C connectivity for universal compatibility',
      'Up to 26 hours video playback',
      'Ceramic Shield front, colour-infused glass back'
    ],
    price: 79900,
    imageSrc: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&q=80',
    imagename: 'iphone15-black.jpg',
    rating: 4.7,
    reviews: 18423,
    stock: 'In stock',
    delivery: 'FREE delivery by Tomorrow'
  },
  {
    title: 'Samsung Galaxy S24 Ultra (256GB) - Titanium Gray',
    category: 'Smartphone',
    brand: 'Samsung',
    description: 'Built-in S Pen, 200MP camera, Snapdragon 8 Gen 3, Galaxy AI features.',
    features: [
      '6.8-inch QHD+ Dynamic AMOLED 2X, 120Hz',
      '200MP Wide + 50MP Periscope Telephoto (5x optical)',
      'Snapdragon 8 Gen 3 processor',
      'Built-in S Pen with AI-powered note features',
      '5000mAh battery with 45W wired charging',
      'Titanium armour frame, Gorilla Glass Armor'
    ],
    price: 124999,
    imageSrc: 'https://images.unsplash.com/photo-1706533293679-f4e01da1e6cb?w=600&q=80',
    imagename: 'galaxy-s24-ultra.jpg',
    rating: 4.6,
    reviews: 9871,
    stock: 'In stock',
    delivery: 'FREE delivery by Tomorrow'
  },
  {
    title: 'OnePlus 12 (256GB) - Flowy Emerald',
    category: 'Smartphone',
    brand: 'OnePlus',
    description: 'Snapdragon 8 Gen 3, Hasselblad cameras, 100W SUPERVOOC charging.',
    features: [
      '6.82-inch LTPO AMOLED, 1-120Hz ProXDR',
      'Triple Hasselblad camera - 50MP + 64MP + 48MP',
      'Snapdragon 8 Gen 3 with 16GB LPDDR5X RAM',
      '100W SUPERVOOC wired + 50W AIRVOOC wireless charging',
      '5400mAh silicon-carbon battery',
      'OxygenOS 14 based on Android 14'
    ],
    price: 64999,
    imageSrc: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=600&q=80',
    imagename: 'oneplus12-emerald.jpg',
    rating: 4.5,
    reviews: 4302,
    stock: 'In stock',
    delivery: 'FREE delivery by Tomorrow'
  },
  {
    title: 'Redmi Note 13 Pro+ (256GB) - Aurora Purple',
    category: 'Smartphone',
    brand: 'Xiaomi',
    description: 'World\'s first 200MP flagship mid-ranger with 120W HyperCharge.',
    features: [
      '6.67-inch AMOLED CrystalRes, 1.5K, 120Hz',
      '200MP OIS main camera + 8MP ultrawide + 2MP macro',
      'Dimensity 7200 Ultra processor',
      '120W HyperCharge - 0 to 100% in 19 minutes',
      '5000mAh battery',
      'IP68 dust and water resistance'
    ],
    price: 31999,
    imageSrc: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80',
    imagename: 'redmi-note13-pro-plus.jpg',
    rating: 4.4,
    reviews: 7610,
    stock: 'In stock',
    delivery: 'FREE delivery by Tomorrow'
  },
  {
    title: 'Google Pixel 8 Pro (128GB) - Bay',
    category: 'Smartphone',
    brand: 'Google',
    description: 'Google Tensor G3, best-in-class AI photography, 7 years of OS updates.',
    features: [
      '6.7-inch LTPO OLED, 1-120Hz, 2992x1344',
      '50MP main + 48MP ultrawide + 48MP 5x telephoto',
      'Google Tensor G3 chip with Titan M2 security',
      'Temperature sensor, Magic Eraser, Photo Unblur',
      '5050mAh battery, 30W wired / 23W wireless',
      '7 years guaranteed Android and security updates'
    ],
    price: 106999,
    imageSrc: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=80',
    imagename: 'pixel8-pro-bay.jpg',
    rating: 4.5,
    reviews: 3218,
    stock: 'In stock',
    delivery: 'FREE delivery by Tomorrow'
  },
  {
    title: 'Apple MacBook Air M3 (8GB / 256GB) - Midnight',
    category: 'Laptop',
    brand: 'Apple',
    description: 'Fanless, all-day battery, blazing M3 chip - the world\'s best thin-and-light laptop.',
    features: [
      '13.6-inch Liquid Retina display, 500 nits',
      'Apple M3 chip - 8-core CPU, 10-core GPU',
      '18-hour battery life',
      'MagSafe 3 charging + 2x Thunderbolt / USB 4',
      'Fanless design - completely silent',
      'macOS Sonoma'
    ],
    price: 114900,
    imageSrc: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80',
    imagename: 'macbook-air-m3-midnight.jpg',
    rating: 4.8,
    reviews: 11230,
    stock: 'In stock',
    delivery: 'FREE delivery by Tomorrow'
  },
  {
    title: 'Dell XPS 15 (i7-13700H / 16GB / 512GB) - Platinum',
    category: 'Laptop',
    brand: 'Dell',
    description: 'OLED touch display, RTX 4060 GPU, creator-grade performance in a slim chassis.',
    features: [
      '15.6-inch 3.5K OLED touchscreen, 60Hz, DCI-P3 100%',
      'Intel Core i7-13700H, up to 5.0GHz',
      'NVIDIA GeForce RTX 4060 8GB GDDR6',
      '16GB DDR5 RAM, 512GB PCIe Gen 4 SSD',
      'Thunderbolt 4, SD card reader, WiFi 6E',
      'Windows 11 Home'
    ],
    price: 159990,
    imageSrc: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80',
    imagename: 'dell-xps15-platinum.jpg',
    rating: 4.5,
    reviews: 2890,
    stock: 'In stock',
    delivery: 'FREE delivery within 2 days'
  },
  {
    title: 'ASUS ROG Strix G16 (Ryzen 9 / 32GB / 1TB) - Eclipse Gray',
    category: 'Laptop',
    brand: 'ASUS',
    description: 'AMD Ryzen 9 + RTX 4070 - elite gaming performance with 240Hz display.',
    features: [
      '16-inch QHD+ IPS, 240Hz, 3ms, MUX Switch',
      'AMD Ryzen 9 7945HX, up to 5.4GHz',
      'NVIDIA GeForce RTX 4070 8GB GDDR6',
      '32GB DDR5 4800MHz RAM, 1TB PCIe Gen 4 SSD',
      'ROG Intelligent Cooling with liquid metal TIM',
      'Per-key RGB keyboard, WiFi 6E, Thunderbolt 4'
    ],
    price: 179990,
    imageSrc: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&q=80',
    imagename: 'asus-rog-strix-g16.jpg',
    rating: 4.6,
    reviews: 1543,
    stock: 'In stock',
    delivery: 'FREE delivery within 2 days'
  },
  {
    title: 'Lenovo ThinkPad X1 Carbon Gen 11 (i7 / 16GB / 512GB)',
    category: 'Laptop',
    brand: 'Lenovo',
    description: 'Ultra-light business powerhouse - 1.12 kg, MIL-SPEC durability, 15-hour battery.',
    features: [
      '14-inch IPS Anti-glare, 2.8K OLED optional',
      'Intel Core i7-1365U vPro, up to 5.2GHz',
      '16GB LPDDR5 RAM, 512GB PCIe Gen 4 SSD',
      'Weighs just 1.12 kg, MIL-STD-810H tested',
      'Fingerprint reader + IR face unlock',
      'Intel Evo platform certified, WiFi 6E'
    ],
    price: 154990,
    imageSrc: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80',
    imagename: 'thinkpad-x1-carbon.jpg',
    rating: 4.7,
    reviews: 876,
    stock: 'In stock',
    delivery: 'FREE delivery within 2 days'
  },
  {
    title: 'HP Pavilion 15 (i5-1335U / 16GB / 512GB) - Silver',
    category: 'Laptop',
    brand: 'HP',
    description: 'Everyday performance laptop with FHD IPS display and fast SSD at an unbeatable price.',
    features: [
      '15.6-inch FHD IPS anti-glare, 250 nits',
      'Intel Core i5-1335U, up to 4.6GHz',
      '16GB DDR4 RAM, 512GB PCIe NVMe SSD',
      'Intel Iris Xe integrated graphics',
      'HD webcam, WiFi 6, Bluetooth 5.3',
      'Windows 11 Home, MS Office 2021'
    ],
    price: 59990,
    imageSrc: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&q=80',
    imagename: 'hp-pavilion15-silver.jpg',
    rating: 4.2,
    reviews: 5420,
    stock: 'In stock',
    delivery: 'FREE delivery by Tomorrow'
  },
  {
    title: 'Sony WH-1000XM5 Wireless Noise-Cancelling Headphones - Black',
    category: 'Audio',
    brand: 'Sony',
    description: 'Industry-leading ANC, 30-hour battery, crystal-clear call quality with 8 mics.',
    features: [
      'Industry-leading noise cancellation via Integrated Processor V1',
      '30-hour battery, 3-minute quick charge = 3 hours playback',
      '8 microphones with AI-based noise rejection for calls',
      'Multipoint connection - simultaneously pair to 2 devices',
      'LDAC, DSEE Extreme upscaling, 360 Reality Audio',
      'Comfortable over-ear design - 20% lighter than XM4'
    ],
    price: 26990,
    imageSrc: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
    imagename: 'sony-wh1000xm5-black.jpg',
    rating: 4.8,
    reviews: 34120,
    stock: 'In stock',
    delivery: 'FREE delivery by Tomorrow'
  },
  {
    title: 'Apple AirPods Pro (2nd Gen) with MagSafe Case',
    category: 'Audio',
    brand: 'Apple',
    description: 'H2 chip, Adaptive Transparency, 2x more ANC than AirPods Pro 1st gen.',
    features: [
      'Active Noise Cancellation - 2x more powerful than previous gen',
      'Adaptive Transparency lets outside sounds in naturally',
      'Personalised Spatial Audio with dynamic head tracking',
      '6 hours ANC playback | 30 hours with MagSafe case',
      'IPX4 sweat and water resistant',
      'Touch control, Siri hands-free, Find My'
    ],
    price: 24900,
    imageSrc: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&q=80',
    imagename: 'airpods-pro-2nd-gen.jpg',
    rating: 4.7,
    reviews: 28750,
    stock: 'In stock',
    delivery: 'FREE delivery by Tomorrow'
  },
  {
    title: 'Bose QuietComfort Ultra Earbuds - Moonstone Blue',
    category: 'Audio',
    brand: 'Bose',
    description: 'World-class noise cancellation with immersive Bose Immersive Audio technology.',
    features: [
      'CustomTune technology - real-time mic personalisation',
      'Bose Immersive Audio - spatial sound from any content',
      '6 hours ANC playback | 24 hours with case',
      'OpenAudio and Quiet Mode settings',
      'IPX4 sweat resistant, silicone ear tips (3 sizes)',
      'Bluetooth 5.3, multipoint, USB-C charging'
    ],
    price: 31990,
    imageSrc: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80',
    imagename: 'bose-qc-ultra-earbuds.jpg',
    rating: 4.6,
    reviews: 4312,
    stock: 'In stock',
    delivery: 'FREE delivery by Tomorrow'
  },
  {
    title: 'JBL Charge 5 Portable Bluetooth Speaker - Red',
    category: 'Audio',
    brand: 'JBL',
    description: 'Powerful sound, IP67 waterproof, built-in powerbank - the go-anywhere speaker.',
    features: [
      'JBL Pro Sound - deep bass with separate tweeter',
      'IP67 waterproof and dustproof',
      '20 hours playtime on a single charge',
      'Built-in USB-A powerbank to charge devices',
      'Bluetooth 5.1, PartyBoost to link multiple JBL speakers',
      'Eco-friendly recycled materials'
    ],
    price: 13999,
    imageSrc: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80',
    imagename: 'jbl-charge5-red.jpg',
    rating: 4.5,
    reviews: 19840,
    stock: 'In stock',
    delivery: 'FREE delivery by Tomorrow'
  },
  {
    title: 'boAt Rockerz 450 Bluetooth Headphones - Luscious Black',
    category: 'Audio',
    brand: 'boAt',
    description: 'Superior bass, 15-hour playback, foldable design - built for the everyday Indian listener.',
    features: [
      '40mm dynamic drivers with immersive bass',
      '15 hours wireless playback',
      'Dual connectivity - Bluetooth 5.0 + 3.5mm AUX',
      'Foldable design with padded ear cushions',
      'Integrated controls and mic for calls',
      'Fast charging - 10 min charge = 2 hours playback'
    ],
    price: 1499,
    imageSrc: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&q=80',
    imagename: 'boat-rockerz450-black.jpg',
    rating: 4.1,
    reviews: 87450,
    stock: 'In stock',
    delivery: 'FREE delivery by Tomorrow'
  },
  {
    title: 'Apple iPad Pro 12.9-inch M2 (128GB Wi-Fi) - Space Gray',
    category: 'Tablet',
    brand: 'Apple',
    description: 'Liquid Retina XDR display, M2 chip, Apple Pencil hover - the ultimate iPad.',
    features: [
      '12.9-inch Liquid Retina XDR with ProMotion 120Hz',
      'Apple M2 chip - 8-core CPU, 10-core GPU',
      'Apple Pencil (2nd gen) hover detection',
      'Thunderbolt / USB 4, Centre Stage front camera',
      '10 hours battery, WiFi 6E, Bluetooth 5.3',
      'iPadOS 17, Face ID authentication'
    ],
    price: 112900,
    imageSrc: 'https://images.unsplash.com/photo-1589003077984-894e133dabab?w=600&q=80',
    imagename: 'ipad-pro-m2-spacegray.jpg',
    rating: 4.8,
    reviews: 6230,
    stock: 'In stock',
    delivery: 'FREE delivery within 2 days'
  },
  {
    title: 'Samsung Galaxy Tab S9 FE (128GB Wi-Fi) - Mint',
    category: 'Tablet',
    brand: 'Samsung',
    description: 'IP68 rated, DeX mode, included S Pen - premium features at mid-range pricing.',
    features: [
      '10.9-inch LCD, 90Hz, 2304x1440',
      'Exynos 1380 octa-core processor',
      '8GB RAM, 128GB storage, microSD up to 1TB',
      'IP68 water and dust resistance',
      'Included S Pen with AES 1.0',
      '10090mAh battery with 45W charging'
    ],
    price: 44999,
    imageSrc: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&q=80',
    imagename: 'galaxy-tab-s9fe-mint.jpg',
    rating: 4.3,
    reviews: 3100,
    stock: 'In stock',
    delivery: 'FREE delivery by Tomorrow'
  },
  {
    title: 'Lenovo Tab P12 (256GB) - Storm Gray',
    category: 'Tablet',
    brand: 'Lenovo',
    description: '12.7-inch 3K display, quad JBL speakers - an entertainment powerhouse.',
    features: [
      '12.7-inch IPS LCD 3K (3840x2400), 144Hz',
      'Dimensity 7050 octa-core processor',
      '8GB RAM, 256GB storage, microSD up to 2TB',
      'Quad JBL speakers with Dolby Atmos',
      '10200mAh battery with 45W TurboCharge',
      'Optional Lenovo Tab Pen Plus (4096 pressure levels)'
    ],
    price: 34999,
    imageSrc: 'https://images.unsplash.com/photo-1542751110-a0c7b7418cd9?w=600&q=80',
    imagename: 'lenovo-tab-p12-gray.jpg',
    rating: 4.4,
    reviews: 1870,
    stock: 'In stock',
    delivery: 'FREE delivery within 2 days'
  },
  {
    title: 'Apple Watch Series 9 (45mm) GPS - Midnight Aluminium',
    category: 'Smartwatch',
    brand: 'Apple',
    description: 'Double Tap gesture, brighter display, carbon neutral - the most capable Apple Watch ever.',
    features: [
      '45mm always-on Retina LTPO display - 2000 nits peak brightness',
      'Double Tap gesture control with S9 chip',
      'Advanced health sensors - blood oxygen, ECG, crash detection',
      'Carbon neutral with recycled materials',
      '18-hour battery, fast charging, WR50 water resistance',
      'watchOS 10, Siri on-device processing'
    ],
    price: 44900,
    imageSrc: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&q=80',
    imagename: 'apple-watch-s9-midnight.jpg',
    rating: 4.7,
    reviews: 15230,
    stock: 'In stock',
    delivery: 'FREE delivery by Tomorrow'
  },
  {
    title: 'Samsung Galaxy Watch 6 Classic (47mm) - Black',
    category: 'Smartwatch',
    brand: 'Samsung',
    description: 'Iconic rotating bezel returns, advanced sleep coaching, Sapphire Crystal glass.',
    features: [
      '47mm Super AMOLED, 480x480, Sapphire Crystal Glass',
      'Physical rotating bezel for tactile navigation',
      'Advanced Sleep Coaching with snore detection',
      'Body Composition, ECG, Blood Pressure monitoring',
      'Exynos W930 dual-core, 2GB RAM, 16GB storage',
      '5ATM + IP68, MIL-STD-810H certified'
    ],
    price: 34999,
    imageSrc: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
    imagename: 'galaxy-watch6-classic-black.jpg',
    rating: 4.5,
    reviews: 7890,
    stock: 'In stock',
    delivery: 'FREE delivery by Tomorrow'
  },
  {
    title: 'Garmin Fenix 7S Sapphire Solar (42mm) - Powder Gray',
    category: 'Smartwatch',
    brand: 'Garmin',
    description: 'Solar charging, multi-band GPS, topoactive maps - the ultimate outdoor sports watch.',
    features: [
      '42mm Power Sapphire solar-charging lens',
      'Multi-band GPS with TopoActive routable maps',
      'Up to 11 days battery in smartwatch mode (18 with solar)',
      'Advanced training metrics - VO2 max, Training Load, Recovery',
      'Underwater GPS, dive mode, ski resort maps',
      '10ATM water resistance, titanium bezel'
    ],
    price: 89990,
    imageSrc: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&q=80',
    imagename: 'garmin-fenix7s-sapphire.jpg',
    rating: 4.8,
    reviews: 2340,
    stock: 'In stock',
    delivery: 'FREE delivery within 2 days'
  },
  {
    title: 'boAt Wave Prime Smartwatch - Active Black',
    category: 'Smartwatch',
    brand: 'boAt',
    description: '1.69-inch HD display, 7-day battery, SpO2 and Heart Rate - great value under Rs. 2000.',
    features: [
      '1.69-inch square HD display, 550 nits brightness',
      '100+ sports modes, 7-day battery life',
      'SpO2, Heart Rate, Sleep monitoring',
      'IP68 sweat and splash resistance',
      'Call and notification alerts via Bluetooth',
      'Compatible with iOS and Android'
    ],
    price: 1799,
    imageSrc: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=600&q=80',
    imagename: 'boat-wave-prime-black.jpg',
    rating: 3.9,
    reviews: 52100,
    stock: 'In stock',
    delivery: 'FREE delivery by Tomorrow'
  },
  {
    title: 'Sony Alpha A7 IV Full-Frame Mirrorless Camera (Body Only)',
    category: 'Camera',
    brand: 'Sony',
    description: '33MP BSI-CMOS, BIONZ XR, 10fps, 4K 60p - a hybrid shooter for stills and video.',
    features: [
      '33MP back-illuminated full-frame Exmor R CMOS',
      'BIONZ XR processor, 10fps with AE/AF tracking',
      '4K 60p 10-bit oversampled video, S-Log3, S-Cinetone',
      '759-point phase-detect AF with AI subject recognition',
      '5-axis in-body stabilisation - up to 5.5 stops',
      'Dual card slots (CFexpress Type A + UHS-II SD)'
    ],
    price: 259990,
    imageSrc: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&q=80',
    imagename: 'sony-a7iv-body.jpg',
    rating: 4.9,
    reviews: 3120,
    stock: 'In stock',
    delivery: 'FREE delivery within 2 days'
  },
  {
    title: 'Canon EOS R10 Mirrorless Camera with 18-45mm Kit Lens',
    category: 'Camera',
    brand: 'Canon',
    description: 'APS-C sensor, 15fps burst, DIGIC X AF - perfect entry into Canon RF mirrorless.',
    features: [
      '24.2MP APS-C CMOS sensor, DIGIC X processor',
      '15fps mechanical / 23fps electronic burst',
      'Dual Pixel CMOS AF II - 651-zone face and eye tracking',
      '4K 30p (no crop) / 1080p 120fps slow motion',
      'Compact and lightweight - 429g body only',
      'Vari-angle touchscreen LCD'
    ],
    price: 99995,
    imageSrc: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80',
    imagename: 'canon-eos-r10-kit.jpg',
    rating: 4.6,
    reviews: 1980,
    stock: 'In stock',
    delivery: 'FREE delivery within 2 days'
  },
  {
    title: 'GoPro HERO 12 Black Action Camera',
    category: 'Camera',
    brand: 'GoPro',
    description: 'HyperSmooth 6.0 stabilisation, 5.3K video, Enduro battery - built for adventure.',
    features: [
      '5.3K60 / 4K120 / 2.7K240 video recording',
      'HyperSmooth 6.0 - best-ever in-camera stabilisation',
      '27MP still photos, HDR mode',
      '70-minute Enduro battery at 5.3K',
      'Max Lens Mod 2.0 compatible, 10m waterproof',
      'Auto upload to GoPro Cloud, Quik mobile editing'
    ],
    price: 39500,
    imageSrc: 'https://images.unsplash.com/photo-1520923642038-b4259acecbd7?w=600&q=80',
    imagename: 'gopro-hero12-black.jpg',
    rating: 4.6,
    reviews: 8760,
    stock: 'In stock',
    delivery: 'FREE delivery by Tomorrow'
  },
  {
    title: 'Fujifilm Instax Mini 12 Instant Camera - Lilac Purple',
    category: 'Camera',
    brand: 'Fujifilm',
    description: 'Point, shoot, collect - instant credit-card-sized prints with automatic exposure.',
    features: [
      'Automatic exposure control - works in any lighting',
      'Close-up mode lens for portraits 30-50 cm away',
      '60mm lens, f/12.7 aperture, 1/250s shutter',
      'Selfie mirror on lens for easy self-portraits',
      'Prints on Instax Mini film (credit-card size)',
      'Powered by 2xAA batteries'
    ],
    price: 7499,
    imageSrc: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&q=80',
    imagename: 'instax-mini12-lilac.jpg',
    rating: 4.4,
    reviews: 24500,
    stock: 'In stock',
    delivery: 'FREE delivery by Tomorrow'
  },
  {
    title: 'Anker 737 PowerBank 24000mAh (140W) - Black',
    category: 'Accessory',
    brand: 'Anker',
    description: '140W bi-directional USB-C, charges MacBook Pro at full speed - the pro powerbank.',
    features: [
      '24000mAh capacity - charges iPhone 15 about 5 times',
      '140W USB-C output - charges MacBook Pro at max speed',
      '140W input - recharges itself in under 1 hour',
      '2x USB-C + 1x USB-A, simultaneous 3-device charging',
      'ActiveShield 2.0 temperature monitoring, 0-45C',
      'Smart digital display - real-time wattage readout'
    ],
    price: 11999,
    imageSrc: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&q=80',
    imagename: 'anker-737-powerbank.jpg',
    rating: 4.6,
    reviews: 6750,
    stock: 'In stock',
    delivery: 'FREE delivery by Tomorrow'
  },
  {
    title: 'Logitech MX Master 3S Wireless Mouse - Graphite',
    category: 'Accessory',
    brand: 'Logitech',
    description: '8K DPI MagSpeed scroll wheel, silent click, works on any surface - the perfect productivity mouse.',
    features: [
      '8000 DPI Darkfield sensor - works on glass',
      'MagSpeed electromagnetic scroll wheel - whisper quiet',
      'Silent click buttons - 90% noise reduction',
      'Customisable side thumb wheel and extra buttons',
      'Logi Bolt USB + Bluetooth, multi-device Easy-Switch',
      '70-day battery, USB-C fast charge (1 min = 3 hours)'
    ],
    price: 9495,
    imageSrc: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&q=80',
    imagename: 'logitech-mx-master3s-graphite.jpg',
    rating: 4.8,
    reviews: 21000,
    stock: 'In stock',
    delivery: 'FREE delivery by Tomorrow'
  },
  {
    title: 'Crucial P3 Plus 1TB PCIe Gen 4 NVMe M.2 SSD',
    category: 'Accessory',
    brand: 'Crucial',
    description: 'Up to 5000MB/s read speeds, M.2 2280 form factor - a budget Gen 4 speed king.',
    features: [
      'Sequential read up to 5000 MB/s, write up to 4200 MB/s',
      'PCIe Gen 4.0 x 4 NVMe, M.2 2280',
      '1TB capacity - plenty for games and creative work',
      'Advanced wear-levelling for long-term reliability',
      'Compatible with PS5 (internal expansion)',
      '5-year limited warranty'
    ],
    price: 7499,
    imageSrc: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&q=80',
    imagename: 'crucial-p3plus-1tb.jpg',
    rating: 4.5,
    reviews: 4120,
    stock: 'In stock',
    delivery: 'FREE delivery by Tomorrow'
  },
  {
    title: 'Samsung 49" Odyssey OLED G9 Curved Gaming Monitor',
    category: 'Accessory',
    brand: 'Samsung',
    description: '240Hz QD-OLED, 0.03ms response, 1800R curve - the most immersive monitor on the market.',
    features: [
      '49-inch 5120x1440 Dual QHD QD-OLED, 240Hz',
      '0.03ms GtG response time, VESA DisplayHDR True Black 400',
      '1800R curved panel - 32:9 ultra-wide super-ultrawide',
      'AMD FreeSync Premium Pro, G-Sync compatible',
      'Smart TV OS built-in, auto source switching',
      'Thunderbolt 4 input, USB hub, 1000R display presets'
    ],
    price: 159990,
    imageSrc: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&q=80',
    imagename: 'samsung-odyssey-oled-g9.jpg',
    rating: 4.7,
    reviews: 980,
    stock: 'In stock',
    delivery: 'FREE delivery within 3 days'
  },
  {
    title: 'Mi 65W GaN USB-C Fast Charger',
    category: 'Accessory',
    brand: 'Xiaomi',
    description: 'GaN technology, ultra-compact, supports PD 3.0 and QC 4+ - charges everything fast.',
    features: [
      '65W max output via single USB-C port',
      'GaN (Gallium Nitride) technology - 40% smaller than conventional chargers',
      'Universal compatibility - laptops, phones, tablets',
      'Supports PD 3.0, QC 4+, SCP, AFC protocols',
      'Multiple safety protections - overheat, overcharge, short-circuit',
      'Foldable pin design for easy carrying'
    ],
    price: 1299,
    imageSrc: 'https://images.unsplash.com/photo-1586816001966-79b736744398?w=600&q=80',
    imagename: 'mi-65w-gan-charger.jpg',
    rating: 4.3,
    reviews: 31200,
    stock: 'In stock',
    delivery: 'FREE delivery by Tomorrow'
  }
];

async function seed() {
  const replaceExisting = process.argv.includes('--replace');

  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    });

    console.log('Connected to MongoDB');

    if (replaceExisting) {
      await Shopproduct.deleteMany({});
      const inserted = await Shopproduct.insertMany(products);
      console.log(`Inserted ${inserted.length} products after clearing the collection.`);
    } else {
      const operations = products.map((product) => ({
        updateOne: {
          filter: { imagename: product.imagename },
          update: { $set: product },
          upsert: true
        }
      }));

      const result = await Shopproduct.bulkWrite(operations, { ordered: false });
      const seededProducts = await Shopproduct.countDocuments({
        imagename: { $in: products.map((product) => product.imagename) }
      });

      console.log(`Processed ${products.length} seed products.`);
      console.log(`Inserted: ${result.upsertedCount || 0}`);
      console.log(`Updated: ${result.modifiedCount || 0}`);
      console.log(`Matched: ${result.matchedCount || 0}`);
      console.log(`Seed products currently present: ${seededProducts}`);
    }

    const categoryCounts = await Shopproduct.aggregate([
      { $match: { imagename: { $in: products.map((product) => product.imagename) } } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    console.log('Category summary:');
    categoryCounts.forEach((entry) => {
      console.log(`- ${entry._id}: ${entry.count}`);
    });

    console.log('Seed completed successfully.');
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seed();
