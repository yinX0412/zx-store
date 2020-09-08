<template>
    <div>
        <div class="flex-menu-box" @click="goOrders">
            <div>
                <el-image src="/img/me/order.svg"></el-image>
                <span style="font-size: 14px">订单管理</span>
            </div>
            <div style="font-size: 20px">&gt;</div>
        </div>
        <div class="flex-menu-box" @click="chooseInvite">
            <div>
                <el-image src="/img/me/invite-register.svg"></el-image>
                <span style="font-size: 14px">邀请注册</span>
            </div>
            <div style="font-size: 20px">&gt;</div>
        </div>
        <!--<div class="flex-menu-box">-->
        <!--<div>-->
        <!--<el-image src="/img/me/live-order.svg"></el-image>-->
        <!--<span style="font-size: 14px">直播订单管理</span>-->
        <!--</div>-->
        <!--<div style="font-size: 20px">&gt;</div>-->
        <!--</div>-->
        <el-dialog
            title="邀请"
            :visible.sync="dialogVisible"
            width="90%">
            <el-radio-group v-model="inviteMode">
                <el-radio label="1">普通用户</el-radio>
            </el-radio-group>
            <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="goInvite">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>
<script lang="ts">
    import {Vue, Component} from 'vue-property-decorator';

    @Component
    export default class MeOfMember extends Vue {
        private dialogVisible: boolean = false;
        private inviteMode: '2' | '3' = '2';

        public goOrders() {
            this.$router.push('/fs/order/list');
        }

        private goInvite() {
            this.$router.push(`/fs/invite?identity=${this.inviteMode}`);
        }

        private chooseInvite() {
            this.dialogVisible = true;
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