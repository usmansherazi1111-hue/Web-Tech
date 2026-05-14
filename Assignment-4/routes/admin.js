const express = require('express');

const router = express.Router();

const Product = require('../models/Product');

const multer = require('multer');

const path = require('path');

const bcrypt = require('bcryptjs');

const Admin = require('../models/Admin');

const auth = require('../middleware/auth');

router.get('/login', (req, res) => {

    res.render('admin/login');

});

/* =========================
   MULTER CONFIG
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

router.post('/login', async (req, res) => {

    const admin = await Admin.findOne({

        email: req.body.email

    });

    if (!admin) {

        return res.send('Admin not found');

    }

    const validPassword = await bcrypt.compare(

        req.body.password,
        admin.password

    );

    if (!validPassword) {

        return res.send('Invalid Password');

    }

    req.session.adminId = admin._id;

    res.redirect('/admin');

});

/* =========================
   ADMIN DASHBOARD
========================= */

router.get('/', async (req, res) => {

    const products = await Product.find();

    res.render('admin/dashboard', { products });

});

/* =========================
   ADD PRODUCT PAGE
========================= */

router.get('/add', (req, res) => {

    res.render('admin/addProduct');

});

/* =========================
   SAVE PRODUCT
========================= */

router.post('/add', upload.single('image'), async (req, res) => {

    const product = new Product({

        name: req.body.name,

        price: req.body.price,

        category: req.body.category,

        rating: req.body.rating,

        stock: req.body.stock,

        image: '/uploads/' + req.file.filename

    });

    await product.save();

    res.redirect('/admin');

});

/* =========================
   EDIT PRODUCT PAGE
========================= */

router.get('/edit/:id', async (req, res) => {

    const product = await Product.findById(req.params.id);

    res.render('admin/editProduct', { product });

});

/* =========================
   UPDATE PRODUCT
========================= */

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

    res.redirect('/admin');

});

/* =========================
   DELETE PRODUCT
========================= */

router.delete('/delete/:id', async (req, res) => {

    await Product.findByIdAndDelete(req.params.id);

    res.redirect('/admin');

});

module.exports = router;