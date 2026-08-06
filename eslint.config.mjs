import js from "@eslint/js";

// Lint the site's own JS source only (personal.js). The minified files are
// generated, and plugins.js is third-party.
export default [
  js.configs.recommended,
  {
    files: ["docs/js/personal.js"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "script",
      globals: {
        window: "readonly",
        document: "readonly",
        console: "readonly",
        navigator: "readonly",
        location: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        requestAnimationFrame: "readonly",
        Event: "readonly",
        getComputedStyle: "readonly",
        Set: "readonly",
        // Libraries loaded globally by the theme
        $: "readonly",
        jQuery: "readonly",
        History: "readonly",
        Waypoint: "readonly",
        imagesLoaded: "readonly",
        Masonry: "readonly",
        hcaptcha: "readonly"
      }
    },
    rules: {
      // Unused vars are errors; the one intentional unused catch binding
      // (ES5-safe `catch (e)`) carries an explicit eslint-disable-line comment.
      "no-unused-vars": "error",
      "no-undef": "error"
    }
  }
];
