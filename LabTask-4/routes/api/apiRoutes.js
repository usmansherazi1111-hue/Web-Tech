const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Product = require('../../models/Product');
const User = require('../../models/User');
const Order = require('../../models/Order');

const verifyToken = require('../../middleware/verifyToken');

const router = express.Router();

// API Health Route
router.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Lab Assignment 04 API is working successfully'
    });
});



// ==========================================
// GET ALL PRODUCTS
// ==========================================

router.get('/products', async (req, res) => {

    try {

        const page = parseInt(req.query.page) || 1;

        const limit = 8;

        const category = req.query.category || '';

        let filter = {};

        if (category) {
            filter.category = category;
        }

        const products = await Product.find(filter)
            .skip((page - 1) * limit)
            .limit(limit);

        const totalProducts = await Product.countDocuments(filter);

        res.status(200).json({

            success: true,

            currentPage: page,

            totalPages: Math.ceil(totalProducts / limit),

            products
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message || 'Server Error'
        });
    }
});



// ==========================================
// GET SINGLE PRODUCT
// ==========================================

router.get('/products/:id', async (req, res) => {

    try {

        const product = await Product.findById(req.params.id);

        if (!product) {

            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            product
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message || 'Server Error'
        });
    }
});



// ==========================================
// LOGIN API + JWT
// ==========================================

router.post('/auth/login', async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {

            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {

            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const token = jwt.sign(

            {
                user_id: user._id,
                role: user.role
            },

            process.env.JWT_SECRET,

            {
                expiresIn: '1h'
            }
        );

        res.status(200).json({

            success: true,

            token,

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message || 'Server Error'
        });
    }
});



// ==========================================
// USER PROFILE
// ==========================================

router.get('/user/profile', verifyToken, async (req, res) => {

    try {

        const user = await User.findById(req.user.user_id).select('-password');

        res.status(200).json({
            success: true,
            user
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message || 'Server Error'
        });
    }
});



// ==========================================
// CREATE ORDER
// ==========================================

router.post('/orders', verifyToken, async (req, res) => {

    try {

        const { products } = req.body;

        if (!products || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Products array is required'
            });
        }

        const order = new Order({

            user: req.user.user_id,

            products
        });

        await order.save();

        res.status(201).json({

            success: true,

            message: 'Order placed successfully',

            order
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message || 'Server Error'
        });
    }
});

module.exports = router;