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
        <div v-if="total===0" style="text-align: center;margin-top: 100px">
            暂无订单
        </div>
        <div v-else>
            <div v-for="item in orderList">
                <div>
                    <span
                        style="font-size: 14px;padding-bottom: 5px;border-bottom: 1px solid #ddd;color: #fff;">{{item.order_sn}}</span>
                    <span>（{{item.status | formatStatus}}）</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import {Vue, Component} from 'vue-property-decorator';
    import {getOrderList, OrderList} from '../../../../service/fs/fs-order-service';

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
        },
    })
    export default class FsOrderList extends Vue {
        private loading: boolean = false;
        private total: number | null = null;
        private orderList: OrderList[] = [];
        private orderType: 2 | 3 | 4 = 2;
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
                        type: 'error',
                        message: error,
                    });
                })
                .finally(() => this.loading = false);
        }
    }
</script>