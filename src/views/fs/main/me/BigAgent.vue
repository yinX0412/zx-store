<template>
    <div>
        <div class="flex-menu-box">
            <div>
                <el-image src="/img/me/member.svg"></el-image>
                <span style="font-size: 14px">会员管理</span>
            </div>
            <div style="font-size: 20px">&gt;</div>
        </div>
        <div class="flex-menu-box">
            <div>
                <el-image src="/img/me/order.svg"></el-image>
                <span style="font-size: 14px">订单管理</span>
            </div>
            <div style="font-size: 20px">&gt;</div>
        </div>
        <div class="flex-menu-box">
            <div>
                <el-image src="/img/me/business-manager.svg"></el-image>
                <span style="font-size: 14px">业务员管理</span>
            </div>
            <div style="font-size: 20px">&gt;</div>
        </div>
    </div>
</template>
<script lang="ts">
    import {Vue, Component} from 'vue-property-decorator';

    @Component
    export default class MeOfBigAgent extends Vue {

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