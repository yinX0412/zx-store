<template>
    <el-container style="height: 100vh;">
        <el-header style="background: #565c63;">
            <div class="bs-header">
                筑馨家商城
            </div>
        </el-header>
        <el-container>
            <el-aside width="200px" style="height: 100%">
                <el-menu style="height: 100%" router :default-active="activeRoute">
                    <el-menu-item index="/bs/goods/list">商品列表</el-menu-item>
                    <el-menu-item index="/bs/order/list">订单列表</el-menu-item>
                    <el-menu-item index="/bs/category/list">分类列表</el-menu-item>
                    <el-menu-item index="/bs/series/list">系列列表</el-menu-item>
                </el-menu>
            </el-aside>
            <el-main style="padding: 10px 0 0 10px">
                <router-view style="background: #fff;width: 100%;height: 100%;padding: 20px;"></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>
<script lang="ts">
    import {Vue, Component} from 'vue-property-decorator';

    @Component
    export default class BsIndex extends Vue {
        private activeRoute = '';

        private created(): void {
            if (this.$route.path.includes('/bs/goods/list')) {
                this.activeRoute = '/bs/goods/list';
                return;
            }
            if (this.$route.path.includes('/bs/order/list')) {
                this.activeRoute = '/bs/order/list';
                return;
            }
            if (this.$route.path.includes('/bs/series/list')) {
                this.activeRoute = '/bs/series/list';
                return;
            }
            if (this.$route.path.includes('/bs/category/list')) {
                this.activeRoute = '/bs/category/list';
                return;
            }
        }
    }
</script>
<style lang="less">
    .bs-header {
        height: 100%;
        width: 100%;
        line-height: 60px;
        color: #fff;
    }
</style>
