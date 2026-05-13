const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const Product = require('./models/Product');

const app = express();

const PORT = 3000;

/* =========================
   DATABASE CONNECTION
========================= */

mongoose.connect('mongodb://127.0.0.1:27017/krogerDB')
.then(() => {
    console.log('MongoDB Connected');
})
.catch((err) => {
    console.log(err);
});

/* =========================
   SETTINGS
========================= */

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

/* =========================
   HOME ROUTE
========================= */

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

/* =========================
   PRODUCTS ROUTE
========================= */

app.get('/products', async (req, res) => {

    const page = parseInt(req.query.page) || 1;
    const limit = 8;

    const category = req.query.category || '';
    const search = req.query.search || '';

    const minPrice = req.query.minPrice || '';
    const maxPrice = req.query.maxPrice || '';

    let filter = {};

    // Category Filter
    if (category && category !== 'All Categories') {
        filter.category = category;
    }

    // Search Filter
    if (search) {
        filter.name = {
            $regex: search,
            $options: 'i'
        };
    }

    // Price Filter
    if (minPrice || maxPrice) {

        filter.price = {};

        if (minPrice) {
            filter.price.$gte = Number(minPrice);
        }

        if (maxPrice) {
            filter.price.$lte = Number(maxPrice);
        }

    }

    const products = await Product.find(filter)
        .skip((page - 1) * limit)
        .limit(limit);

    const totalProducts = await Product.countDocuments(filter);

    res.render('products', {
        products,
        currentPage: page,
        totalPages: Math.ceil(totalProducts / limit),

        selectedCategory: category,

        search,
        minPrice,
        maxPrice
    });

});

/* =========================
   SERVER
========================= */

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});