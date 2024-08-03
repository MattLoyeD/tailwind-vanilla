function tailwindVanilla(htmlContent, withPrefix = false) {
  // Read the base CSS file
  const baseCss = fs.readFileSync(
    path.join(__dirname, "dist/styles.css"),
    "utf8"
  );

  var prefix = "";
  var prefixerOptions = {};

  if (withPrefix) {
    if (typeof withPrefix !== "boolean") {
      prefix = withPrefix;
    } else {
      prefix = (str = "") => {
        if (str == "") {
          // generate random string
          str = "element-" + Math.random().toString(36).substring(5);
        }

        return str.replace(/[^a-z0-9]/gi, "_").toLowerCase();
      };
    }

    prefixerOptions = {
      prefix: `.${prefix}`,

      // Optional transform callback for case-by-case overrides
      transform: function (prefix, selector, prefixedSelector, filePath, rule) {
        if (selector === "body") {
          return "body" + prefix;
        } else {
          return prefixedSelector;
        }
      },
    };
  }

  postcss([
    tailwindcss,
    autoprefixer,
    purgecss({
      content: [fullPath],
      defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
    }),
  ])
    .process(baseCss, { from: undefined })
    .then((result) => {
      // use prefixer now
      var newHtmlContent = "";
      var optimizedCss = "";
      if (withPrefix) {
        optimizedCss = postcss([prefixer(prefixerOptions)]).process(
          result.css
        ).css;
        newHtmlContent = `<div class="${prefix}">\n${htmlContent}\n</div>`;
      } else {
        newHtmlContent = htmlContent;
        optimizedCss = result.css;
      }
      return {
        html: newHtmlContent,
        css: optimizedCss,
      };
    })
    .catch((error) => console.error(`Error processing:`, error));
}

// make it exportable
module.exports = tailwindVanilla;