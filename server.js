const express = require("express");
const bodyParser = require("body-parser");
const tailwindVanilla = require("./tailwind-vanilla");
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Endpoint POST /convert
app.post("/convert", async (req, res) => {
  const { html: htmlContent, withPrefix = false } = req.body;

  if (!htmlContent) {
    return res.status(400).json({ error: "No HTML content provided" });
  }

  try {
    const result = await tailwindVanilla(htmlContent, withPrefix);
    res.json(result);
  } catch (error) {
    console.error("Error processing HTML content:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
