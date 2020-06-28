<template>
    <div v-loading="loading">
        <div style="display: flex;justify-content: space-between;align-items: center">
            <div>
                <el-button type="primary" size="small" @click="$router.push('/bs/goods/create')">创建</el-button>
            </div>
            <div style="text-align: right">
                <el-input v-model="paginateArgs.goods_name" placeholder="请输入商品名称" size="small"
                          style="width: 200px;margin-right: 10px;" @keyup.enter.native="getGoodsList"></el-input>
                <el-button size="small" @click="getGoodsList">搜索</el-button>
            </div>

        </div>
        <el-table
            :data="goodsList" border
            style="width: 100%;margin-top: 20px;">
            <el-table-column type="index"></el-table-column>
            <el-table-column
                label="商品名称">
                <template slot-scope="scope">
                    <el-button type="text" @click="$router.push('/bs/goods/'+scope.row.id)">
                        {{scope.row.goods_name}}
                    </el-button>
                </template>
            </el-table-column>
            <el-table-column
                prop="category.category_name"
                label="分类">
            </el-table-column>
            <el-table-column
                prop="series.series_name"
                label="系列">
            </el-table-column>
            <el-table-column
                label="状态">
                <template slot-scope="scope">
                    {{scope.row.status === 1? '上架' : '下架'}}
                </template>
            </el-table-column>
            <el-table-column
                label="价格"
                prop="normal_price">
            </el-table-column>
            <el-table-column
                label="会员价"
                prop="member_price">
            </el-table-column>
            <el-table-column
                label="直播价"
                prop="video_price">
            </el-table-column>
            <el-table-column
                label="销量"
                prop="sales_volume">
            </el-table-column>
            <el-table-column
                label="更多操作">
                <template slot-scope="scope">
                    <el-dropdown trigger="click" @command="moreOperations(scope.row.id, $event)">
                      <span class="el-dropdown-link">
                        <el-button size="small">...</el-button>
                      </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="publish" v-if="scope.row.status===2">上架</el-dropdown-item>
                            <el-dropdown-item command="unpublish" v-if="scope.row.status===1">下架</el-dropdown-item>
                            <el-dropdown-item command="delete">删除</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination layout="sizes, total, prev, pager, next,jumper" :total="total"
                       @size-change="getGoodsList"
                       @current-change="getGoodsList"
                       :page-size.sync="paginateArgs.page_count" :current-page.sync="paginateArgs.page"
                       :page-sizes="[20, 50, 100]"
                       style="text-align: center;margin: 10px 0">
        </el-pagination>
    </div>
</template>
<script lang="ts">
    import {Vue, Component} from 'vue-property-decorator';
    import {changeGoodsStatus, getGoodsList, GoodsList} from '@/service/bs/bs-goods-service';

    @Component
    export default class BsGoodsList extends Vue {
        private goodsList: GoodsList[] = [];
        private loading: boolean = false;
        private paginateArgs: { page: number, page_count: number, goods_name?: string } = {
            page: 1,
            page_count: 20,
            goods_name: '',
        };
        private total: number = 0;

        private created() {
            this.getGoodsList();
        }

        private getGoodsList() {
            this.loading = true;
            getGoodsList(this.paginateArgs.page, this.paginateArgs.page_count, this.paginateArgs.goods_name)
                .then((res) => {
                    this.goodsList = res.goods_list;
                    this.total = res.total;
                })
                .catch((error) => this.$message({
                    type: 'error',
                    message: error,
                }))
                .finally(() => this.loading = false);
        }

        private moreOperations(id: string, command: 'publish' | 'unpublish' | 'delete') {
            this.loading = true;
            if (command === 'publish') {
                changeGoodsStatus({
                    goods_id: id,
                    type: 1,
                    status: 1,
                })
                    .then(() => {
                        this.$message({
                            type: 'success',
                            message: '上架成功',
                        });
                        this.goodsList.forEach((item) => {
                            if (item.id === id) {
                                item.status = 1;
                            }
                        });
                    })
                    .catch((error) => {
                        this.$message({
                            type: 'error',
                            message: error,
                        });
                    })
                    .finally(() => this.loading = false);
                return;
            }
            if (command === 'unpublish') {
                changeGoodsStatus({
                    goods_id: id,
                    type: 1,
                    status: 2,
                })
                    .then(() => {
                        this.$message({
                            type: 'success',
                            message: '下架成功',
                        });
                        this.goodsList.forEach((item) => {
                            if (item.id === id) {
                                item.status = 2;
                            }
                        });
                    })
                    .catch((error) => {
                        this.$message({
                            type: 'error',
                            message: error,
                        });
                    })
                    .finally(() => this.loading = false);
                return;
            }
            if (command === 'delete') {
                this.$confirm('确认删除该商品？')
                    .then(() => {
                        return changeGoodsStatus({
                            goods_id: id,
                            type: 1,
                            status: 3,
                        });
                    })
                    .then(() => {
                        this.$message({
                            type: 'success',
                            message: '删除成功',
                        });
                        this.getGoodsList();
                    })
                    .catch((error) => {
                        this.$message({
                            type: 'error',
                            message: error,
                        });
                    })
                    .finally(() => this.loading = false);
                return;
            }
        }
    }
</script>
