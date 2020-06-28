import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        user: null,
        config: null
    },
    mutations: {
        updateUser(state, user) {
            state.user = user;
        },
        updateConfig(state, config) {
            state.config = config;
        }
    },
    actions: {},
    modules: {}
});
