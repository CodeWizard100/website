const express = require('express');
const axios = require('axios'); // Import axios for making HTTP requests
const app = express();
const port = process.env.PORT || 3000;

app.get('/', async (req, res) => {
  try {
    const secretValue = process.env.test; // Access the secret value
    const playersUrl = `${process.env.link}Players.json`; // Construct the URL for the GET request
    const response = await axios.get(playersUrl); // Make the GET request to the constructed URL
    
    // Assume the response data is an array of player objects
    const players = response.data;

    // Format the player data into a string
    const playersText = players.map(player => `${player.name} has a cash ${player.casg}`).join('\n');

    // Send the formatted player data as a response
    res.send(`Hi!.\nPlayers data:\n${playersText}`);
  } catch (error) {
    console.error('Error fetching players data:', error); // Log any errors
    res.status(500).send('Error fetching players data'); // Send an error response
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
