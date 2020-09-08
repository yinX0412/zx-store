<template>
    <div style="padding: 10px">
        <h3 style="margin-bottom: 10px;text-align: center">{{seriesName}}</h3>
        <el-row :gutter="10">
            <el-col :span="12" v-for="item in list" :key="item.id" style="margin-bottom: 10px">
                <div @click="$router.push('/fs/goods/'+item.id)">
                    <el-image :style="goodsImgStyle" :src="item.main_img"></el-image>
                    <div style="min-height: 70px;border-radius: 0 0 3px 3px;background: #fff;padding: 0 5px 0 5px">
                        <div style="font-size: 14px;color: #454545">
                            {{item.goods_name}}
                        </div>
                        <div>
                                <span
                                    style="color: #d58467;font-weight: bold;margin-right: 10px;"
                                    v-if="!user|user.identity!==1">¥ {{item.member_price}}</span>
                            <span style="color: #d58467;font-weight: bold;margin-right: 10px;" v-else>¥ {{item.normal_price}}</span>
                        </div>
                        <div style="color: #9a9a9a;font-size: 12px">
                            已售{{item.sales_volume}}
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>
        <div style="text-align: center">
            <el-button type="text" v-if="list.length<total" @click="goodsForm.page++;getGoodsList">加载更多</el-button>
        </div>
    </div>
</template>
<script lang="ts">
    import {Vue, Component} from 'vue-property-decorator';
    import {getGoodsList, GoodsList} from '@/service/fs/fs-goods-service';

    @Component
    export default class FsSeriesOfGoods extends Vue {
        private loading: boolean = false;
        private goodsList: GoodsList | null = null;
        private list: any[] = [];
        private total: number = 0;
        private seriesName: string = '';
        private goodsForm = {
            page: 1,
            page_count: 20,
            series_id: '',
        };

        get user() {
            return this.$store.state.user;
        };

        get goodsImgStyle() {
            return {
                height: (document.getElementsByClassName('fs-body')[0].clientWidth - 22) / 2 * 3 / 5 + 'px',
                width: '100%',
                borderRadius: '3px 3px 0 0 ',
            };
        }

        private created(): void {
            this.goodsForm.series_id = (this.$route.params as any).seriesId;
            this.getGoodsList();
        }

        private getGoodsList() {
            this.loading = true;
            getGoodsList(this.goodsForm.page, this.goodsForm.page_count, this.goodsForm.series_id)
                .then((res) => {
                    this.goodsList = res;
                    this.total = res.total;
                    this.list.push(...res.goods_list);
                    res.series_list.forEach((item) => {
                        if (item.id.toString() == this.goodsForm.series_id.toString()) {
                            this.seriesName = item.series_name;
                        }
                    });
                })
                .catch((error) => {
                    this.$message({
                        type: 'warning',
                        message: error,
                    });
                })
                .finally(() => this.loading = false);
        }
    }
</script>