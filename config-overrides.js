const { GenerateSW } = require('workbox-webpack-plugin');

module.exports = function override(config) {
  config.plugins.push(
    new GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
      swDest: 'service-worker.js', // Nom du fichier SW généré
      exclude: [/\.map$/, /asset-manifest\.json$/, /LICENSE/],
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 365 * 24 * 60 * 60, // 1 an
            },
          },
        },
        {
          urlPattern: /\.(?:png|jpg|jpeg|svg|gif|ico|webp|json|css|js)$/i,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'static-resources',
          },
        },
        {
          urlPattern: /manifest\.json$/i,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'manifest',
          },
        },
        {
          urlPattern: /favicon\.ico$/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'favicon',
          },
        },
      ],
    })
  );

  return config;
};
