<template>
    <div style="background: #fff;height: 100vh;padding: 10px">
        <el-select v-model="orderType" size="small" @change="getOrderList">
            <el-option
                v-for="item in orderTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
        </el-select>
        <div v-if="total==0" style="text-align: center;margin-top: 100px">
            暂无订单
        </div>
        <div v-else>
            <div v-for="item in orderList">
                <div>
                    <div v-for="order in item.order_list"
                         style="padding: 10px;border: 1px solid #ddd;border-radius: 5px;box-shadow: 0 0 4px 1px #ddd;margin-top: 20px">
                        <div
                            style="padding-bottom: 3px;border-bottom: 1px solid #ddd;margin-bottom: 10px;
                                    display: flex;justify-content: space-between;align-items: center">
                            <div>{{item.store_name}}</div>
                            <div style="font-size: 12px">{{order.status | formatStatus}}</div>
                        </div>
                        <div style="font-size: 12px;margin-bottom: 10px">订单号：{{order.order_sn}}</div>
                        <div v-for="good in order.goods_sku" style="margin-bottom: 10px">
                            <div style="display: inline-block;width: 18%;margin-right: 5px">
                                <el-image :src="good.sku_img"
                                          style="vertical-align: middle;"></el-image>
                            </div>
                            <div style="display: inline-block;vertical-align: middle;width: 70%">
                                <h4 style="color: #2b2b2b">{{good.goods_name}}</h4>
                                <div style="font-size: 12px;background: #ddd;padding: 0 5px;border-radius: 3px;
                                text-overflow: ellipsis;word-break: keep-all;width: 100%;white-space:normal;
                                word-wrap:break-word; ">
                                    {{good.sku_content | getSkuContentValue}}
                                </div>
                            </div>

                        </div>
                        <div style="text-align: center" v-if="order.status==2">
                            <el-button type="primary" size="small" @click="pay(order.order_sn)">支付</el-button>
                        </div>
                        <div style="text-align: center" v-if="order.status==4 && user && user.identity==2">
                            <el-button type="primary" size="small" @click="confirmOrderCommand(order)">确认订单</el-button>
                        </div>
                        <div style="text-align: center" v-if="order.status==5 && user && user.identity==4">
                            <el-button type="primary" size="small" @click="confirmOrderCommand(order)">确认订单</el-button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
        <el-dialog
            title="确认订单"
            :visible.sync="showHasGoods"
            @close="closeConfirm"
            width="300px">
            <el-radio-group v-model="hasGoods">
                <el-radio :label="true">门店有货</el-radio>
                <el-radio :label="false">门店无货</el-radio>
            </el-radio-group>
            <span slot="footer" class="dialog-footer">
            <el-button @click="closeConfirm" size="small">取 消</el-button>
            <el-button type="primary" @click="memberConfirm" size="small">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>
<script lang="ts">
    import {Vue, Component} from 'vue-property-decorator';
    import {getOrderList, Order, OrderList} from '../../../../service/fs/fs-order-service';
    import {confirmOrder, getPayOrderConfig, WxPayConfig} from '@/service/fs/fs-pay-service';

    @Component({
        filters: {
            formatStatus(status: 2 | 3 | 4 | 5 | 6) {
                switch (status) {
                    case 2:
                        return '待支付';
                    case 3:
                        return '上级待返款';
                    case 4:
                        return '会员待确认';
                    case 5:
                        return '大代理待确认';
                    case 6:
                        return '已完成';
                }
            },
            getSkuContentValue(sku: any) {
                let skuObj = JSON.parse(sku);
                let strArr = [];
                for (const k in skuObj) {
                    strArr.push(skuObj[k]);
                }
                return strArr.join('，');
            }
        },
    })
    export default class FsOrderList extends Vue {
        private loading: boolean = false;
        private showHasGoods: boolean = false;
        private hasGoods: boolean = true;
        private total: number | null = null;
        private orderList: OrderList[] = [];
        private orderType: 2 | 3 | 4 = 2;
        private activeOrderSn: string = '';
        private orderTypeList = [
            {
                label: '直播订单',
                value: 2,
            },
            {
                label: '日常订单',
                value: 3,
            },
            {
                label: '定制订单',
                value: 4,
            },
        ];

        get user() {
            if (this.$store.state.user) {
                return this.$store.state.user;
            }
        }

        private created(): void {
            this.getOrderList();
        }

        private getOrderList() {
            this.loading = true;
            getOrderList(this.orderType)
                .then((res) => {
                    this.total = res.total;
                    this.orderList = res.list;
                })
                .catch((error) => {
                    this.$message({
                        type: 'warning',
                        message: error,
                    });
                })
                .finally(() => this.loading = false);
        }

        private pay(sn: string) {
            this.loading = true;
            getPayOrderConfig(2, sn)
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
        }


        private confirmOrderCommand(order: Order) {
            this.activeOrderSn = order.order_sn;
            console.log(this.user);
            if (this.user.identity == 2) {
                this.showHasGoods = true;
                return;
            }
            this.confirmOrder(1);
        }

        private confirmOrder(type: 1 | 2) {
            if (!this.activeOrderSn) {
                this.$message({
                    type: 'warning',
                    message: '订单号错误',
                    duration: 1000,
                });
                return;
            }
            this.loading = true;
            confirmOrder(type, this.activeOrderSn)
                .then((res) => {
                    this.$message({
                        type: 'success',
                        message: '操作成功',
                        duration: 1000,
                    });
                    window.location.reload();
                })
                .catch((error) => {
                    this.$message({
                        type: 'warning',
                        message: error,
                        duration: 1000,
                    });
                })
                .finally(() => {
                    this.loading = false;
                    this.closeConfirm();
                });

        }

        private closeConfirm() {
            this.activeOrderSn = '';
            this.hasGoods = true;
            this.showHasGoods = false;
        }

        private memberConfirm() {
            if (this.hasGoods) {
                this.confirmOrder(2);
                return;
            }
            this.confirmOrder(1);
        }
    }
</script>