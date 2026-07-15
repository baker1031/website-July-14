/* Shared site footer for the standalone HTML pages. */
(function () {
  const mount = document.querySelector("[data-site-footer]");
  if (!mount) return;
  const employeeHref = window.location.protocol === "file:" ? "employee-login.html" : "/employee-login";
  mount.outerHTML = `<footer class="site-footer"><span>Property Exchange</span><span>Educational placeholders · Not investment, tax, or legal advice</span><a class="footer-employee-link" href="${employeeHref}">Employee Login</a></footer>`;
  window.PropertyExchangeLinks?.();
})();
