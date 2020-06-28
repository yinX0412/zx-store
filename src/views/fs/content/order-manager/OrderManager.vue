<template>
    <div>
        <div class="flex-menu-box">
            <div>
                <el-image src="/img/daliy-order.svg"></el-image>
                <span style="font-size: 14px">日常订单</span>
            </div>
            <div style="font-size: 20px">&gt;</div>
        </div>
        <div class="flex-menu-box">
            <div>
                <el-image src="/img/me/live-orde.svg"></el-image>
                <span style="font-size: 14px">直播订单</span>
            </div>
            <div style="font-size: 20px">&gt;</div>
        </div>
        <div class="flex-menu-box">
            <div>
                <el-image src="/img/custom-order.svg"></el-image>
                <span style="font-size: 14px">定制订单</span>
            </div>
            <div style="font-size: 20px">&gt;</div>
        </div>
    </div>
</template>
<script lang="ts">
    import {Vue, Component} from 'vue-property-decorator';

    @Component
    export default class FsOrderManager extends Vue {

    }
</script>
