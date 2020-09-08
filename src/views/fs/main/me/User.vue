<template>
    <div>
        <div class="flex-menu-box" @click="goOrders">
            <div>
                <el-image src="/img/me/order.svg"></el-image>
                <span style="font-size: 14px">订单管理</span>
            </div>
            <div style="font-size: 20px">&gt;</div>
        </div>
    </div>
</template>
<script lang="ts">
    import {Vue, Component} from 'vue-property-decorator';

    @Component
    export default class MeOfUser extends Vue {
        public goOrders() {
            this.$router.push('/fs/order/list');
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