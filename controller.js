// src/controllers/authController.js
const { admin, db } = require('./firebase');
// const { generateToken } = require('../utils');
// const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { generateToken } = require('./utils');

const signup = async (req, res) => {

    try {
        const { username, email, password } = req.body;
        console.log(" username, email, password :", req.body);

        // Check if required parameters are missing
        if (!username || !email || !password) {
            res.status(403);
            res.json(`Required parameters missing, example request body: { username: "abc username", email: "abc email", password: "abc password" }`);
            return;
        }

        req.body.email = req.body.email.toLowerCase();

        // // Check if email is already registered
        // const userExists = await admin.auth().getUserByEmail(email);
        // console.log("userExists :", userExists);
        // if (userExists) {
        //     return res.json(400).send('Email address is already in use');
        // }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds); // 10 is the salt rounds
        console.log("hashedPassword :", hashedPassword);

        const userRecord = await admin.auth().createUser({
            displayName: username, // Add displayName property
            email,
            password
        });

        console.log("userRecord :", userRecord);

        const collection = await db.collection('users').doc(userRecord.uid).set({ email });
        console.log("collection :", collection);


        const token = generateToken(userRecord.uid);
        console.log("Register token :", token);

        res.status(201).json({
            message: "Register successful",
            token,
            user: {
                userId: userRecord.uid,
                username: userRecord.displayName,
                email: userRecord.email,
                password: userRecord.password, // Include password in response
            },
        });
    } catch (error) {
        console.error('User create karne mein error:', error);
        res.status(500).send('User create karne mein error');
    }
};

// const login = async (req, res) => {

//     try {
//         const { email, password } = req.body;
//         console.log("email, password :", req.body);


//         if (!email || !password) {
//             res.status(403);
//             res.json(`required parameters missing, 
//                           example request body:
//                       {
//                           email: "abc email"
//                           password: "abc password"
//                       } `);
//             return;
//         }

//         req.body.email = req.body.email.toLowerCase();

//         const userRecord = await admin.auth().getUserByEmail(email);
//         console.log("userRecord :", userRecord);

//         // const credential = admin.auth.EmailAuthProvider.credential(email, password);
//         // await admin.auth().signInWithCredential(credential);

//         const token = generateToken(userRecord.uid);
//         console.log("login token :", token);

//         res.status(200).json({ message: "Login Successfull", token });
//     } catch (error) {
//         console.error('Login karne mein error:', error);
//         res.status(401).send('Invalid credentials');
//     }
// };


const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("email, password :", req.body);

        if (!email || !password) {
            res.status(403);
            res.json(`Required parameters missing, example request body: { email: "abc email", password: "abc password" }`);
            return;
        }

        req.body.email = req.body.email.toLowerCase();

        const userRecord = await admin.auth().getUserByEmail(email);
        console.log("userRecord :", userRecord);

        // Authenticate user with Firebase
        admin.auth().signInWithEmailAndPassword(email, password)
            .then(async (userCredential) => {
                const user = userCredential.user;
                console.log("User logged in:", user);

                // Generate token
                const token = generateToken(user.uid);
                console.log("Login token :", token);

                res.status(200).json({ message: "Login Successful", token });
            })
            .catch((error) => {
                console.error('Firebase authentication error:', error);
                res.status(401).send('Invalid credentials');
            });
    } catch (error) {
        console.error('Login karne mein error:', error);
        res.status(500).send('Internal Server Error');
    }
};


module.exports = { signup, login };
