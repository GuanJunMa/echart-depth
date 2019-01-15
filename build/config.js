var debug = 'dev';

module.exports = {
    DEBUG:debug,
    development: {
        autoOpenBrowser: true,
        API_PATH:  debug == 'dev' ? 'https://ikj98kyq754c.jccdex.cn' : '',
    },
    version: '1.0.0'
};
