<template>
    <div v-loading="loading">
        <h3 style="display: block;text-align: center">会员支付</h3>
        <div style="width: 70%;margin: 20px auto 0">
            <el-input v-model="money" placeholder="会员金额599元" style="margin-bottom: 20px" autocomplete="off" disabled>
                <el-image slot="prefix" class="el-input__icon" src="/img/username.svg"
                          style="width: 18px"></el-image>
            </el-input>
        </div>
        <div style="font-size: 12px;text-align: center;">
            <i style="color: #F56C6C;">* </i>
            <span>支付代表您同意</span>
            <el-link style="font-size: 12px;margin-bottom: 3px" type="primary">《筑馨家会员协议》</el-link>
        </div>
        <div style="text-align: center">
            <el-button type="primary" @click="pay">确认支付</el-button>
        </div>
    </div>
</template>
<script lang="ts">
    import {Vue, Component} from 'vue-property-decorator';
    import {getPayOrderConfig} from '@/service/fs/fs-pay-service';
    import {createOrder} from '@/service/fs/fs-order-service';

    @Component
    export default class FsRegister extends Vue {
        private money: number = 599;
        private loading: boolean = false;

        private created(): void {
            if (this.$store.state.config) {
                this.money = this.$store.state.config.membership_fee;
            }
        }

        private pay() {
            const this_ = this;
            this.loading = true;
            createOrder({type: 1})
                .then((res) => {
                    return getPayOrderConfig(1, res.order_sn);
                })
                .then((res) => {
                    console.log('支付会员费');
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
                                this_.$router.replace('/fs/main/home');
                            } else {
                                //支付失败处理
                                alert('支付失败');
                            }
                        });
                })
                .catch((error) => alert(error))
                .finally(() => this.loading = false);

        }
    }
</script>