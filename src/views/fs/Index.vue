<style lang="less">
    .fs-body {
        max-width: 800px;
        margin: 0 auto;
        background: #f3f4f5;
        height: 100%;
        color: #606266;

        .richtext {
            table {
                border-top: 1px solid #ccc;
                border-left: 1px solid #ccc;
            }

            table td,
            table th {
                border-bottom: 1px solid #ccc;
                border-right: 1px solid #ccc;
                padding: 3px 5px;
            }

            table th {
                border-bottom: 2px solid #ccc;
                text-align: center;
            }

            /* blockquote 样式 */

            blockquote {
                display: block;
                border-left: 8px solid #d0e5f2;
                padding: 5px 10px;
                margin: 10px 0;
                line-height: 1.4;
                font-size: 100%;
                background-color: #f1f1f1;
            }

            /* code 样式 */

            code {
                display: inline-block;
                *display: inline;
                *zoom: 1;
                background-color: #f1f1f1;
                border-radius: 3px;
                padding: 3px 5px;
                margin: 0 3px;
            }

            pre code {
                display: block;
            }

            /* ul ol 样式 */

            ul, ol {
                margin: 10px 0 10px 20px;
            }
        }
    }

    .el-message-box {
        max-width: 100% !important;
    }
</style>
<template>
    <div class="fs-body">
        <router-view />
    </div>
</template>
<script lang="ts">
    import {Vue, Component} from 'vue-property-decorator';
    import {getCommonConfig, getCurrentUser, userAuthCodeLogin} from '../../service/fs/fs-auth-service';
    import AuthImp from '@/service/auth/AuthImp';
    import router from '@/router';

    @Component
    export default class FsIndex extends Vue {
        private user: any = null;

        private created(): void {
            if ((this.$route.query as any).code) {
                userAuthCodeLogin((router.currentRoute.query as any).code as string)
                    .then((res: any) => {
                        if (res.token) {
                            new AuthImp().setAccessToken(res.token);
                        }
                        window.location.replace(window.location.pathname);
                    })
                    .catch((error) => {
                        if (!error) {
                            return;
                        }
                        if (error.data && error.data.token) {
                            new AuthImp().setAccessToken(error.data.token);
                        }
                        if (error.code === 2003) {
                            const invitecode = (this.$route.query as any).invite_code ?
                                (this.$route.query as any).invite_code : '';
                            const identityNo = (this.$route.query as any).identityNo ?
                                (this.$route.query as any).identityNo : '';
                            this.$router.push(`/fs/register?invite_code=${invitecode}&identityNo=${identityNo}`);
                            return;
                        }
                        if (error.code === 201) {
                            window.location.href = 'http://zxfront.gengyong.com.cn/fs/member/pay';
                            return;
                        }
                    });
            } else {
                if (this.$route.path === '/fs/register') {
                    new AuthImp().getAccessToken()
                                 .then((ak) => {
                                     if (!ak) {
                                         new AuthImp().redirectToGetAuthCode();
                                     }
                                 });
                    return;
                }
                getCurrentUser()
                    .then((user) => {
                        this.user = user;
                        if (user && user.token) {
                            new AuthImp().setAccessToken(user.token);
                            this.$store.commit('updateUser', user);
                        }
                        return getCommonConfig();
                    })
                    .then((config: any) => {
                        if (config) {
                            this.$store.commit('updateConfig', config);
                        }
                    })
                    .catch((error) => {
                        if (!error) {
                            return;
                        }
                        if (error === 403) {
                            window.location.href = 'http://zxfront.gengyong.com.cn/fs/register';
                        }
                    });
            }
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
