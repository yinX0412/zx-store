<template>
    <div v-loading="loading">
        <el-table
            border
            :data="orderList"
            style="width: 100%">
            <el-table-column
                type="index"
            >
            </el-table-column>
            <el-table-column
                prop="order_sn"
                width="180"
                label="订单号">
            </el-table-column>
            <el-table-column
                label="订单类型">
                <template slot-scope="scope">
                    <div>{{scope.row.order_type | orderTypeFilter}}</div>
                </template>
            </el-table-column>
            <el-table-column
                label="订单状态">
                <template slot-scope="scope">
                    <div>{{scope.row.status | orderStatusFilter}}</div>
                </template>
            </el-table-column>
            <el-table-column
                prop="user.username"
                label="创建者">
            </el-table-column>
            <el-table-column
                prop="custom_content"
                label="定制内容">
            </el-table-column>

            <el-table-column
                prop="amount"
                label="金额（元）">
            </el-table-column>
        </el-table>
    </div>
</template>
<script lang="ts">
    import {Vue, Component} from 'vue-property-decorator';
    import {getOrderList} from '../../../service/bs/bs-order-service';

    @Component({
        filters: {
            orderTypeFilter(order_type: 2 | 3 | 4) {
                switch (order_type) {
                    case 2:
                        return '直播订单';
                    case 3:
                        return '日常订单';
                    case 4:
                        return '定制订单';
                }
            },
            orderStatusFilter(order_type: 2 | 3 | 4 | 5 | 6) {
                switch (order_type) {
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
    export default class BsOrderList extends Vue {
        private orderList: any[] = [];
        private loading: boolean = false;
        private paginateArgs: { page: number, page_count: number, address_id: string } = {
            page: 1,
            page_count: 20,
            address_id: '',
        };
        private total: number = 0;

        private created() {
            this.getOrderList();
        }

        private getOrderList() {
            this.loading = true;
            getOrderList(this.paginateArgs.page, this.paginateArgs.page_count, this.paginateArgs.address_id)
                .then((res) => {
                    this.orderList = res.list;
                    this.total = res.total;
                })
                .catch((error) => this.$message({
                    type: 'warning',
                    message: error,
                }))
                .finally(() => this.loading = false);
        }
    }
</script>
