/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei', 'lucide-react', 'gsap', 'lenis'],
};

export default nextConfig;
