const express = require('express');
const cors = require('cors'); // Import CORS package
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // Parse JSON bodies

// Registration Route
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if the user already exists
        const response = await axios.get(`${process.env.link}/Players/${username}.json`);

        // If response data is not null, it means the user already exists
        if (response.data !== null) {
            return res.status(400).json({ message: 'User already exists!' });
        }

        // Register the new user
        await axios.put(`${process.env.link}/Players/${username}.json`, { password });

        return res.status(200).json({ message: 'User registered successfully!' });
    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({ message: 'Error registering user!' });
    }
});

// Login Route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if the user exists
        const response = await axios.get(`${process.env.link}/Players/${username}.json`);

        // If the user does not exist
        if (response.data === null) {
            return res.status(400).json({ message: 'User does not exist!' });
        }

        // Check if the password matches
        if (response.data.password !== password) {
            return res.status(400).json({ message: 'Incorrect password!' });
        }

        // Successful login
        return res.status(200).json({ message: 'Login successful!' });
    } catch (error) {
        console.error('Error logging in user:', error);
        return res.status(500).json({ message: 'Error logging in user!' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
