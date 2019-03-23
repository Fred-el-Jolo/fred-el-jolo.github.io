var link = document.createElement("link");
link.rel = "stylesheet";
link.type = "text/css";
link.href = window.location.search.match(/print-pdf/gi)
  ? "/assets/revealjs/css/print/pdf.css"
  : "/assets/revealjs/css/print/paper.css";
document.getElementsByTagName("head")[0].appendChild(link);
