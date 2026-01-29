import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://192.168.26.57:8585";
    const camundaApiBaseUrl = process.env.NEXT_PUBLIC_CAMUNDA_API_BASE_URL || "http://192.168.26.57:8686";
    
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
