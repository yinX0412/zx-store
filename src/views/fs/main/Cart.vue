<template>
    <div style="padding: 10px 0">
        <div v-if="total === 0" style="text-align: center;padding-top: 150px;">
            <h2 style="margin-bottom: 20px">购物车竟然是空的</h2>
            <el-button type="primary" @click="goGoodsList"><span style="color: #fff">去逛逛</span></el-button>
        </div>
        <div style="width: 90%;background: #fff;margin: 0 auto;min-height: 50px;padding: 10px" v-for="item in cartList">
            <div style="display: inline-block">
                <el-image :src="item.goods_sku.sku_img" style="width: 50px;height: 50px;display: block"></el-image>
            </div>
            <div style="display: inline-block">
                <h4 style="color: #2b2b2b">{{item.goods_sku.goods_name}}</h4>
                <div>{{JSON.parse(item.goods_sku.sku_content).map()}}</div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import {Vue, Component} from 'vue-property-decorator';
    import {CartGoodsList, cartGoodsList} from '@/service/fs/fs-cart-service';

    @Component
    export default class FsCart extends Vue {
        private loading: boolean = false;
        private cartList: CartGoodsList[] = [];
        private total: number | null = null;

        private created(): void {
            this.getCartList();
        }

        private getCartList() {
            this.loading = true;
            cartGoodsList()
                .then((res) => {
                    this.cartList = res.list;
                    this.total = res.total;
                })
                .catch((error) => {
                    this.$message({
                        type: 'error',
                        message: error,
                    });
                })
                .finally(() => this.loading = false);
        }

        private goGoodsList() {
            this.$router.push('/fs/main/home');
        }
    }
</script>