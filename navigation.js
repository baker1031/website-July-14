/* Shared site navigation for the standalone HTML pages. */
(function () {
  const mount = document.querySelector("[data-site-navigation]");
  if (!mount) return;
  const current = document.body.dataset.sitePage || "";
  const investmentsCurrent = current === "investments" ? ' aria-current="page"' : "";
  const contentCurrent = current === "content" || current === "learning-hub" ? ' aria-current="page"' : "";
  const aboutCurrent = current === "about" ? ' aria-current="page"' : "";
  mount.outerHTML = `<header class="site-header"><a class="wordmark" href="property-exchange-cards.html#top" aria-label="Property Exchange home"><span class="wordmark-mark" aria-hidden="true">PX</span><span>Property Exchange</span></a><nav class="site-nav" aria-label="Primary navigation"><a href="property-exchange-cards.html#property-catalog"${investmentsCurrent}>Investments</a><a href="content.html"${contentCurrent}>Content</a><a href="about.html"${aboutCurrent}>About Us</a></nav><span class="header-note">${current === "investments" ? "New opportunities, thoughtfully selected" : "Learn with clarity. Invest with confidence."}</span></header>`;
})();
