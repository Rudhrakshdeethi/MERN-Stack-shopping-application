const express = require('express');
const router = express.Router();
const Shopproduct = require('../../models/Shopproduct');
const auth = require('../../middleware/auth');

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const parseList = (value) =>
  String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const normalizePositiveNumber = (value, fallback) => {
  const parsed = parseInt(value, 10);

  if (Number.isNaN(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
};

const buildProductsQuery = (query) => {
  const {
    q,
    category,
    brand,
    delivery,
    stock,
    minPrice,
    maxPrice,
    minRating
  } = query;

  const filters = {};

  if (q) {
    const pattern = new RegExp(escapeRegex(String(q).trim()), 'i');
    filters.$or = [
      { title: pattern },
      { category: pattern },
      { brand: pattern },
      { description: pattern },
      { features: pattern }
    ];
  }

  const categories = parseList(category);
  if (categories.length) {
    filters.category = { $in: categories };
  }

  const brands = parseList(brand);
  if (brands.length) {
    filters.brand = { $in: brands };
  }

  const deliveryOptions = parseList(delivery);
  if (deliveryOptions.length) {
    filters.delivery = { $in: deliveryOptions };
  }

  const stockOptions = parseList(stock);
  if (stockOptions.length) {
    filters.stock = { $in: stockOptions };
  }

  const priceRange = {};
  const parsedMinPrice = Number(minPrice);
  const parsedMaxPrice = Number(maxPrice);

  if (!Number.isNaN(parsedMinPrice)) {
    priceRange.$gte = parsedMinPrice;
  }

  if (!Number.isNaN(parsedMaxPrice)) {
    priceRange.$lte = parsedMaxPrice;
  }

  if (Object.keys(priceRange).length) {
    filters.price = priceRange;
  }

  const parsedMinRating = Number(minRating);
  if (!Number.isNaN(parsedMinRating)) {
    filters.rating = { $gte: parsedMinRating };
  }

  return filters;
};

const getSortStage = (sort) => {
  switch (sort) {
    case 'price_asc':
      return { price: 1, createdAt: -1 };
    case 'price_desc':
      return { price: -1, createdAt: -1 };
    case 'rating_desc':
      return { rating: -1, reviews: -1, createdAt: -1 };
    case 'reviews_desc':
      return { reviews: -1, rating: -1, createdAt: -1 };
    case 'title_asc':
      return { title: 1 };
    case 'newest':
      return { createdAt: -1 };
    case 'featured':
    default:
      return { rating: -1, reviews: -1, createdAt: -1 };
  }
};

const buildFilterOptions = async (query) => {
  const aggregation = await Shopproduct.aggregate([
    { $match: query },
    {
      $facet: {
        categories: [
          { $group: { _id: '$category', count: { $sum: 1 } } },
          { $sort: { count: -1, _id: 1 } }
        ],
        brands: [
          { $group: { _id: '$brand', count: { $sum: 1 } } },
          { $sort: { count: -1, _id: 1 } }
        ],
        delivery: [
          { $group: { _id: '$delivery', count: { $sum: 1 } } },
          { $sort: { count: -1, _id: 1 } }
        ],
        stock: [
          { $group: { _id: '$stock', count: { $sum: 1 } } },
          { $sort: { count: -1, _id: 1 } }
        ],
        priceRange: [
          {
            $group: {
              _id: null,
              min: { $min: '$price' },
              max: { $max: '$price' }
            }
          }
        ]
      }
    }
  ]);

  const facets = aggregation[0] || {};

  return {
    categories: (facets.categories || []).map((item) => ({
      value: item._id,
      count: item.count
    })),
    brands: (facets.brands || []).map((item) => ({
      value: item._id,
      count: item.count
    })),
    delivery: (facets.delivery || []).map((item) => ({
      value: item._id,
      count: item.count
    })),
    stock: (facets.stock || []).map((item) => ({
      value: item._id,
      count: item.count
    })),
    priceRange: {
      min: facets.priceRange && facets.priceRange[0] ? facets.priceRange[0].min : 0,
      max: facets.priceRange && facets.priceRange[0] ? facets.priceRange[0].max : 0
    }
  };
};

// GET /api/products - Get paginated products (public)
router.get('/', async (req, res) => {
  try {
    const page = normalizePositiveNumber(req.query.page, 1);
    const limit = Math.min(normalizePositiveNumber(req.query.limit, 12), 48);
    const offset = (page - 1) * limit;
    const filters = buildProductsQuery(req.query);
    const sort = getSortStage(req.query.sort);

    const [products, total, filterOptions] = await Promise.all([
      Shopproduct.find(filters)
        .sort(sort)
        .skip(offset)
        .limit(limit),
      Shopproduct.countDocuments(filters),
      buildFilterOptions(filters)
    ]);

    const totalPages = Math.max(Math.ceil(total / limit), 1);
    const safePage = Math.min(page, totalPages);

    if (safePage !== page) {
      const recalculatedOffset = (safePage - 1) * limit;
      const fallbackProducts = await Shopproduct.find(filters)
        .sort(sort)
        .skip(recalculatedOffset)
        .limit(limit);

      return res.json({
        products: fallbackProducts,
        pagination: {
          page: safePage,
          limit,
          total,
          totalPages,
          offset: recalculatedOffset,
          hasNextPage: safePage < totalPages,
          hasPrevPage: safePage > 1,
          from: total ? recalculatedOffset + 1 : 0,
          to: total ? Math.min(recalculatedOffset + fallbackProducts.length, total) : 0
        },
        filters: filterOptions
      });
    }

    res.json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        offset,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        from: total ? offset + 1 : 0,
        to: total ? Math.min(offset + products.length, total) : 0
      },
      filters: filterOptions
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// GET /api/products/:id - Get single product by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const product = await Shopproduct.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Product not found' });
    }
    res.status(500).send('Server Error');
  }
});

// POST /api/products - Add new product (admin only)
router.post('/', auth, async (req, res) => {
  try {
    const Shopuser = require('../../models/Shopuser');
    const user = await Shopuser.findById(req.user.id);

    if (!user || !user.isAdmin) {
      return res.status(403).json({ msg: 'Admin access required' });
    }

    const {
      title,
      category,
      brand,
      description,
      features,
      price,
      imageSrc,
      imagename,
      rating,
      reviews,
      stock,
      delivery
    } = req.body;

    const newProduct = new Shopproduct({
      title,
      category,
      brand,
      description,
      features,
      price,
      imageSrc,
      imagename,
      rating,
      reviews,
      stock,
      delivery
    });

    const product = await newProduct.save();
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// PUT /api/products/:id - Update product (admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    const Shopuser = require('../../models/Shopuser');
    const user = await Shopuser.findById(req.user.id);

    if (!user || !user.isAdmin) {
      return res.status(403).json({ msg: 'Admin access required' });
    }

    const product = await Shopproduct.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    const {
      title,
      category,
      brand,
      description,
      features,
      price,
      imageSrc,
      imagename,
      rating,
      reviews,
      stock,
      delivery
    } = req.body;

    product.title = title || product.title;
    product.category = category || product.category;
    product.brand = brand || product.brand;
    product.description = description || product.description;
    product.features = features || product.features;
    product.price = price || product.price;
    product.imageSrc = imageSrc || product.imageSrc;
    product.imagename = imagename || product.imagename;
    product.rating = rating || product.rating;
    product.reviews = reviews || product.reviews;
    product.stock = stock || product.stock;
    product.delivery = delivery || product.delivery;

    await product.save();
    res.json(product);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Product not found' });
    }
    res.status(500).send('Server Error');
  }
});

// DELETE /api/products/:id - Delete product (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const Shopuser = require('../../models/Shopuser');
    const user = await Shopuser.findById(req.user.id);

    if (!user || !user.isAdmin) {
      return res.status(403).json({ msg: 'Admin access required' });
    }

    const product = await Shopproduct.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    await product.deleteOne();
    res.json({ msg: 'Product removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Product not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
