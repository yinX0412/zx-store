<style lang="less">
    .invite {
        background: url("/img/invite.jpeg");
        background-size: 100%;
    }

    .qrcode {
        padding-top: 150px;
        display: block;
        text-align: center;
        position: absolute;
        top: 150px;

        img {
            margin: 0 auto;
            display: block;
        }
    }
</style>
<template>
    <div class="invite" style="width: 100%;height: 100vh;position: relative;">
        <div ref="qrcode" class="qrcode" :style="{'left': left+'px'}"></div>
        <div style="position: absolute;bottom: 10px;left: 10px;color: #fff;">邀请码：{{user.invite_code}}</div>
    </div>
</template>
<script lang="ts">
    import {Vue, Component} from 'vue-property-decorator';
    import QRCode from 'qrcodejs2';

    @Component
    export default class FsInvite extends Vue {
        get user() {
            return this.$store.state.user;
        }

        get left() {
            const width = document.body.clientWidth;
            return (width - 200) / 2;
        }

        private mounted(): void {
            const url = `http://zxfront.gengyong.com.cn/fs/register?invite_code=${this.user.invite_code}&identityNo=${(this.$route.query as any).identity}`;
            const qrcode = new (QRCode as any)(this.$refs.qrcode, {
                text: url,
                width: 200,
                height: 200,
            });
        }
    }
</script>