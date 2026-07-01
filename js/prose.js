/* ============================================================================
   aesthetecoding.io — ARTICLE behaviours
   - code-block copy buttons
   - heading anchor links (hover ¶)
   - rough-notation animated annotations ([data-rough]) — progressive enhancement
     · frozen in eco mode / prefers-reduced-motion (static CSS fallback instead)
     · uses the self-hosted js/vendor/sketch-annotate.js (window.RoughNotation).
       Page works without it (CSS fallback).
   ========================================================================== */
(function () {
  "use strict";
  var root = document.querySelector(".acx") || document.body;

  /* ---- code copy buttons ------------------------------------------------- */
  root.querySelectorAll(".codeblock").forEach(function (block) {
    var btn = block.querySelector(".codeblock__copy");
    var pre = block.querySelector("pre");
    if (!btn || !pre) return;
    btn.addEventListener("click", function () {
      var text = pre.innerText;
      navigator.clipboard.writeText(text).then(function () {
        var prev = btn.textContent;
        btn.textContent = "Copied"; btn.classList.add("copied");
        setTimeout(function () { btn.textContent = prev; btn.classList.remove("copied"); }, 1400);
      });
    });
  });

  /* ---- heading anchors --------------------------------------------------- */
  root.querySelectorAll(".read .col h2[id], .read .col h3[id]").forEach(function (h) {
    var a = document.createElement("a");
    a.className = "anchor"; a.href = "#" + h.id; a.textContent = "#";
    a.setAttribute("aria-label", "Link to this section");
    h.prepend(a);
  });

  /* ---- rough-notation ---------------------------------------------------- */
  var COLORS = { amber: "#efa23c", green: "#37a14f", blue: "#1f9be0", red: "#e23b2e" };
  var nodes = [].slice.call(root.querySelectorAll("[data-rough]"));
  if (!nodes.length) return;

  // prefers-reduced-motion is a persistent OS setting → static fallback, no lib
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    nodes.forEach(function (n) { n.classList.add("rough-fallback"); });
    return;
  }

  function ecoOn() { return root.getAttribute("data-eco") === "on"; }

  // self-hosted annotator (js/vendor/sketch-annotate.js). If absent, CSS fallback.
  var RN = window.RoughNotation;
  if (!RN || !RN.annotate) {
    nodes.forEach(function (n) { n.classList.add("rough-fallback"); });
    return;
  }
  (function () {
      var annotate = RN.annotate;
      var drawn = new Map();   // el -> annotation instance
      var io = null;

      function makeAnn(n, animate) {
        var type = n.dataset.rough || "underline";
        return annotate(n, {
          type: type,
          color: COLORS[n.dataset.roughColor] || COLORS.amber,
          strokeWidth: 2, padding: type === "highlight" ? 2 : 4,
          multiline: true, animationDuration: animate ? 700 : 0, iterations: 2
        });
      }
      function draw(n) {
        if (drawn.has(n)) return;
        try {
          var a = makeAnn(n, true);
          a.show();
          drawn.set(n, a);
          if ((n.dataset.rough || "") === "highlight") n.classList.add("rough-hl"); // dark text on marker
        } catch (e) {
          n.classList.add("rough-fallback");
        }
      }
      // font-size / theme reflows text → remove + redraw (re-measures geometry, no re-animate)
      function redraw() {
        drawn.forEach(function (a, n) {
          a.remove();
          var na = makeAnn(n, false);
          na.show();
          drawn.set(n, na);
        });
      }
      function startIO() {
        io = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting) { draw(e.target); io.unobserve(e.target); }
          });
        }, { threshold: 0.85 });
        nodes.forEach(function (n) { io.observe(n); });
      }
      function clearAll() {
        if (io) { nodes.forEach(function (n) { io.unobserve(n); }); io = null; }
        drawn.forEach(function (a, n) { a.remove(); n.classList.remove("rough-hl"); });
        drawn.clear();
      }

      if (ecoOn()) nodes.forEach(function (n) { n.classList.add("rough-fallback"); });
      else startIO();

      // react to state changes on the root element
      new MutationObserver(function (muts) {
        var ecoChanged = false, reflow = false;
        muts.forEach(function (m) { if (m.attributeName === "data-eco") ecoChanged = true; else reflow = true; });

        if (ecoChanged) {
          if (ecoOn()) {                       // eco ON → drop SVGs, show CSS fallback
            clearAll();
            nodes.forEach(function (n) { n.classList.add("rough-fallback"); });
          } else {                             // eco OFF → restore drawn annotations
            nodes.forEach(function (n) { n.classList.remove("rough-fallback"); });
            startIO();
          }
        }
        // font-size or theme change → redraw at the new geometry once layout settles
        if (reflow && !ecoOn()) {
          requestAnimationFrame(function () {
            requestAnimationFrame(redraw);
          });
        }
      }).observe(root, { attributes: true, attributeFilter: ["data-font", "data-theme", "data-eco"] });
  })();
})();
