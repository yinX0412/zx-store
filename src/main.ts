import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import ElementUi from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import {Component} from 'vue-property-decorator';
import wx from 'weixin-js-sdk';

Vue.prototype.wx = wx;
Vue.prototype.baseUrl = 'http://annual.gengyong.com.cn';
Vue.config.productionTip = false;
Vue.use(ElementUi);
Component.registerHooks([
    'beforeRouteEnter',
    'beforeRouteUpdate', // for vue-router 2.2+
    'beforeRouteLeave',
    'beforeEach',
]);
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
