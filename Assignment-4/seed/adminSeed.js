const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');

const Admin = require('../models/Admin');

mongoose.connect('mongodb://127.0.0.1:27017/krogerDB');

async function createAdmin() {

    const hashedPassword = await bcrypt.hash('admin123', 10);

    const admin = new Admin({

        email: 'admin@gmail.com',

        password: hashedPassword

    });

    await admin.save();

    console.log('Admin Created');

    mongoose.connection.close();

}

createAdmin();