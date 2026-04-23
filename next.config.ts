import type { NextConfig } from "next";
import packageJson from "./package.json";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_APP_VERSION: packageJson.version,
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "ep.pec.ir", // match your old domain
          },
        ],
        destination: "https://tika.pec.ir/:path*", // redirect to the new domain
        permanent: true, // 308 redirect (SEO-friendly)
      },
    ];
  },

  async rewrites() {
    const apiBaseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://192.168.26.57:8585";
    const camundaApiBaseUrl =
      process.env.NEXT_PUBLIC_CAMUNDA_API_BASE_URL || "http://192.168.26.57:8686";

    return [
      {
        source: "/api/:path*",
        destination: `${apiBaseUrl}/:path*`,
      },
      {
        source: "/api-camunda/api/:path*",
        destination: `${camundaApiBaseUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
