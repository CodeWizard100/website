const express = require('express');
const axios = require('axios'); // Import axios for making HTTP requests
const cors = require('cors'); // Import CORS for cross-origin requests
const fs = require('fs'); // Import file system module to work with file system
const path = require('path'); // Import path module to handle file paths

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies

app.get('/', (req, res) => {
    res.send("Invalid Request");
});

// Route for handling user registration and login
app.put('/', async (req, res) => {
    const { name, password, type } = req.body; // Extract name, password, and type from request body

    // Construct the URL for the players' JSON file
    const playersFilePath = `${process.env.link}Players.json`;

    try {
        // Read existing players data
        let playersData = [];
        if (fs.existsSync(playersFilePath)) {
            const data = fs.readFileSync(playersFilePath);
            playersData = JSON.parse(data); // Parse existing players data
        }

        if (type === 'register') {
            // Check if the user already exists
            const existingUserIndex = playersData.findIndex(player => player.name === name);
            if (existingUserIndex !== -1) {
                return res.status(500).send('User already exists'); // User already exists
            }

            // Create a new player object with an empty token and initial cash
            const newPlayer = {
                name,
                password,
                cash: 0, // Initialize cash to 0
                token: '' // Initialize token to an empty string
            };

            // Add new player to the players array
            playersData.push(newPlayer);

            // Write updated players data back to the JSON file
            fs.writeFileSync(playersFilePath, JSON.stringify(playersData, null, 2)); // Save with pretty print

            return res.status(201).send('User registered successfully'); // Registration successful
        } else if (type === 'login') {
            // Login logic
            const player = playersData.find(player => player.name === name);
            if (!player) {
                return res.status(404).send('User does not exist'); // User does not exist
            }

            // Validate the password
            if (player.password === password) {
                return res.send('Success!'); // Password matches
            } else {
                return res.status(401).send('Invalid password'); // Password does not match
            }
        } else {
            return res.status(400).send('Invalid request type'); // Invalid type
        }
    } catch (error) {
        console.error('Error handling request:', error);
        return res.status(500).send('Internal Server Error'); // Handle other errors
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
