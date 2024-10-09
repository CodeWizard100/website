const express = require('express');
const axios = require('axios'); // Import axios for making HTTP requests
const app = express();
const port = process.env.PORT || 3000;

app.get('/', async (req, res) => {
  try {
    const secretValue = process.env.test; // Access the secret value
    const playersUrl = `${process.env.link}Players.json`; // Construct the URL for the GET request
    const response = await axios.get(playersUrl); // Make the GET request to the constructed URL
    
    // Response data is an object with player names as keys
    const playersData = response.data;

    // Convert the players data object into an array of strings
    const playersText = Object.entries(playersData) // Convert object to an array of [key, value] pairs
      .map(([playerName, playerDetails]) => `${playerName} has ${playerDetails.cash} cash and their password is ${playerDetails.password}`)
      .join('\n');

    // Send the formatted player data as a response
    res.send(`Hi, the secret value is: ${secretValue}.\nPlayers data:\n${playersText}`);
  } catch (error) {
    console.error('Error fetching players data:', error); // Log any errors
    res.status(500).send('Error fetching players data'); // Send an error response
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
