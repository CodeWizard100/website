const express = require('express');
const cors = require('cors'); // Import CORS package
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // Parse JSON bodies

// Function to generate a random token
function generateToken(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < length; i++) {
        token += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return token;
}

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

        // Register the new user with additional fields
        const newUser = {
            password,
            isPlaying: false,  // New field for isPlaying
            token: "",         // New field for token
            money: 0           // Initialize money to 0
        };

        await axios.put(`${process.env.link}/Players/${username}.json`, newUser);

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
        return res.status(200).json({ message: 'Login successful!', token: response.data.token });
    } catch (error) {
        console.error('Error logging in user:', error);
        return res.status(500).json({ message: 'Error logging in user!' });
    }
});

// Add Cash Route
app.post('/addcash', async (req, res) => {
    const { username, password, token, subCash, money } = req.body;

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

        // Check if the token matches
        if (response.data.token !== token) {
            return res.status(400).json({ message: 'Invalid token!' });
        }

        // Update the money based on subCash
        let updatedMoney = response.data.money;
        if (subCash) {
            updatedMoney -= money; // Subtract money
        } else {
            updatedMoney += money; // Add money
        }

        // Update the user's money in Firebase
        await axios.patch(`${process.env.link}/Players/${username}.json`, { money: updatedMoney });

        return res.status(200).json({ message: 'Cash updated successfully!', newBalance: updatedMoney });
    } catch (error) {
        console.error('Error adding cash:', error);
        return res.status(500).json({ message: 'Error adding cash!' });
    }
});

// Generate New Token Route
app.post('/generatenewtoken', async (req, res) => {
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

        // Generate a new token
        const newToken = generateToken(20);

        // Update the user's token in Firebase
        await axios.patch(`${process.env.link}/Players/${username}.json`, { token: newToken });

        return res.status(200).json({ message: 'Token generated successfully!', token: newToken });
    } catch (error) {
        console.error('Error generating new token:', error);
        return res.status(500).json({ message: 'Error generating new token!' });
    }
});

// Get Cash Route
app.post('/getcash', async (req, res) => {
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

        // Return the user's money
        const money = response.data.money;
        return res.status(200).json({ message: 'Cash retrieved successfully!', money });
    } catch (error) {
        console.error('Error retrieving cash:', error);
        return res.status(500).json({ message: 'Error retrieving cash!' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
