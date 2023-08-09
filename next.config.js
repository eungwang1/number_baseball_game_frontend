/** @type {import('next').NextConfig} */
const nextConfig = {
    compiler : {
        styledComponents: true
    },
    webpack: (config) => {
        config.externals.push({
          'utf-8-validate': 'commonjs utf-8-validate',
          'bufferutil': 'commonjs bufferutil',
        })
        return config
      }
}

module.exports = nextConfig
