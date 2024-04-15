const Admin = require('../models/Admin');
const mongoose = require('mongoose');
const jwt=require('jsonwebtoken');
const JWT_SECRET="Gcd19140"
const bcrypt = require('bcrypt');

exports.getRoutes = (req, res) => {
    res.send('test admin');
};

exports.createAdmin = async (req, res) => {
    const { name, email, mobile, password } = req.body;

    try {
        const oldAdmin = await Admin.findOne({ email: email});

        if (oldAdmin) {
            return res.send({ error: "User Already Exist" });
        }

        const encryptedPassword = await bcrypt.hash(password, 10); 

        try {
            await Admin.create({ 
                name: name, 
                email: email, 
                mobile,
                password: encryptedPassword,
            });
            res.send({ message: "User Created Successfully" });
        } catch (error) {
            console.error("Error occurred while processing request:", error);
            res.send({ status: "error", data: error });
        }
    } catch (error) {
        console.error("Error occurred while processing request:", error);
        res.send({ status: "error", data: error });
    }
};
// login user
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const oldAdmin = await Admin.findOne({ email: email });

        if (!oldAdmin) {
            return res.send({ error: "User does not exist" });
        }

        if (await bcrypt.compare(password, oldAdmin.password)) {
            const token = jwt.sign({ email: oldAdmin.email }, JWT_SECRET);
            console.log(token);

            return res.status(201).send({
                message: "Login Successfully",
                data: token,
                userType: oldAdmin.userType
            });
        } else {
            return res.send({ error: "Password is not correct" });
        }
    } catch (error) {
        console.error("Error occurred while processing login request:", error);
        return res.status(500).send({ error: "Internal Server Error" });
    }
};
