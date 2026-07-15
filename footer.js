/* Shared site footer for the standalone HTML pages. */
(function () {
  const mount = document.querySelector("[data-site-footer]");
  if (!mount) return;
  mount.outerHTML = '<footer class="site-footer"><span>Property Exchange</span><span>Educational placeholders · Not investment, tax, or legal advice</span><a class="footer-employee-link" href="employee-login.html">Employee Login</a></footer>';
})();
