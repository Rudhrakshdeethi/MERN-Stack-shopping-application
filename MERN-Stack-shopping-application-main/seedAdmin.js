require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Shopuser = require('./models/Shopuser');
const Shopproduct = require('./models/Shopproduct');

connectDB();

const seedData = async () => {
    try {
        
        const adminExists = await Shopuser.findOne({ email: 'admin@lumacart.com' });

        if (!adminExists) {
            const admin = new Shopuser({
                name: 'Admin User',
                phone: 9999999999,
                email: 'admin@lumacart.com',
                password: 'admin123',
                address: '123 Admin Street',
                state: 'California',
                city: 'San Francisco',
                pincode: 94102,
                isAdmin: true
            });
            await admin.save();
            console.log('✓ Admin user created successfully!');
            console.log('  Email: admin@lumacart.com');
            console.log('  Password: admin123');
        } else {
            console.log('✓ Admin user already exists');
        }

        // Sample products data
        const sampleProducts = [
            {
                title: 'New Apple iPhone 12 (128GB)',
                category: 'Smartphone',
                brand: 'Apple',
                description: 'A fast, premium iPhone with a bright display, strong cameras, and dependable all-day performance.',
                features: [
                    '128GB storage with Super Retina XDR display',
                    'Dual-camera system for sharp low-light photos',
                    'Smooth performance for daily use and gaming',
                    'Premium build with long-term software support'
                ],
                price: 84900,
                imageSrc: 'https://m.media-amazon.com/images/I/71ZOtNdaZCL._SX679.jpg',
                imagename: 'iphone12.jpg',
                rating: 4.6,
                reviews: 18432,
                stock: 'In stock',
                delivery: 'FREE delivery by Tomorrow'
            },
            {
                title: 'New Apple iPhone 11 (128GB)',
                category: 'Smartphone',
                brand: 'Apple',
                description: 'A balanced iPhone option with solid battery life, a familiar design, and smooth everyday performance.',
                features: [
                    '128GB storage with Liquid Retina HD display',
                    'Reliable all-day battery life for typical use',
                    'Dual cameras with strong video performance',
                    'A familiar iPhone experience at a lower price'
                ],
                price: 59900,
                imageSrc: 'https://m.media-amazon.com/images/I/71hIfcIPBmL._SX679.jpg',
                imagename: 'iphone11.jpg',
                rating: 4.5,
                reviews: 22140,
                stock: 'In stock',
                delivery: 'FREE delivery by Tomorrow'
            },
            {
                title: 'Apple iPhone X (256GB)',
                category: 'Smartphone',
                brand: 'Apple',
                description: 'A compact flagship-style iPhone with OLED display quality and generous storage for photos and apps.',
                features: [
                    '256GB storage for photos, apps and media',
                    'OLED display with premium compact design',
                    'Strong performance for everyday tasks',
                    'Face ID and flagship-class camera quality'
                ],
                price: 49994,
                imageSrc: 'https://m.media-amazon.com/images/I/61iK8zTwwJL._SX679.jpg',
                imagename: 'iphone10.jpg',
                rating: 4.3,
                reviews: 8940,
                stock: 'Only 2 left in stock',
                delivery: 'FREE delivery in 2 days'
            },
            {
                title: 'Redmi Y3 (Bold Red, 4GB RAM, 64GB Storage)',
                category: 'Budget Pick',
                brand: 'Redmi',
                description: 'An affordable daily-use phone with enough memory and storage for calls, social apps, and light media use.',
                features: [
                    '4GB RAM and 64GB storage for everyday apps',
                    'Good value for basic calls, browsing and media',
                    'Large battery focused on longer daily use',
                    'Suitable for budget-conscious buyers'
                ],
                price: 11999,
                imageSrc: 'https://m.media-amazon.com/images/I/71X5vJWLP3L._SX679.jpg',
                imagename: 'miy3.jpg',
                rating: 4.1,
                reviews: 12054,
                stock: 'In stock',
                delivery: 'FREE delivery in 3 days'
            },
            {
                title: 'Mi 10i 5G (Midnight Black, 6GB RAM, 128GB Storage)',
                category: '5G Device',
                brand: 'Mi',
                description: 'A value-focused 5G phone with a sharp display, modern connectivity, and storage for work and entertainment.',
                features: [
                    '5G-ready phone with 6GB RAM and 128GB storage',
                    'Large display for streaming and browsing',
                    'Balanced performance for daily work and play',
                    'A strong mid-range option for feature-conscious buyers'
                ],
                price: 21999,
                imageSrc: 'https://m.media-amazon.com/images/I/71kfTmN4P+L._SX679.jpg',
                imagename: 'mi10i.jpg',
                rating: 4.2,
                reviews: 15488,
                stock: 'In stock',
                delivery: 'FREE delivery by Tomorrow'
            },
            {
                title: 'Apple MacBook Pro (16-inch, 16GB RAM, 512GB Storage, 2.6GHz 9th Gen Intel Core i7)',
                category: 'Laptop',
                brand: 'Apple',
                description: 'A high-performance laptop built for demanding workloads like development, editing, and multitasking.',
                features: [
                    '16-inch display with 16GB RAM and 512GB SSD',
                    'Designed for coding, editing and heavy multitasking',
                    'Premium keyboard, speakers and build quality',
                    'Strong fit for professional and creative workloads'
                ],
                price: 169990,
                imageSrc: 'https://m.media-amazon.com/images/I/61aUBxqc5PL._SX679.jpg',
                imagename: 'macbookpro.jpg',
                rating: 4.7,
                reviews: 6382,
                stock: 'In stock',
                delivery: 'FREE delivery in 2 days'
            }
        ];

        // Check if products already exist
        const existingProducts = await Shopproduct.countDocuments();

        if (existingProducts === 0) {
            await Shopproduct.insertMany(sampleProducts);
            console.log('✓ Sample products seeded successfully!');
            console.log(`  ${sampleProducts.length} products added to the database.`);
        } else {
            console.log(`✓ ${existingProducts} products already exist in the database.`);
        }

        console.log('\n✓ Seeding completed successfully!');
        console.log('\nYou can now:');
        console.log('1. Start the server: npm run dev (or node server.js)');
        console.log('2. Login as admin: admin@lumacart.com / admin123');
        console.log('3. Access admin panel: /admin/add-product');

        process.exit(0);
    } catch (err) {
        console.error('Error seeding data:', err);
        process.exit(1);
    }
};

seedData();
