let mongoose = require('mongoose');
let bcrypt = require('bcrypt');
let validator = require('validator');

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    fullName: { 
        type: String, 
        required: true,
        validate: {
            validator: function(v) {
                return /^[A-Za-z\s]+$/.test(v);
            },
            message: props => `${props.value} không hợp lệ! Chỉ được chứa chữ.`
        }
    },
    avatarUrl: { 
        type: String, 
        validate: {
            validator: function(v) {
                return validator.isURL(v);
            },
            message: props => `${props.value} không phải là URL hợp lệ!`
        }
    },  
    status: { type: Boolean, default: false },
    loginCount: { type: Number, default: 0, min: 0 },
    role: {
        type: mongoose.Types.ObjectId,
        ref: 'role'
    }
}, {
    timestamps: true
});