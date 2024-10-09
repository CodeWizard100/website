const express = require('express');
const axios = require('axios');
const fs = require('fs'); // For file system operations (if needed)
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // Middleware to parse JSON bodies

// Login route
app.post('/', async (req, res) => {
  const { username, password } = req.body; // Get username and password from request body

  if (!username || !password) {
    return res.status(400).send('Username and password are required.');
  }

  const playerPath = `${process.env.link}Players/${username}.json`; // Construct player file path

  try {
    // Check if the player file exists
    const response = await axios.get(playerPath);
    const playerData = response.data;

    // Check if the password matches
    if (playerData.password === password) {
      return res.send('Success!');
    } else {
      return res.status(401).send('Invalid password.');
    }
  } catch (error) {
    // Handle different error scenarios
    if (error.response && error.response.status === 404) {
      return res.status(404).send('User not found.');
    }
    console.error('Error fetching player data:', error);
    return res.status(500).send('Internal server error.');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
