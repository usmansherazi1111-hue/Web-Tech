
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const multer = require('multer');
const path = require('path');
const { isAdmin } = require('../middleware/auth');

router.use(isAdmin);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

async function renderDashboard(req, res) {
    const products = await Product.find();
    res.render('admin/dashboard', { products });
}

router.get('/', renderDashboard);
router.get('/dashboard', renderDashboard);

router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

router.get('/add', (req, res) => {
    res.render('admin/addProduct');
});

router.post('/add-product', async (req, res) => {

    try {

        const {
            name,
            price,
            category,
            image,
            stock,
            rating
        } = req.body;

        const product = new Product({
            name,
            price,
            category,
            image,
            stock,
            rating
        });

        await product.save();

        req.flash('success', 'Product Added Successfully');

        res.redirect('/admin/dashboard');

    } catch (err) {

        console.log(err);

        req.flash('error', 'Failed to Add Product');

        res.redirect('/admin/add-product');
    }
});

router.get('/edit/:id', async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.render('admin/editProduct', { product });
});

router.put('/edit/:id', upload.single('image'), async (req, res) => {
    const updatedData = {
        name: req.body.name,
        price: req.body.price,
        category: req.body.category,
        rating: req.body.rating,
        stock: req.body.stock
    };

    if (req.file) {
        updatedData.image = '/uploads/' + req.file.filename;
    }

    await Product.findByIdAndUpdate(req.params.id, updatedData);

    req.flash('success', 'Product Updated Successfully');
    res.redirect('/admin/dashboard');
});

router.delete('/delete/:id', async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);

    req.flash('success', 'Product Deleted Successfully');
    res.redirect('/admin/dashboard');
});

module.exports = router;
