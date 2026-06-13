import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.100.36", "localhost"],
  async redirects() {
    return [
      {
        source: "/business/registry-portal",
        destination: "/registry/cap-table",
        permanent: false,
      },
      {
        source: "/business/funding-readiness",
        destination: "/registry/readiness",
        permanent: false,
      },
      {
        source: "/business/data-room",
        destination: "/registry/data-room",
        permanent: false,
      },
      {
        source: "/business/use-of-funds",
        destination: "/registry/use-of-funds",
        permanent: false,
      },
      {
        source: "/business/issuer-reporting",
        destination: "/registry/reporting",
        permanent: false,
      },
      {
        source: "/admin/registry-portal",
        destination: "/admin/registry",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
