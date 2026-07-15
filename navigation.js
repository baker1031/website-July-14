/* Shared site navigation for the standalone HTML pages and their Next routes. */
(function () {
  const routeMap = {
    "index.html": "/",
    "property-exchange-cards.html": "/investments",
    "investment-offering.html": "/investment-offering",
    "content.html": "/content",
    "learning-hub.html": "/learning-hub",
    "about.html": "/about",
    "about-baker-1031-investments.html": "/about/baker-1031-investments",
    "about-jerry-baker.html": "/about/jerry-baker",
    "about-team.html": "/about/team",
    "author-bio.html": "/author-bio",
    "employee-login.html": "/employee-login",
  };
  const isLocalFile = window.location.protocol === "file:";

  function rewriteSiteLinks() {
    document.querySelectorAll("a[href]").forEach((link) => {
      const href = link.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
      const match = href.match(/^([^?#]+)([?#].*)?$/);
      if (!match) return;
      const filename = match[1].replace(/^\.\//, "");
      const route = routeMap[filename];
      const breadcrumbHome = link.closest(".breadcrumbs") && link.textContent.trim() === "Home";
      const targetRoute = breadcrumbHome ? routeMap["index.html"] : route;
      if (!targetRoute || isLocalFile) return;
      link.setAttribute("href", `${targetRoute}${match[2] || ""}`);
    });
  }

  window.PropertyExchangeLinks = rewriteSiteLinks;
  const mount = document.querySelector("[data-site-navigation]");
  if (!mount) {
    rewriteSiteLinks();
    return;
  }
  const current = document.body.dataset.sitePage || "";
  const homeHref = isLocalFile ? "index.html#top" : "/#top";
  const investmentsHref = isLocalFile ? "property-exchange-cards.html" : "/investments";
  const contentHref = isLocalFile ? "content.html" : "/content";
  const aboutHref = isLocalFile ? "about.html" : "/about";
  const investmentsCurrent = current === "investments" ? ' aria-current="page"' : "";
  const contentCurrent = current === "content" || current === "learning-hub" ? ' aria-current="page"' : "";
  const aboutCurrent = current === "about" ? ' aria-current="page"' : "";
  mount.outerHTML = `<header class="site-header"><a class="wordmark" href="${homeHref}" aria-label="Property Exchange home"><span class="wordmark-mark" aria-hidden="true">PX</span><span>Property Exchange</span></a><nav class="site-nav" aria-label="Primary navigation"><a href="${investmentsHref}"${investmentsCurrent}>Investments</a><a href="${contentHref}"${contentCurrent}>Content</a><a href="${aboutHref}"${aboutCurrent}>About Us</a></nav><span class="header-note">${current === "investments" ? "New opportunities, thoughtfully selected" : "Learn with clarity. Invest with confidence."}</span></header>`;
  rewriteSiteLinks();
})();
