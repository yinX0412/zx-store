<style lang="less">
    .sku-selected {
        border: 3px solid rgb(213, 132, 103);
    }
</style>
<template>
    <div v-if="goodsDetail" style="background: #f3f4f5">
        <template v-if="!isLiving">
            <div v-if="!currentSku">
                <el-image :style="goodsImgStyle" :src="goodsDetail.main_img"></el-image>
                <div style="padding: 0 5px">
                    <div style="background: #fff;padding: 8px">
                        <h3>{{goodsDetail.goods_name}}</h3>
                        <span
                            style="color: #d58467;font-weight: bold;margin-right: 10px;"
                            v-if="isLiving">¥ {{goodsDetail.video_price}}</span>
                        <template v-else>
                            <span
                                style="color: #d58467;font-weight: bold;margin-right: 10px;"
                                v-if="!$store.state.user|$store.state.user.identity!==1">¥ {{goodsDetail.member_price}}</span>
                            <span style="color: #d58467;font-weight: bold;margin-right: 10px;"
                                  v-else>¥ {{goodsDetail.normal_price}}</span>
                        </template>

                        <div style="float: right;font-size: 14px">销量：{{goodsDetail.sales_volume}}</div>
                    </div>

                </div>
            </div>
            <div v-if="currentSku">
                <el-image :style="goodsImgStyle" :src="currentSku.sku_img"></el-image>
                <div style="padding: 0 5px">
                    <div style="background: #fff;padding: 8px">
                        <h3>{{currentSku.goods_name}}</h3>
                        <span
                            style="color: #d58467;font-weight: bold;margin-right: 10px;"
                            v-if="!$store.state.user|$store.state.user.identity!==1">¥ {{currentSku.member_price}}</span>
                        <span style="color: #d58467;font-weight: bold;margin-right: 10px;"
                              v-else>¥ {{currentSku.normal_price}}</span>
                        <div style="float: right;font-size: 14px">销量：{{goodsDetail.sales_volume}}</div>
                    </div>
                </div>
            </div>
        </template>
        <template v-if="isLiving">
            <div v-if="!currentSku">
                <div style="background: #fff;padding: 8px">
                    <h3>{{goodsDetail.goods_name}}</h3>
                    <span
                        style="color: #d58467;font-weight: bold;margin-right: 10px;">¥ {{goodsDetail.video_price}}</span>
                    <div style="float: right;font-size: 14px">销量：{{goodsDetail.sales_volume}}</div>
                </div>
            </div>
            <div v-if="currentSku">
                <div style="background: #fff;padding: 8px">
                    <h3>{{currentSku.goods_name}}</h3>
                    <span
                        style="color: #d58467;font-weight: bold;margin-right: 10px;">¥ {{currentSku.video_price}}</span>
                    <div style="float: right;font-size: 14px">销量：{{goodsDetail.sales_volume}}</div>
                </div>
            </div>
        </template>

        <div style="padding: 0 5px;margin-top: 10px">
            <div style="background: #fff;padding: 10px">
                <div style="display: inline-block;font-size: 14px;color: #606266;">规格：</div>
                <div v-for="item in goodsDetail.goods_sku"
                     style="display: inline-block;margin-right: 10px;vertical-align: middle"
                     @click="currentSku=item"
                     :class="{'sku-selected': currentSku&&currentSku.id === item.id}">
                    <el-image :src="item.sku_img" style="width: 40px;height: 40px;display: block"></el-image>
                </div>
                <div v-if="currentSku" style="margin-top: 10px">
                    <div style="display: inline-block;font-size: 14px">详情：{{currentSku.sku_content}}</div>
                </div>
            </div>
        </div>
        <div style="padding: 0 5px;margin-top: 10px">
            <div style="background: #fff;padding: 10px;font-size: 14px;">
                <div style="width: 25%;max-width: 70px;display: inline-block;vertical-align: top">
                    商品详情：
                </div>
                <div style="display: inline-block;width: 70%;word-break: break-all">
                    {{goodsDetail.goods_detail}}
                </div>
            </div>
        </div>
        <div style="width: 100%;position: fixed;bottom: 10px;left: 0">
            <div @click="addToCart"
                 style="width: 90%;margin: 0 auto;border-radius: 30px;text-align: center;height: 30px;
                line-height: 30px;color: #fff;background: #409EFF;font-size: 14px">
                添加购物车
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import {Vue, Component} from 'vue-property-decorator';
    import {getGoods, GoodsDetail, GoodsSku} from '@/service/bs/bs-goods-service';
    import {addGoodsToCart} from '@/service/fs/fs-cart-service';
    import moment from 'moment';

    @Component
    export default class FsGoodsDetail extends Vue {
        private loading: boolean = false;
        private goodsDetail: GoodsDetail | null = null;
        private currentSku: GoodsSku | null = null;

        get isLiving() {
            const begin = +moment(this.$store.state.config.video_begin_time).format('x');
            const end = +moment(this.$store.state.config.video_end_time).format('x');
            const now = new Date().getTime();
            return now > begin && now < end;
        }

        private created(): void {
            this.getGoods();
        }

        get goodsImgStyle() {
            return {
                height: (document.getElementsByClassName('fs-body')[0].clientWidth - 22) * 3 / 5 + 'px',
                width: '100%',
            };
        }

        private getGoods() {
            this.loading = true;
            getGoods((this.$route.params as any).id)
                .then((res) => this.goodsDetail = res)
                .catch((error) => {
                    this.$message({
                        type: 'error',
                        message: error,
                    });
                })
                .finally(() => this.loading = false);
        }

        private addToCart() {
            if (!this.goodsDetail) {
                return;
            }
            if (!this.currentSku) {
                this.$message({
                    type: 'warning',
                    message: '请选择商品规格',
                });
                return;
            }
            this.loading = true;
            addGoodsToCart(this.currentSku.id)
                .then(() => {
                    this.$message({
                        type: 'success',
                        message: '添加成功',
                    });
                })
                .catch((error) => {
                    this.$message({
                        type: 'error',
                        message: error,
                    });
                })
                .finally(() => this.loading = false);
        }
    }
</script>