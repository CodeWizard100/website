const express = require('express');
const axios = require('axios'); // Import axios for making HTTP requests
const fs = require('fs'); // Import fs to check if files exist
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

app.post('/login', async (req, res) => {
  const { name, password } = req.body; // Get name and password from the request body

  if (!name || !password) {
    return res.status(400).send('Name and password are required.'); // Handle missing parameters
  }

  try {
    // Construct the URL for the player's JSON file
    const playerFileUrl = `${process.env.link}Players/${name}.json`;

    // Check if the player's file exists
    const playerResponse = await axios.get(playerFileUrl);

    if (playerResponse.status !== 200) {
      return res.status(404).send('User not found.'); // If the user does not exist
    }

    const playerData = playerResponse.data; // Get the player data from the response

    // Check if the password matches
    if (playerData.password !== password) {
      return res.status(401).send('Invalid password.'); // If the password does not match
    }

    // If everything is successful
    res.send('Success!'); // Respond with success message
  } catch (error) {
    if (error.response && error.response.status === 404) {
      // If the player's file is not found, respond accordingly
      return res.status(404).send('User not found.');
    }

    console.error('Error fetching player data:', error); // Log any other errors
    res.status(500).send('Internal server error.'); // Send a generic error response
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
