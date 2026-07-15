import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: false },
      { source: "/property-exchange-cards.html", destination: "/investments", permanent: false },
      { source: "/investment-offering.html", destination: "/investment-offering", permanent: false },
      { source: "/content.html", destination: "/content", permanent: false },
      { source: "/learning-hub.html", destination: "/learning-hub", permanent: false },
      { source: "/about.html", destination: "/about", permanent: false },
      { source: "/about-baker-1031-investments.html", destination: "/about/baker-1031-investments", permanent: false },
      { source: "/about-jerry-baker.html", destination: "/about/jerry-baker", permanent: false },
      { source: "/about-team.html", destination: "/about/team", permanent: false },
      { source: "/author-bio.html", destination: "/author-bio", permanent: false },
      { source: "/employee-login.html", destination: "/employee-login", permanent: false },
    ];
  },
};

export default nextConfig;
