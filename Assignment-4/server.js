const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const multer = require('multer');
const session = require('express-session');

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
   SESSION
========================= */

app.use(session({
    secret: 'krogersecret',
    resave: false,
    saveUninitialized: true
}));

/* =========================
   MIDDLEWARE
========================= */

app.use(express.urlencoded({ extended: true }));

app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname, 'public')));

/* =========================
   VIEW ENGINE
========================= */

app.set('view engine', 'ejs');

/* =========================
   MULTER STORAGE
========================= */

const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, 'public/uploads');
    },

    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }

});

const upload = multer({ storage: storage });

/* =========================
   ADMIN AUTH MIDDLEWARE
========================= */

function isAdmin(req, res, next) {

    if (req.session.isAdmin) {
        next();
    }
    else {
        res.redirect('/admin/login');
    }

}

/* =========================
   HOME ROUTE
========================= */

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

/* =========================
   PRODUCTS PAGE
========================= */

app.get('/products', async (req, res) => {

    const page = parseInt(req.query.page) || 1;

    const limit = 8;

    const category = req.query.category || '';

    const search = req.query.search || '';

    const minPrice = req.query.minPrice || '';

    const maxPrice = req.query.maxPrice || '';

    let filter = {};

    if (category && category !== 'All Categories') {
        filter.category = category;
    }

    if (search) {
        filter.name = {
            $regex: search,
            $options: 'i'
        };
    }

    if (minPrice || maxPrice) {

        filter.price = {};

        if (minPrice) {
            filter.price.$gte = Number(minPrice);
        }

        if (maxPrice) {
            filter.price.$lte = Number(maxPrice);
        }
    }
    const categories = await Product.distinct('category');
    const products = await Product.find(filter)
        .skip((page - 1) * limit)
        .limit(limit);

    const totalProducts = await Product.countDocuments(filter);

    res.render('products', {

    products,

    categories,

    currentPage: page,

    totalPages: Math.ceil(totalProducts / limit),

    selectedCategory: category,

    search,

    minPrice,

    maxPrice

});

});

/* =========================
   ADMIN LOGIN PAGE
========================= */

app.get('/admin/login', (req, res) => {

    res.render('adminLogin');

});

/* =========================
   ADMIN LOGIN
========================= */

app.post('/admin/login', (req, res) => {

    const { password } = req.body;

    if (password === 'admin123') {

        req.session.isAdmin = true;

        res.redirect('/admin/dashboard');

    }
    else {

        res.send('Wrong Password');

    }

});

/* =========================
   ADMIN LOGOUT
========================= */

app.get('/admin/logout', (req, res) => {

    req.session.destroy();

    res.redirect('/admin/login');

});

/* =========================
   ADMIN DASHBOARD
========================= */

app.get('/admin/dashboard', isAdmin, async (req, res) => {

    const products = await Product.find();

    res.render('admin/dashboard', { products });

});

/* =========================
   ADD PRODUCT PAGE
========================= */

app.get('/admin/add', isAdmin, (req, res) => {

   res.render('admin/addProduct');

});

/* =========================
   ADD PRODUCT
========================= */

app.post('/admin/add', isAdmin, upload.single('image'), async (req, res) => {

    const {
        name,
        price,
        category,
        rating,
        stock
    } = req.body;

    const newProduct = new Product({

        name,
        price,
        category,
        rating,
        stock,

        image: '/uploads/' + req.file.filename

    });

    await newProduct.save();

    res.redirect('/admin/dashboard');

});

/* =========================
   EDIT PRODUCT PAGE
========================= */

app.get('/admin/edit/:id', isAdmin, async (req, res) => {

    const product = await Product.findById(req.params.id);

    res.render('admin/editProduct', { product });

});

/* =========================
   UPDATE PRODUCT
========================= */

app.put('/admin/edit/:id', isAdmin, upload.single('image'), async (req, res) => {

    const {
        name,
        price,
        category,
        rating,
        stock
    } = req.body;

    let updatedData = {

        name,
        price,
        category,
        rating,
        stock

    };

    if (req.file) {

        updatedData.image = '/uploads/' + req.file.filename;

    }

    await Product.findByIdAndUpdate(req.params.id, updatedData);

    res.redirect('/admin/dashboard');

});

/* =========================
   DELETE PRODUCT
========================= */

app.delete('/admin/delete/:id', isAdmin, async (req, res) => {

    await Product.findByIdAndDelete(req.params.id);

    res.redirect('/admin/dashboard');

});

/* =========================
   SERVER
========================= */

app.listen(PORT, () => {

    console.log(`Server running on http://localhost:${PORT}`);

});