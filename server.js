const express = require('express');
const axios = require('axios'); // Import axios for making HTTP requests
const app = express();
const port = process.env.PORT || 3000; // Use the PORT environment variable or default to 3000

app.get('/', async (req, res) => {
  try {
    const secretValue = process.env.test; // Access the secret value
    const playersUrl = `${process.env.link}Players.json`; // Construct the URL for the GET request
    const response = await axios.get(playersUrl); // Make the GET request to the constructed URL

    // Send the fetched data as a response
    res.send(`Hi, Players data: ${JSON.stringify(response.data)}`);
  } catch (error) {
    console.error('Error fetching players data:', error); // Log any errors
    res.status(500).send('Error fetching players data'); // Send an error response
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
