const express = require('express');
const app = express();
const port = process.env.PORT || 3000; // Use the PORT environment variable or default to 3000

app.get('/', (req, res) => {
  res.send('Hi!'); // Respond with "Hi!" when the root URL is accessed
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
