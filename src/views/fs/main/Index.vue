<template>
    <div v-if="token">
        <div :style="{'height': bodyHeight+'px','overflow': 'auto'}">
            <router-view></router-view>
        </div>
        <nav-bar :activePage="activePage"></nav-bar>
    </div>
</template>
<script lang="ts">
    import {Vue, Component} from 'vue-property-decorator';
    import NavBar from '@/components/NavBar.vue';
    import AuthImp from '@/service/auth/AuthImp';

    @Component({
        components: {
            NavBar,
        }
    })
    export default class FsMainIndex extends Vue {
        private bodyHeight = 800;
        private activePage: 'mainIndex' | 'mainCart' | 'mainMe' | '' = '';
        private token: string | null = null;

        private getToken() {
            new AuthImp().getAccessToken()
                         .then((res) => {
                             this.token = res;
                         })
                         .catch(() => this.token = null);
        }

        private created(): void {
            this.getToken();
            this.activePage = this.$route.name as any;
            window.addEventListener('resize', this.adjustLayout);
        }

        private beforeRouteUpdate(to: any, from: any, next: any) {
            if (to.path == from.path) {
                return;
            }
            this.activePage = (to as any).name;
            next();
        }

        private mounted(): void {
            this.adjustLayout();
        }

        private adjustLayout() {
            this.bodyHeight = window.innerHeight - 52;
        }

        private destroyed(): void {
            window.removeEventListener('resize', this.adjustLayout);
        }
    }
</script>