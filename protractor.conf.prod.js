const devConfig = require('./protractor.conf.js').config;

const prodConfig = {
    ...devConfig,
    baseUrl: 'http://rxplayer-ui.esividev.k8s.luxoft.com/',
    onPrepare() {
        console.log('PROD');
        devConfig.onPrepare();
    }
};

console.log(prodConfig);

exports.config = prodConfig;