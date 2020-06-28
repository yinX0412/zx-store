<template>
    <div style="padding: 5px;background: #f3f4f5;" v-if="goodsList" v-loading="loading">
        <el-carousel :height="carouselHeight+'px'" style="margin-bottom: 20px">
            <el-carousel-item style="background: aquamarine;">
                <h3 class="small">1</h3>
            </el-carousel-item>
            <el-carousel-item style="background: rebeccapurple;">
                <h3 class="small">2</h3>
            </el-carousel-item>
            <el-carousel-item style="background: brown;">
                <h3 class="small">3</h3>
            </el-carousel-item>
        </el-carousel>
        <div>
            <h4 style="margin-bottom: 10px;">每日热卖</h4>
            <el-row :gutter="10">
                <el-col :span="12" v-for="item in goodsList.goods_list" :key="item.id" style="margin-bottom: 10px">
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
        </div>
    </div>
</template>
<script lang="ts">
    import {Vue, Component} from 'vue-property-decorator';
    import {getGoodsList, GoodsList} from '@/service/fs/fs-goods-service';

    @Component
    export default class FsHomePage extends Vue {
        private loading: boolean = false;
        private goodsList: GoodsList | null = null;
        private goodsForm = {
            page: 1,
            page_count: 20,
            series_id: '',
        };
        private carouselHeight: number = 150;
        private user = this.$store.state.user;

        private created(): void {
            this.getGoodsList();
        }

        get goodsImgStyle() {
            return {
                height: (document.getElementsByClassName('fs-body')[0].clientWidth - 22) / 2 * 3 / 5 + 'px',
                width: '100%',
                borderRadius: '3px 3px 0 0 ',
            };
        }

        private mounted(): void {
            this.carouselHeight = document.getElementsByClassName('fs-body')[0].clientWidth / 3;
        }

        private getGoodsList() {
            this.loading = true;
            getGoodsList(this.goodsForm.page, this.goodsForm.page_count, this.goodsForm.series_id)
                .then((res) => {
                    this.goodsList = res;
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