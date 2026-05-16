const express = require('express');
const bcrypt = require('bcryptjs');

const router = express.Router();

const User = require('../models/User');

/* =========================
   REGISTER PAGE
========================= */

router.get('/register', (req, res) => {

    res.render('auth/register');

});

/* =========================
   REGISTER USER
========================= */

router.post('/register', async (req, res) => {

    try {

        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {

            req.flash('error', 'Email already exists');

            return res.redirect('/register');

        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({

            name,
            email,
            password: hashedPassword

        });

        await user.save();

        req.flash('success', 'Registration Successful');

        res.redirect('/login');

    }

    catch (err) {

        console.log(err);

        req.flash('error', 'Something went wrong');

        res.redirect('/register');

    }

});

/* =========================
   LOGIN PAGE
========================= */

router.get('/login', (req, res) => {

    res.render('auth/login');

});

/* =========================
   LOGIN USER
========================= */

router.post('/login', async (req, res) => {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {

        req.flash('error', 'Invalid Email');

        return res.redirect('/login');

    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {

        req.flash('error', 'Invalid Password');

        return res.redirect('/login');

    }

    req.session.user = user;

    req.flash('success', `Welcome back ${user.name}`);

    if (user.role === 'admin') {

        return res.redirect('/admin');

    }

    res.redirect('/products');

});

/* =========================
   LOGOUT
========================= */

router.get('/logout', (req, res) => {

    req.session.destroy(() => {

        res.redirect('/login');

    });

});

module.exports = router;