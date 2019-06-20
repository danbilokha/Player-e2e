const devConfig = require('./protractor.conf.js').config;

const prodConfig = {
    ...devConfig,
    baseUrl: 'http://rxplayer-ui.esividev.k8s.luxoft.com/',
    onPrepare() {
        console.log('PROD');
        devConfig.onPrepare();
    }
};

exports.config = prodConfig;