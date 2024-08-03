const express = require("express");
const bodyParser = require("body-parser");
const tailwindVanilla = require("./tailwind-vanilla");
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Endpoint POST /convert
app.post("/convert", (req, res) => {
  const htmlContent = req.body.html;
  const withPrefix = req.body.withPrefix || false;

  if (!htmlContent) {
    return res.status(400).json({ error: "No HTML content provided" });
  }

  const result =  tailwindVanilla(htmlContent, withPrefix);

  res.json(result);
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
