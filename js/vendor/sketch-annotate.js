/* ============================================================================
   sketch-annotate.js  —  self-contained hand-drawn text annotations
   ----------------------------------------------------------------------------
   ORIGINAL, dependency-free implementation written for aesthetecoding.io so the
   site has ZERO third-party requests. It is NOT the npm "rough-notation" package
   — it just exposes the same small surface prose.js uses:

       var a = RoughNotation.annotate(el, {
         type, color, strokeWidth, padding, multiline, animationDuration, iterations
       });
       a.show();   // draw (animated if animationDuration > 0)
       a.remove(); // erase

   Supported types: underline · strikethrough · box · circle · bracket · highlight
   Each stroke is drawn with a little per-point jitter + a doubled pass, which is
   what gives roughjs its hand-drawn character. Annotations are SVGs appended to
   <body> in page coordinates, so they scroll with content and never affect layout.
   ========================================================================== */
(function () {
  "use strict";
  var SVGNS = "http://www.w3.org/2000/svg";

  function rnd(j) { return (Math.random() * 2 - 1) * j; }

  // a sketchy line from (x1,y1)->(x2,y2): cubic with two jittered control points
  function linePath(x1, y1, x2, y2, j) {
    var mx1 = x1 + (x2 - x1) / 3, mx2 = x1 + 2 * (x2 - x1) / 3;
    var my1 = y1 + (y2 - y1) / 3, my2 = y1 + 2 * (y2 - y1) / 3;
    return "M " + (x1 + rnd(j)) + " " + (y1 + rnd(j)) +
           " C " + (mx1 + rnd(j * 1.6)) + " " + (my1 + rnd(j * 1.6)) +
           " "   + (mx2 + rnd(j * 1.6)) + " " + (my2 + rnd(j * 1.6)) +
           " "   + (x2 + rnd(j)) + " " + (y2 + rnd(j));
  }

  function mkPath(d, color, w, cap) {
    var p = document.createElementNS(SVGNS, "path");
    p.setAttribute("d", d);
    p.setAttribute("fill", "none");
    p.setAttribute("stroke", color);
    p.setAttribute("stroke-width", w);
    p.setAttribute("stroke-linecap", cap || "round");
    p.setAttribute("stroke-linejoin", "round");
    return p;
  }

  // build the list of <path> "d" strings for a given type within a w×h box
  function buildPaths(type, w, h, pad, j) {
    var d = [];
    var x0 = -pad, y0 = -pad, x1 = w + pad, y1 = h + pad;
    switch (type) {
      case "underline":
        d.push(linePath(0, h + pad, w, h + pad, j));
        d.push(linePath(w, h + pad + 1.5, 0, h + pad + 1.5, j)); // return pass
        break;
      case "strikethrough":
        d.push(linePath(0, h / 2, w, h / 2, j));
        d.push(linePath(w, h / 2 + 1, 0, h / 2 + 1, j));
        break;
      case "box":
        d.push(linePath(x0, y0, x1, y0, j));   // top
        d.push(linePath(x1, y0, x1, y1, j));   // right
        d.push(linePath(x1, y1, x0, y1, j));   // bottom
        d.push(linePath(x0, y1, x0, y0, j));   // left
        break;
      case "circle":
        d.push(ellipsePath(w / 2, h / 2, w / 2 + pad, h / 2 + pad, j));
        break;
      case "bracket":
        // right-side bracket by default
        d.push("M " + (w + pad) + " " + (y0) +
               " C " + (x1 + pad * 1.5 + rnd(j)) + " " + (h * 0.25) +
               " "   + (x1 + pad * 1.5 + rnd(j)) + " " + (h * 0.75) +
               " "   + (w + pad) + " " + (y1));
        break;
      default: // highlight handled separately
        break;
    }
    return d;
  }

  function ellipsePath(cx, cy, rx, ry, j) {
    var k = 0.5523, p = [];
    function pt(a) { return [cx + Math.cos(a) * rx + rnd(j), cy + Math.sin(a) * ry + rnd(j)]; }
    var s = pt(-0.2);
    p.push("M " + s[0] + " " + s[1]);
    for (var i = 0; i < 4; i++) {
      var a0 = -0.2 + i * (Math.PI / 2), a1 = a0 + Math.PI / 2;
      var p0 = pt(a0), p1 = pt(a1);
      var c0 = [cx + Math.cos(a0) * rx - Math.sin(a0) * rx * k, cy + Math.sin(a0) * ry + Math.cos(a0) * ry * k];
      var c1 = [cx + Math.cos(a1) * rx + Math.sin(a1) * rx * k, cy + Math.sin(a1) * ry - Math.cos(a1) * ry * k];
      p.push("C " + c0[0] + " " + c0[1] + " " + c1[0] + " " + c1[1] + " " + p1[0] + " " + p1[1]);
    }
    return p.join(" ");
  }

  function annotate(el, opts) {
    opts = opts || {};
    var type = opts.type || "underline";
    var color = opts.color || "#efa23c";
    var sw = opts.strokeWidth || 2;
    var pad = typeof opts.padding === "number" ? opts.padding : 4;
    var multiline = !!opts.multiline;
    var dur = opts.animationDuration != null ? opts.animationDuration : 700;
    var iterations = opts.iterations || 2;
    var svgs = [];

    function rects() {
      if (multiline && el.getClientRects().length) return [].slice.call(el.getClientRects());
      return [el.getBoundingClientRect()];
    }

    function drawRect(r) {
      var sx = window.scrollX || window.pageXOffset;
      var sy = window.scrollY || window.pageYOffset;
      var W = r.width, H = r.height;
      var svg = document.createElementNS(SVGNS, "svg");
      svg.setAttribute("class", "sketch-annotation");
      svg.style.cssText =
        "position:absolute;left:" + (r.left + sx - pad - sw) + "px;top:" + (r.top + sy - pad - sw) +
        "px;width:" + (W + (pad + sw) * 2) + "px;height:" + (H + (pad + sw) * 2) +
        "px;overflow:visible;pointer-events:none;z-index:1;";
      var g = document.createElementNS(SVGNS, "g");
      g.setAttribute("transform", "translate(" + (pad + sw) + "," + (pad + sw) + ")");
      svg.appendChild(g);

      var paths = [];
      if (type === "highlight") {
        // thick translucent marker sweep across the line
        var yy = H / 2, hp = mkPath(linePath(0, yy, W, yy, Math.min(2, H * 0.06)), color, H * 0.96, "butt");
        hp.setAttribute("stroke-opacity", "0.4");
        g.appendChild(hp); paths.push(hp);
      } else {
        var jitter = type === "box" || type === "circle" ? 1.4 : 1.1;
        for (var it = 0; it < iterations; it++) {
          buildPaths(type, W, H, pad, jitter).forEach(function (d) {
            var p = mkPath(d, color, sw);
            g.appendChild(p); paths.push(p);
          });
        }
      }

      // animate stroke draw-on
      if (dur > 0) {
        var total = paths.reduce(function (s, p) { return s + p.getTotalLength(); }, 0) || 1;
        var acc = 0;
        paths.forEach(function (p) {
          var len = p.getTotalLength();
          p.style.strokeDasharray = len;
          p.style.strokeDashoffset = len;
          var slice = (len / total) * dur;
          p.style.transition = "stroke-dashoffset " + Math.max(120, slice) + "ms ease " + (acc) + "ms";
          acc += slice;
          requestAnimationFrame(function () { requestAnimationFrame(function () { p.style.strokeDashoffset = "0"; }); });
        });
      }

      document.body.appendChild(svg);
      svgs.push(svg);
    }

    return {
      show: function () { this.remove(); rects().forEach(drawRect); },
      hide: function () { this.remove(); },
      remove: function () { svgs.forEach(function (s) { if (s.parentNode) s.parentNode.removeChild(s); }); svgs = []; }
    };
  }

  window.RoughNotation = { annotate: annotate };
})();
