// https://angular.io/guide/build#proxying-to-a-backend-server

const PROXY_CONFIG = {
  '/api/**': {
    target: 'http://localhost:3001',
    changeOrigin: true,
    secure: true,
    logLevel: 'debug',
    // onProxyReq: (proxyReq, req, res) => {
    //   const cookieMap = {
    //     SID: '',
    //   };
    //   let cookie = '';
    //   for (const key of Object.keys(cookieMap)) {
    //     cookie += `${key}=${cookieMap[key]}; `;
    //   }
    //   proxyReq.setHeader('cookie', cookie);
    // },
  },
};

module.exports = PROXY_CONFIG;
