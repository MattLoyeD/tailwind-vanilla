const fs = require("fs");
const path = require("path");
const tailwindVanilla = require("./tailwind-vanilla");

// Get command-line arguments
const args = process.argv.slice(2);

// Source directory containing HTML files (and subdirectories)
const inputDir = args[0] || path.join(__dirname, "tpl");

// Output directory for modified HTML files
const outputDir = args[1] || path.join(__dirname, "output");

// Function to generate a unique prefix based on the filename
function generatePrefix(filename) {
  return filename.replace(/[^a-z0-9]/gi, "_").toLowerCase();
}

// Function to process files recursively
function processDirectory(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    const relativePath = path.relative(inputDir, fullPath);
    const outputFilePath = path.join(outputDir, relativePath);

    // If it's a directory, process it recursively
    if (fs.statSync(fullPath).isDirectory()) {
      fs.mkdirSync(outputFilePath, { recursive: true });
      processDirectory(fullPath);
    } else if (path.extname(fullPath) === ".html") {
      // If it's an HTML file, generate the optimized CSS and include it
      const htmlContent = fs.readFileSync(fullPath, "utf8");
      const prefix = generatePrefix(path.basename(fullPath, ".html"));

      const content = tailwindVanilla(htmlContent, prefix);

      const newHtmlContent =
        content.html + `\n<style>\n${content.css}\n</style>`;
      fs.mkdirSync(path.dirname(outputFilePath), { recursive: true });
      fs.writeFileSync(outputFilePath, newHtmlContent, "utf8");
      console.log(`Processed: ${relativePath}`);
    }
  });
}

// Create the output directory if it doesn't exist
fs.mkdirSync(outputDir, { recursive: true });

// Process the source directory
processDirectory(inputDir);

console.log("Conversion completed.");
