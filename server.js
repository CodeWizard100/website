const express = require('express');
const axios = require('axios'); // Import axios for making HTTP requests
const cors = require('cors'); // Import CORS for cross-origin requests
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies

app.get('/', (req, res) => {
    res.send("Invalid Request");
})

app.post('/', async (req, res) => {
  const { name, password } = req.body; // Extract name and password from request body

  // Construct the URL for the player's JSON file
  const playerFilePath = `${process.env.link}Players/${name}.json`;

  try {
    // Make a GET request to fetch the player's data
    const response = await axios.get(playerFilePath);
    const playerData = response.data; // Extract the player data from the response

    // Validate the password
    if (playerData.password === password) {
      return res.send('Success!'); // Password matches
    } else {
      return res.status(401).send('Invalid password'); // Password does not match
    }
  } catch (error) {
    // Handle errors, such as 404 Not Found
    if (error.response && error.response.status === 404) {
      return res.status(404).send('User does not exist'); // User file does not exist
    }
    console.error('Error fetching player data:', error);
    return res.status(500).send('Failed To Find User'); // Handle other errors
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
