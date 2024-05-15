/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: "www.findlet.ng",
                port:''
            }
        ]
    }
}


export default nextConfig;
