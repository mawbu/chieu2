let User = require('../models/users');
let Role = require('../models/roles');
let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');
let constants = require('../Utils/constants');

module.exports = {
    getUserById: async function(id) {
        return await User.findById(id).populate("role");
    },
    createUser: async function(username, password, email, fullName, avatarUrl, role) {
        let roleCheck = await Role.findOne({ roleName: role });
        if (roleCheck) {
            let newUser = new User({
                username: username,
                password: password,
                email: email,
                fullName: fullName,
                avatarUrl: avatarUrl,
                role: roleCheck._id,
            });
            await newUser.save();
            return newUser;
        } else {
            throw new Error("Role không tồn tại");
        }
    },
    checkLogin: async function(username, password) {
        if (username && password) {
            let user = await User.findOne({ username: username });
            if (user) {
                if (bcrypt.compareSync(password, user.password)) {
                    return jwt.sign({
                        id: user._id,
                        expired: new Date(Date.now() + 30 * 60 * 1000)
                    }, constants.SECRET_KEY);
                } else {
                    throw new Error("Username hoặc password không đúng");
                }
            } else {
                throw new Error("Username hoặc password không đúng");
            }
        } else {
            throw new Error("Username hoặc password không đúng");
        }
    }
};
