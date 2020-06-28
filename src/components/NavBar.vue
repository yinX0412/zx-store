<template>
    <div class="nav-box">
        <div class="nav-item" @click="go('mainIndex')">
            <div style="height: 20px;">
                <el-image src="/img/navbar/index-unselected.svg" v-if="activePage!=='mainIndex'"></el-image>
                <el-image src="/img/navbar/index-selected.svg" v-else></el-image>
            </div>
            <div>首页</div>
        </div>
        <div class="nav-item" @click="go('mainCart')">
            <div style="height: 20px;">
                <el-image src="/img/navbar/cart-unselected.svg" v-if="activePage!=='mainCart'"></el-image>
                <el-image src="/img/navbar/cart-selected.svg" v-else></el-image>
            </div>
            <div>购物车</div>
        </div>
        <div class="nav-item" @click="go('mainMe')">
            <div style="height: 20px;">
                <el-image src="/img/navbar/me-unselected.svg" v-if="activePage!=='mainMe'"></el-image>
                <el-image src="/img/navbar/me-selected.svg" v-else></el-image>
            </div>
            <div>我的</div>
        </div>
    </div>
</template>
<script lang="ts">
    import {Vue, Component, Prop} from 'vue-property-decorator';

    @Component
    export default class NavBar extends Vue {
        @Prop()
        private activePage!: 'mainIndex' | 'mainCart' | 'mainMe' | '';

        private go(command: 'mainIndex' | 'mainCart' | 'mainMe') {
            if (command === this.$route.name) {
                return;
            }
            switch (command) {
                case 'mainIndex':
                    this.$router.replace('/fs/main/home');
                    return;
                case 'mainCart':
                    this.$router.replace('/fs/main/cart');
                    return;
                case 'mainMe':
                    this.$router.replace('/fs/main/me');
                    return;
            }
        }
    }
</script>
<style lang="less">
    .nav-box {
        display: flex;
        justify-content: space-around;
        width: 100%;
        border-top: 1px solid #ddd;
        padding: 5px 0;

        .nav-item {
            font-size: 12px;
            text-align: center;

            .el-image {
                width: 20px;
            }
        }
    }
</style>