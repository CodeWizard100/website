const express = require('express');
const app = express();
const port = process.env.PORT || 3000; // Use the PORT environment variable or default to 3000

app.get('/', (req, res) => {
  const secretValue = process.env.test; // Access the secret value
  res.send(`The secret value is: ${secretValue}`); // Respond with the secret value
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
