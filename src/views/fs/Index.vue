<style lang="less">
    .fs-body {
        max-width: 800px;
        margin: 0 auto;
        background: #f3f4f5;
        height: 100%;
    }
</style>
<template>
    <div class="fs-body" v-if="$store.state.user">
        <router-view/>
    </div>
</template>
<script lang="ts">
    import {Vue, Component} from 'vue-property-decorator';
    import {getCommonConfig, getCurrentUser} from '../../service/fs/fs-auth-service';
    import AuthImp from '@/service/auth/AuthImp';

    @Component
    export default class FsIndex extends Vue {
        private created(): void {
            // testLogin()
            //     .then((res) => {
            //         this.$store.state.user = res;
            //         getCurrentUser()
            //             .then((user) => {
            //                 this.$store.state.user = user;
            //             })
            //             .catch((error) => {
            //                 alert(error);
            //             });
            //     });
            getCurrentUser()
                .then((user) => {
                    this.$store.commit('updateUser', user);
                    new AuthImp().setAccessToken(user.token);
                })
                .catch((error) => {
                    alert(error);
                    if (error.code === 2016) {
                        new AuthImp().redirectToGetAuthCode();
                    } else if (error.code === 201) {
                        // this.$router.push()
                    }
                });
            getCommonConfig()
                .then((config) => {
                    this.$store.commit('updateConfig', config);
                })
                .catch((error) => {
                    alert(error);
                });

        }
    }
</script>
<style lang="less">
    .flex-menu-box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #ddd;
        padding-bottom: 10px;
        height: 45px;
        line-height: 45px;
        margin-bottom: 10px;

        .el-image {
            margin-right: 20px;
            height: 30px;
            width: 30px;
            vertical-align: middle;
        }
    }
</style>