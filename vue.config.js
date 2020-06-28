module.exports = {
    // vue项目中关闭eslint
    lintOnSave: false,
    devServer: {
        proxy: {
            '/api': {
                target: 'http://annual.gengyong.com.cn',
                changeOrigin: true
            }
        }
    }
};