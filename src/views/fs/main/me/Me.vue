<template>
    <div v-if="user">
        <div class="avatar" @click="goUserDetail">
            <div class="avatar-box">
                <el-image :src="user.avatar"></el-image>
            </div>
            <h2>{{user.username}}</h2>
        </div>
        <div style="padding: 10px">
            <big-agent v-if="user.identity===4"></big-agent>
            <member v-if="user.identity===2"></member>
            <business-manager v-if="user.identity===3"></business-manager>
            <user v-if="user.identity===1"></user>
        </div>
        <!--<el-button type="primary" @click="goAuth">授权</el-button>-->
    </div>
</template>
<script lang="ts">
    import {Vue, Component} from 'vue-property-decorator';
    import BigAgent from './BigAgent.vue';
    import BusinessManager from './BusinessManager.vue';
    import Member from './Member.vue';
    import User from './User.vue';

    @Component({
        components: {
            BigAgent,
            BusinessManager,
            Member,
            User,
        },
    })
    export default class FsMe extends Vue {
        get user() {
            return this.$store.state.user;
        }

        private goAuth() {
            window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=APPID&redirect_uri=REDIRECT_URI&response_type=code&scope=SCOPE&state=STATE#wechat_redirec';
        }

        private goUserDetail() {
            this.$router.push('/fs/me');
        }
    }
</script>
<style lang="less">
    .avatar {
        width: 100%;
        background: #353f8d;
        height: 130px;
        padding-top: 25px;
        text-align: center;

        .avatar-box {
            text-align: center;
            width: 50px;
            height: 50px;
            border-radius: 50px;
            border: 3px solid #fff;
            margin: 0 auto 5px;

            .el-image {
                width: 100%;
                height: 100%;
                border-radius: 50px;
            }
        }

        h2 {
            color: #fff;
        }
    }
</style>
