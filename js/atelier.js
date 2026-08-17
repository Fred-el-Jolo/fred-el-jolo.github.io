/* ============================================================================
   aesthetecoding.io — "Atelier Synthesis" behaviour
   - theme / font-size / eco toggles (persisted to localStorage)
   - rotating masthead punchline (frozen in eco / reduced-motion)
   - tag filter on the post list
   The page renders fully without this file; JS only enhances.
   ========================================================================== */
(function () {
  "use strict";
  var root = document.querySelector(".acx") || document.body;
  var store = window.localStorage;

  /* ---- persisted preferences -------------------------------------------- */
  var KEY = { theme: "acx-theme", font: "acx-font", eco: "acx-eco" };

  function apply(attr, val) { if (val) root.setAttribute("data-" + attr, val); }

  // restore (boot snippet in <head> already set theme to avoid flash; re-affirm all)
  apply("theme", store.getItem(KEY.theme));
  apply("font",  store.getItem(KEY.font));
  apply("eco",   store.getItem(KEY.eco));

  /* ---- toggle wiring (event delegation) --------------------------------- */
  root.addEventListener("click", function (e) {
    var btn = e.target.closest("button");
    if (!btn) return;

    // theme segment
    var themeBtn = btn.closest(".seg.theme") ? btn : null;
    if (themeBtn && themeBtn.dataset.v) {
      root.setAttribute("data-theme", themeBtn.dataset.v);
      store.setItem(KEY.theme, themeBtn.dataset.v);
      syncPressed(".seg.theme", themeBtn);
      return;
    }
    // font segment
    if (btn.closest(".seg.font") && btn.dataset.v) {
      root.setAttribute("data-font", btn.dataset.v);
      store.setItem(KEY.font, btn.dataset.v);
      syncPressed(".seg.font", btn);
      return;
    }
    // eco leaf
    if (btn.classList.contains("leaf")) {
      var on = root.getAttribute("data-eco") !== "on";
      root.setAttribute("data-eco", on ? "on" : "off");
      store.setItem(KEY.eco, on ? "on" : "off");
      btn.setAttribute("aria-pressed", on ? "true" : "false");
      return;
    }
  });

  function syncPressed(groupSel, active) {
    root.querySelectorAll(groupSel + " button").forEach(function (b) {
      b.setAttribute("aria-pressed", b === active ? "true" : "false");
    });
  }
  // initialise aria-pressed from current state
  ["theme", "font"].forEach(function (g) {
    var cur = root.getAttribute("data-" + g);
    root.querySelectorAll(".seg." + g + " button").forEach(function (b) {
      b.setAttribute("aria-pressed", b.dataset.v === cur ? "true" : "false");
    });
  });
  var leaf = root.querySelector(".leaf");
  if (leaf) leaf.setAttribute("aria-pressed", root.getAttribute("data-eco") === "on" ? "true" : "false");

  /* ---- rotating punchline ----------------------------------------------- */
  var MODES = {
    fade:  { out: ["-0.35em", 220], in: ["0.4em", 300],  every: 2600 },
    fast:  { out: ["-0.2em", 110],  in: ["0.25em", 150], every: 2200 },
    slide: { out: ["-1em", 260],    in: ["1em", 320],    every: 2600 }
  };
  function initPunchline() {
    var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    root.querySelectorAll(".punch").forEach(function (punch) {
      var rots = [].slice.call(punch.querySelectorAll(".rot"));
      if (!rots.length) return;
      var sets = rots.map(function (r) { return (r.dataset.words || "").split("|"); });
      var m = MODES[punch.dataset.mode] || MODES.fade;
      if (root.getAttribute("data-eco") === "on" || reduce) return; // hold first word
      var i = 0;
      setInterval(function () {
        i = (i + 1) % sets[0].length;
        rots.forEach(function (r, k) {
          var w = r.querySelector(".w");
          var out = w.animate(
            [{ opacity: 1, transform: "translateY(0)" }, { opacity: 0, transform: "translateY(" + m.out[0] + ")" }],
            { duration: m.out[1], easing: "cubic-bezier(.4,0,.2,1)", fill: "forwards" }
          );
          out.onfinish = function () {
            w.textContent = sets[k][i];
            w.animate(
              [{ opacity: 0, transform: "translateY(" + m.in[0] + ")" }, { opacity: 1, transform: "translateY(0)" }],
              { duration: m.in[1], easing: "cubic-bezier(.4,0,.2,1)", fill: "forwards" }
            );
          };
        });
      }, m.every);
    });
  }
  initPunchline();

  /* ---- tag filter -------------------------------------------------------- */
  var rows = [].slice.call(root.querySelectorAll(".list .row"));
  var feat = root.querySelector(".feat-wrap");           // featured card filters too
  var entries = rows.slice();
  if (feat) entries.push(feat);
  var countChip = root.querySelector(".sec .ct");         // "N articles" reflects the filter
  var emptyMsg = root.querySelector(".list-empty");       // shown when nothing matches

  function applyFilter(tag) {
    tag = (tag || "all").toLowerCase();
    var n = 0;
    entries.forEach(function (el) {
      var cats = (el.dataset.cat || "").toLowerCase();
      var show = tag === "all" || cats.split(",").indexOf(tag) !== -1;
      el.style.display = show ? "" : "none";
      if (show) n++;
    });
    if (countChip) countChip.textContent = n + (n === 1 ? " article" : " articles");
    if (emptyMsg) emptyMsg.classList.toggle("on", n === 0);
  }

  // chip-style filter bar (if present)
  var filter = root.querySelector(".filter");
  if (filter) {
    filter.addEventListener("click", function (e) {
      var chip = e.target.closest(".chip");
      if (!chip) return;
      filter.querySelectorAll(".chip").forEach(function (c) { c.classList.toggle("on", c === chip); });
      applyFilter(chip.dataset.tag);
    });
  }

  // masthead topics rail acts as the filter: click to filter, click again to clear
  var topics = root.querySelector(".mast-topics");
  if (topics && rows.length) {
    var current = null;
    topics.addEventListener("click", function (e) {
      var link = e.target.closest("a[data-tag]");
      if (!link) return;
      e.preventDefault();
      var tag = link.dataset.tag;
      var clearing = current === link;
      topics.querySelectorAll("a").forEach(function (a) { a.classList.remove("on"); });
      if (clearing) { current = null; applyFilter("all"); return; }
      link.classList.add("on");
      link.setAttribute("aria-current", "true");
      topics.querySelectorAll("a").forEach(function (a) { if (a !== link) a.removeAttribute("aria-current"); });
      current = link;
      applyFilter(tag);
    });
  }

  /* ---- cover images: "use specific if it exists, else fall back" ---------
     Point a slot at its specific image (featured / list) and give it a
     data-fallback (usually the required cover). If the specific file 404s,
     the image quietly swaps to the fallback — one wide cover per post is
     enough; specific crops are purely optional. ------------------------- */
  root.querySelectorAll(".cover-img[data-fallback]").forEach(function (img) {
    function onErr() {
      img.removeEventListener("error", onErr);
      if (img.dataset.fallback && img.getAttribute("src") !== img.dataset.fallback) {
        img.src = img.dataset.fallback;         // try the cover
      } else {
        img.style.display = "none";             // even cover missing → striped placeholder shows
      }
    }
    img.addEventListener("error", onErr);
    if (img.complete && img.naturalWidth === 0) onErr(); // already failed before JS ran
  });
})();
