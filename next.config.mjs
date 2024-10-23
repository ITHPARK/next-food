import withBundleAnalyzer from '@next/bundle-analyzer';

/** @type {import('next').NextConfig} */
const nextConfig = withBundleAnalyzer({
  enabled: true,
  openAnalyzer: true,
})({

});

export default nextConfig;