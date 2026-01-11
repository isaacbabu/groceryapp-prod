// MongoDB script to populate initial grocery items
db = db.getSiblingDB('test_database');

const items = [
  // Vegetables
  {
    item_id: 'item_' + new ObjectId().toString().slice(-12),
    name: 'Tomato',
    rate: 40.00,
    image_url: 'https://images.pexels.com/photos/35594805/pexels-photo-35594805.jpeg',
    category: 'Vegetables',
    created_at: new Date()
  },
  {
    item_id: 'item_' + new ObjectId().toString().slice(-12),
    name: 'Onion',
    rate: 30.00,
    image_url: 'https://images.pexels.com/photos/3978830/pexels-photo-3978830.jpeg',
    category: 'Vegetables',
    created_at: new Date()
  },
  {
    item_id: 'item_' + new ObjectId().toString().slice(-12),
    name: 'Potato',
    rate: 25.00,
    image_url: 'https://images.pexels.com/photos/144248/potatoes-vegetables-erdfrucht-bio-144248.jpeg',
    category: 'Vegetables',
    created_at: new Date()
  },
  {
    item_id: 'item_' + new ObjectId().toString().slice(-12),
    name: 'Carrot',
    rate: 35.00,
    image_url: 'https://images.pexels.com/photos/3650647/pexels-photo-3650647.jpeg',
    category: 'Vegetables',
    created_at: new Date()
  },
  {
    item_id: 'item_' + new ObjectId().toString().slice(-12),
    name: 'Capsicum',
    rate: 50.00,
    image_url: 'https://images.pexels.com/photos/1437318/pexels-photo-1437318.jpeg',
    category: 'Vegetables',
    created_at: new Date()
  },
  
  // Fruits
  {
    item_id: 'item_' + new ObjectId().toString().slice(-12),
    name: 'Apple',
    rate: 120.00,
    image_url: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg',
    category: 'Fruits',
    created_at: new Date()
  },
  {
    item_id: 'item_' + new ObjectId().toString().slice(-12),
    name: 'Banana',
    rate: 50.00,
    image_url: 'https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg',
    category: 'Fruits',
    created_at: new Date()
  },
  {
    item_id: 'item_' + new ObjectId().toString().slice(-12),
    name: 'Orange',
    rate: 80.00,
    image_url: 'https://images.pexels.com/photos/161559/background-bitter-breakfast-bright-161559.jpeg',
    category: 'Fruits',
    created_at: new Date()
  },
  
  // Dairy
  {
    item_id: 'item_' + new ObjectId().toString().slice(-12),
    name: 'Milk (1L)',
    rate: 60.00,
    image_url: 'https://images.pexels.com/photos/5605628/pexels-photo-5605628.jpeg',
    category: 'Dairy',
    created_at: new Date()
  },
  {
    item_id: 'item_' + new ObjectId().toString().slice(-12),
    name: 'Curd (500g)',
    rate: 40.00,
    image_url: 'https://images.pexels.com/photos/9067760/pexels-photo-9067760.jpeg',
    category: 'Dairy',
    created_at: new Date()
  },
  {
    item_id: 'item_' + new ObjectId().toString().slice(-12),
    name: 'Butter (100g)',
    rate: 55.00,
    image_url: 'https://images.pexels.com/photos/2253643/pexels-photo-2253643.jpeg',
    category: 'Dairy',
    created_at: new Date()
  },
  
  // Grains
  {
    item_id: 'item_' + new ObjectId().toString().slice(-12),
    name: 'Rice (1kg)',
    rate: 70.00,
    image_url: 'https://images.pexels.com/photos/3737639/pexels-photo-3737639.jpeg',
    category: 'Grains',
    created_at: new Date()
  },
  {
    item_id: 'item_' + new ObjectId().toString().slice(-12),
    name: 'Wheat Flour (1kg)',
    rate: 50.00,
    image_url: 'https://images.pexels.com/photos/3737644/pexels-photo-3737644.jpeg',
    category: 'Grains',
    created_at: new Date()
  }
];

// Clear existing items and insert new ones
db.items.deleteMany({});
db.items.insertMany(items);

print('Successfully populated ' + items.length + ' items!');
