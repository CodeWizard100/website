const express = require('express');
const axios = require('axios'); // Import axios for making HTTP requests
const fs = require('fs'); // Import fs for file system operations
const cors = require('cors'); // Import CORS for cross-origin requests
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies

app.post('/', async (req, res) => {
  const { name, password } = req.body; // Extract name and password from request body

  const playerFilePath = `${process.env.link}Players/${name}.json`; // Construct the file path for the player's JSON file

  // Check if the player's file exists
  if (fs.existsSync(playerFilePath)) {
    const playerData = JSON.parse(fs.readFileSync(playerFilePath, 'utf-8')); // Read and parse the player's data

    // Validate the password
    if (playerData.password === password) {
      return res.send('Success!'); // Password matches
    } else {
      return res.status(401).send('Invalid password'); // Password does not match
    }
  } else {
    return res.status(404).send(`${playerFilePath}`); // User file does not exist
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
