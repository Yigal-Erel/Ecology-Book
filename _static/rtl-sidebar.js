// Scroll primary sidebar to top after PST auto-scrolls to active chapter link.
// PST's scroll runs synchronously when its script is parsed (readyState is already
// "interactive" by then). We reset on window.load + small delay to run after PST.
window.addEventListener('load', function() {
  setTimeout(function() {
    // PST targets "div.bd-sidebar"; .bd-sidebar-primary is the same element in this theme
    var sidebar = document.querySelector('div.bd-sidebar') || document.querySelector('.bd-sidebar-primary');
    if (sidebar) sidebar.scrollTop = 0;
  }, 200);
});

// Bug report button — injected below the TOC in the primary sidebar.
document.addEventListener("DOMContentLoaded", function() {
  var target = document.querySelector(".sidebar-primary-items__end");
  if (!target) return;

  var to = "tomer.vagenfeld@mail.huji.ac.il";
  var subject = encodeURIComponent("דיווח על בעיה בספר");
  var body = encodeURIComponent(
    "‏" +  // Right-to-Left Mark — tells Gmail to open compose in RTL
    "שלום,\n" +
    "מצאתי בעיה באתר הספר 'משבר הסביבה והאקלים - הזוית המדעית' מאת יגאל אראל.\n\n"
  );
  var href = "https://mail.google.com/mail/?view=cm&fs=1&to=" + encodeURIComponent(to) + "&su=" + subject + "&body=" + body;

  var btn = document.createElement("a");
  btn.href = href;
  btn.className = "bug-report-btn";
  btn.setAttribute("aria-label", "דווחו על בעיה");
  btn.innerHTML = "<span>&#9888;</span> דווחו על בעיה";
  target.appendChild(btn);
});

// Keep desktop interactive: don't open the <dialog>; collapse the static sidebar instead.
document.addEventListener("DOMContentLoaded", () => {
  // Dispose Bootstrap tooltips on sidebar toggles — they fire too aggressively
  // (Bootstrap initialises them via data-bs-toggle="tooltip" and shows on focus/scroll)
  setTimeout(() => {
    document.querySelectorAll(".sidebar-toggle").forEach(btn => {
      try { bootstrap.Tooltip.getInstance(btn)?.dispose(); } catch(e) {}
      btn.removeAttribute("data-bs-toggle");
      btn.removeAttribute("data-bs-original-title");
    });
  }, 500);

  const primaryToggle = document.querySelector(".sidebar-toggle.primary-toggle");
  const primaryDialog = document.getElementById("pst-primary-sidebar-modal");
  if (primaryToggle) {
    primaryToggle.addEventListener("click", (e) => {
      const isDesktop = window.matchMedia("(min-width: 992px)").matches;
      if (!isDesktop) return;                 // mobile: let theme open dialog

      e.preventDefault();                     // stop showModal()
      // If the dialog was opened by theme JS before our handler ran, close it:
      if (primaryDialog && primaryDialog.open && typeof primaryDialog.close === "function") {
        primaryDialog.close();
      }

      document.body.classList.toggle("rtl-sidebar-collapsed");
    });
  }

  const secondaryToggle = document.querySelector(".sidebar-toggle.secondary-toggle");
  const secondaryDialog = document.getElementById("pst-secondary-sidebar-modal");
  if (secondaryToggle) {
    secondaryToggle.addEventListener("click", (e) => {
      const isDesktop = window.matchMedia("(min-width: 992px)").matches;
      if (!isDesktop) return;                 // mobile: let theme open dialog

      e.preventDefault();                     // stop showModal()
      if (secondaryDialog && secondaryDialog.open && typeof secondaryDialog.close === "function") {
        secondaryDialog.close();
      }
      // Also uncheck the checkbox-based toggle so the overlay doesn't appear
      const cb = document.getElementById("pst-secondary-sidebar-checkbox");
      if (cb) cb.checked = false;

      document.body.classList.toggle("rtl-secondary-collapsed");
    });
  }
});
