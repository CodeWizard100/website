const express = require('express');
const fs = require('fs'); // Import fs to handle file operations
const cors = require('cors'); // Import CORS for cross-origin requests
const app = express();
const port = process.env.PORT || 3000;



// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies

app.get('/', (req, res) => {
    res.send("Invalid Request");
});

// Handle registration and login in the same POST request
app.post('/', async (req, res) => {
    const { name, password, type } = req.body; // Extract name, password, and type from request body

    // Construct the URL for the player's JSON file
    const playersFilePath = `${process.env.link}Players.json`;

    try {
        // Initialize players data
        let playersData = {};

        // Read existing players data
        if (fs.existsSync(playersFilePath)) {
            const data = fs.readFileSync(playersFilePath);
            playersData = JSON.parse(data); // Parse existing players data
        }

        if (type === 'register') {
            // Check if the user already exists
            if (playersData[name]) {
                return res.status(500).send('User already exists'); // Internal Server Error if user exists
            }

            // Add new user
            playersData[name] = {
                password: password,
                cash: 0, // Default cash
                token: '', // Default token
            };

            // Write updated players data to the file
            fs.writeFileSync(playersFilePath, JSON.stringify(playersData, null, 2)); // Save with pretty print
            return res.send('User registered successfully!'); // Successful registration
        } else if (type === 'login') {
            // Validate the password
            if (playersData[name] && playersData[name].password === password) {
                return res.send('Login successful!'); // Password matches
            } else {
                return res.status(401).send('Invalid password'); // Password does not match
            }
        } else {
            return res.status(400).send('Invalid request type'); // Invalid request type
        }
    } catch (error) {
        console.error('Error processing request:', error);
        return res.status(500).send('Failed to process request'); // Handle other errors
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
