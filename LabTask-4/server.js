require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const session = require("express-session");
const flash = require("connect-flash");
const MongoStore = require("connect-mongo");
const bcrypt = require('bcryptjs');

const Product = require('./models/Product');
const User = require('./models/User');

const apiRoutes = require('./routes/api/apiRoutes');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const { isLoggedIn } = require('./middleware/auth');

const app = express();
const PORT = 3000;

mongoose.connect('mongodb://127.0.0.1:27017/krogerDB')
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/v1', apiRoutes);

app.use(
  session({
    secret: "krogerDB",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: "mongodb://127.0.0.1:27017/krogerDB",
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

// Flash middleware AFTER session
app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.session.user || null;
  next();
});

app.get('/', (req, res) => {
    res.redirect('/products?page=1');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            req.flash('error', 'Email already exists');
            return res.redirect('/register');
        }

        if (password.length < 6) {
            req.flash('error', 'Password must be at least 6 characters');
            return res.redirect('/register');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            role: 'customer'
        });

        await user.save();

        req.flash('success', 'Registration successful! Please login.');
        res.redirect('/login');

    } catch (err) {
        console.log(err);
        req.flash('error', 'Registration failed');
        res.redirect('/register');
    }
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            req.flash('error', 'Invalid email or password');
            return res.redirect('/login');
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            req.flash('error', 'Invalid email or password');
            return res.redirect('/login');
        }

        req.session.user = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        };

        req.flash('success', `Welcome back, ${user.name}!`);

        if (user.role === 'admin') {
            return res.redirect('/admin/dashboard');
        }

        res.redirect('/products?page=1');

    } catch (err) {
        console.log(err);
        req.flash('error', 'Login failed');
        res.redirect('/login');
    }
});

app.get('/logout', (req, res) => {

    req.session.user = null;

    req.flash('success', 'You have successfully logged out');

    res.redirect('/login');
});

app.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile');
});

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

app.use('/admin', adminRoutes);
app.use('/', authRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
