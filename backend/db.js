const { application } = require('express');
const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://Aryan:RnD141103@cluster0.ytfx5mx.mongodb.net/paytm");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    }
});

const adminSchema = new mongoose.Schema({
    username : {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30
    },
    password : {
        type: String,
        required: true,
        minLength: 6
    }

})

const applicationSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true
      },
      quantity: {
        type: Number,
        required: true
      },
      shipmentDate: {
        type: String,
        required: true
      }
});

const vendorSchema = new mongoose.Schema({
    username : {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30
    },
    password : {
        type: String,
        required: true,
        minLength: 6
    },
    application :[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Application',
        require: true
    }],
    verified : {
        type: Boolean
    },
    availability : {
        type: Number
    }
})


const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    balance: {
        type: Number,
        required: true
    },
    accountType: {
        type: String,
        enum: ['User', 'Vendor'], 
        required: true
    }
});

const Account = mongoose.model('Account', accountSchema);
const User = mongoose.model('User', userSchema);
const Admin = mongoose.model('Admin', adminSchema);
const Vendor = mongoose.model('Vendor', vendorSchema);
const Application = mongoose.model('Application', applicationSchema);

module.exports = {
	User,
    Account,
    Admin,
    Vendor,
    Application
};