<template>
    <div style="padding: 10px 0" v-loading="loading">
        <div v-if="user">
            <div v-if="total == 0" style="text-align: center;padding-top: 150px;">
                <h2 style="margin-bottom: 20px">购物车竟然是空的</h2>
                <el-button type="primary" @click="goGoodsList"><span style="color: #fff">去逛逛</span></el-button>
            </div>
            <template v-else>
                <div
                    style="width: 95%;margin: 0 auto;background: #fff;padding: 10px;border-radius: 5px;">
                    <div v-for="(item, index) in cartList">
                        <el-checkbox v-model="checkedGoodsList" :label="item.id" :key="item.id">
                            <span style="display: none">{{item.id}}</span>
                        </el-checkbox>
                        <div style="display: inline-block;width: 18%;margin-right: 5px">
                            <el-image :src="item.goods_sku.sku_img"
                                      style="vertical-align: middle;"></el-image>
                        </div>
                        <div style="display: inline-block;vertical-align: middle;width: 70%">
                            <h4 style="color: #2b2b2b">{{item.goods_sku.goods_name}}</h4>
                            <div
                                style="font-size: 12px;background: #ddd;padding: 0 5px;border-radius: 3px;
                                text-overflow: ellipsis;word-break: keep-all;width: 100%;white-space:normal;
                                word-wrap:break-word; ">
                                {{item.goods_sku.sku_content | getSkuContentValue}}
                            </div>
                            <div style="display: flex;justify-content: space-between;align-items: center">
                                <div style="color: #d58467;font-weight: bold;">
                                    <template v-if="isLiving">
                                        <div>¥{{item.goods_sku.video_price}}</div>
                                    </template>
                                    <template v-else>
                                        <div v-if="user.identity==1">¥{{item.goods_sku.normal_price}}</div>
                                        <div v-else>¥{{item.goods_sku.member_price}}</div>
                                    </template>
                                </div>
                                <div>
                                    <i class="el-icon-remove-outline" style="vertical-align: middle"
                                       @click="cutGoodsNum(index)"></i>
                                    <span style="font-size: 12px;margin: 0 5px">
                                        {{item.goods_number}}
                                    </span>
                                    <i class="el-icon-circle-plus-outline" style="vertical-align: middle"
                                       @click="addGoodsNum(index)"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    style="width: 95%;margin: 10px auto 0;background: #fff;padding: 10px;border-radius: 5px;font-size: 14px;
                        display: flex;justify-content: space-between;align-items: center;">
                    <div>合计 <span style="font-weight: bold">¥ {{sum}}</span></div>
                    <el-button type="primary" size="small" @click="createOrder">去结算</el-button>
                </div>
            </template>

        </div>
        <div v-else>请登录</div>

    </div>
</template>
<script lang="ts">
    import {Vue, Component} from 'vue-property-decorator';
    import {CartGoodsList, cartGoodsList, deleteCart, updateCart} from '@/service/fs/fs-cart-service';
    import moment from 'moment';
    import {createOrder} from '@/service/fs/fs-order-service';
    import {getPayOrderConfig, WxPayConfig} from '@/service/fs/fs-pay-service';

    @Component({
        filters: {
            getSkuContentValue(sku: any) {
                let skuObj = JSON.parse(sku);
                let strArr = [];
                for (const k in skuObj) {
                    strArr.push(skuObj[k]);
                }
                return strArr.join('，');
            },
        },
    })
    export default class FsCart extends Vue {
        private loading: boolean = false;
        private cartList: CartGoodsList[] = [];
        private total: number | null = null;
        private checkedGoodsList: any[] = [];

        get user() {
            if (this.$store.state.user) {
                return this.$store.state.user;
            }
            return null;
        }

        get isLiving() {
            const begin = +moment(this.$store.state.config.video_begin_time).format('x');
            const end = +moment(this.$store.state.config.video_end_time).format('x');
            const now = new Date().getTime();
            return now > begin && now < end;
        }

        get sum() {
            const priceArr = this.cartList.map((item) => {
                if (this.checkedGoodsList.indexOf(item.id) < 0) {
                    return 0;
                }
                if (this.isLiving) {
                    return +item.goods_sku.video_price * +item.goods_number;
                }
                if (!this.isLiving) {
                    if (this.user.identity == 1) {
                        return +item.goods_sku.normal_price * +item.goods_number;
                    }
                    return +item.goods_sku.member_price * +item.goods_number;
                }
            });
            if (priceArr.length == 0) {
                return 0;
            }
            return priceArr.reduce((total: any, current: any, index: any, arr: any[]) => {
                if (total >= 0 && current >= 0) {
                    return total += current;
                }
            });
        }

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
                        type: 'warning',
                        message: error,
                    });
                })
                .finally(() => this.loading = false);
        }

        private goGoodsList() {
            this.$router.push('/fs/main/home');
        }

        private addGoodsNum(index: number) {
            this.loading = true;
            updateCart(this.cartList[index].id, this.cartList[index].goods_number + 1)
                .then(() => {
                    this.cartList[index].goods_number++;
                })
                .catch((error) => {
                    this.$message({
                        type: 'warning',
                        message: error,
                    });
                })
                .finally(() => this.loading = false);
        }

        private cutGoodsNum(index: number) {
            this.loading = true;
            if (this.cartList[index].goods_number - 1 <= 0) {
                deleteCart(this.cartList[index].id)
                    .then(() => {
                        this.cartList.splice(index, 1);
                    })
                    .catch((error) => {
                        this.$message({
                            type: 'warning',
                            message: error,
                        });
                    })
                    .finally(() => this.loading = false);
            }
            updateCart(this.cartList[index].id, this.cartList[index].goods_number - 1)
                .then(() => {
                    this.cartList[index].goods_number--;
                })
                .catch((error) => {
                    this.$message({
                        type: 'warning',
                        message: error,
                    });
                })
                .finally(() => this.loading = false);
        }

        private createOrder() {
            if (this.checkedGoodsList.length == 0) {
                this.$message({
                    type: 'warning',
                    message: '没有选中任何商品',
                });
                return;
            }
            if (this.user.identity == 3 || this.user.identity == 4) {
                this.$message({
                    type: 'warning',
                    message: '大代理和业务员无法下单',
                });
                return;
            }
            this.$confirm(`共计${this.sum}元，是否下单`)
                .then(() => {
                    this.loading = true;
                    createOrder(({
                        type: 5,
                        cart_id: this.checkedGoodsList,
                    }))
                        .then((res) => {
                            if (this.user.identity == 1) {
                                return getPayOrderConfig(2, res.order_sn);
                            }
                            window.location.reload();
                            return Promise.resolve(null);
                        })
                        .then((res: WxPayConfig | null) => {
                            if (!res) {
                                return;
                            }
                            (WeixinJSBridge as any).invoke(
                                'getBrandWCPayRequest', {
                                    'appId': res.appId,     //公众号名称，由商户传入
                                    'timeStamp': res.timestamp, //时间戳，自1970年以来的秒数
                                    'nonceStr': res.nonceStr, //随机串
                                    'package': res.package,
                                    'signType': res.signType,  //微信签名方式;
                                    'paySign': res.paySign, //微信签名
                                },
                                function (res: any) {
                                    if (res.err_msg == 'get_brand_wcpay_request:ok') {
                                        // 使用以上方式判断前端返回,微信团队郑重提示：
                                        //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
                                        //do something
                                        window.location.reload();
                                    } else {
                                        alert('支付失败');
                                    }
                                });
                        })
                        .catch((error) => {
                            this.$message({
                                type: 'warning',
                                message: error,
                                duration: 1000,
                            });
                        })
                        .finally(() => this.loading = false);
                });
        }
    }
</script>