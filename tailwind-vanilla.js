const fs = require("fs");
const path = require("path");
const postcss = require("postcss");
const tailwindcss = require("tailwindcss");
const autoprefixer = require("autoprefixer");
const purgecss = require("@fullhuman/postcss-purgecss");
const prefixer = require("postcss-prefix-selector");

async function tailwindVanilla(htmlContent, withPrefix = false) {
  let prefix = "";
  let prefixerOptions = {};

  if (withPrefix) {
    if (typeof withPrefix !== "boolean") {
      prefix = withPrefix;
    } else {
      prefix = (str = "") => {
        if (str === "") {
          // generate random string
          str = "element-" + Math.random().toString(36).substring(5);
        }
        return str.replace(/[^a-z0-9]/gi, "_").toLowerCase();
      };
    }

    prefixerOptions = {
      prefix: `.${prefix}`,
      transform: function (prefix, selector, prefixedSelector, filePath, rule) {
        if (selector === "body") {
          return "body" + prefix;
        } else {
          return prefixedSelector;
        }
      },
    };
  }

  const outputDir = path.join(__dirname, "output");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  const tmpHtmlPath = path.join(outputDir, "temp.html");
  const tmpCssPath = path.join(outputDir, "temp.css");

  // Write the current HTML into a temporary file to be used by purgecss
  fs.writeFileSync(tmpHtmlPath, htmlContent, "utf8");

  const baseCssContent = `
    @tailwind components;
    @tailwind utilities;
  `;

  // Create temporary CSS extract from the HTML
  const result = await postcss([
    tailwindcss,
    autoprefixer,
    purgecss({
      content: [tmpHtmlPath],
      defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
    }),
  ]).process(baseCssContent, { from: tmpHtmlPath });

  fs.writeFileSync(tmpCssPath, result.css, "utf8");

  let newHtmlContent = "";
  let optimizedCss = fs.readFileSync(tmpCssPath, "utf8");

  if (withPrefix) {
    optimizedCss = await postcss([prefixer(prefixerOptions)])
      .process(optimizedCss, { from: undefined })
      .then((result) => result.css);
    newHtmlContent = `<div class="${prefix}">\n${htmlContent}\n</div>`;
  } else {
    newHtmlContent = htmlContent;
  }

  fs.unlinkSync(tmpHtmlPath);
  fs.unlinkSync(tmpCssPath);

  return {
    html: newHtmlContent,
    css: optimizedCss,
  };
}

module.exports = tailwindVanilla;
