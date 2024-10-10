// app.js

const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from 'public' directory

const DATABASE_URL = process.env.link; // Your Firebase Database URL

// Register User
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if user already exists
        const userRef = `${DATABASE_URL}/${username}.json`;
        const response = await axios.get(userRef);

        // Check if the response data is "null"
        if (response.data === null) {
            // Register the user by adding the password
            await axios.put(userRef, { password });
            return res.status(200).json({ message: 'User registered successfully!' });
        } else {
            return res.status(400).json({ message: 'User already exists!' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error registering user: ' + error.message });
    }
});

// Login User
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if user exists
        const userRef = `${DATABASE_URL}/${username}.json`;
        const response = await axios.get(userRef);

        // Check if the response data is "null"
        if (response.data === null) {
            return res.status(400).json({ message: 'User does not exist!' });
        }

        const userData = response.data;
        if (userData.password !== password) {
            return res.status(401).json({ message: 'Failed to login!' });
        }

        res.status(200).json({ message: 'Login successful!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error logging in: ' + error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
