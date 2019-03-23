// More info about config & dependencies:
// - https://github.com/hakimel/reveal.js#configuration
// - https://github.com/hakimel/reveal.js#dependencies

// Shows the slide number using default formatting
Reveal.configure({ slideNumber: true });

Reveal.initialize({
  dependencies: [
    {
      src: "/assets/revealjs/plugin/highlight/highlight.js",
      async: true,
      callback: function () {
        hljs.initHighlightingOnLoad();
      }
    },
    { src: "/assets/revealjs/plugin/notes/notes.js", async: true },
    {
      src: "/assets/revealjs/plugin/highlight/highlight.js",
      async: true,
      callback: function () {
        hljs.initHighlightingOnLoad();
      }
    }
  ]
});
