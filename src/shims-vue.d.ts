declare module '*.vue' {
    import Vue from 'vue';
    module 'vue/types/vue' {
        interface Vue {
            baseUrl: string;
        }
    }
    export default Vue;
}
