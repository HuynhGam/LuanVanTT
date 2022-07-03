const {createProxyMiddleware} = require("http-proxy-middleware")

module.exports = app => {
    app.use(
       createProxyMiddleware('/geocoding/v5/mapbox.places/',
        {
            target: '`http://api.mapbox.com',
            changeOrigin: true
        }
       )
    ),
    app.use(
        createProxyMiddleware('/directions/v5/mapbox/driving/',
         {
             target: '`http://api.mapbox.com',
             changeOrigin: true
         }
        )
     )}
