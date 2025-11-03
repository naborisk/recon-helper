import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: "export",
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

export default withMDX(nextConfig);
