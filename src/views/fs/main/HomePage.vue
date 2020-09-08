<style lang="less">
    .row-flex-box {
        display: flex;
        justify-content: space-between;
    }
</style>
<template>
    <div style="padding: 5px;background: #f3f4f5;" v-if="goodsList" v-loading="loading">
        <el-carousel :height="carouselHeight+'px'" style="margin-bottom: 20px" indicator-position="none">
            <el-carousel-item v-for="item in bannerList">
                <el-image :src="'http://annual.gengyong.com.cn'+item"
                          :style="{width:'100%', height:carouselHeight+'px'}"></el-image>
            </el-carousel-item>

        </el-carousel>
        <div style="margin-bottom: 20px;font-weight: bold">
            <div id="firstBox" v-if="goodsList&&goodsList.series_list.length>=5">
                <div :style="firstSeriesBox" class="row-flex-box">
                    <div :style="firstSeries" @click="filterBySeries(goodsList.series_list[0].id)">
                        {{goodsList.series_list[0].series_name}}
                    </div>
                    <div style="width: 33%;display: flex;justify-content: space-between;flex-direction: column;">
                        <div :style="secondSeries" @click="filterBySeries(goodsList.series_list[1].id)">
                            {{goodsList.series_list[1].series_name}}
                        </div>
                        <div :style="thirdSeries" @click="filterBySeries(goodsList.series_list[2].id)">
                            {{goodsList.series_list[2].series_name}}
                        </div>
                    </div>
                </div>
                <div class="row-flex-box" :style="secondSeriesBox">
                    <div style="width: 66%;" class="row-flex-box">
                        <div :style="fourthSeries" @click="filterBySeries(goodsList.series_list[3].id)">
                            {{goodsList.series_list[3].series_name}}
                        </div>
                        <div :style="fifthSeries" @click="filterBySeries(goodsList.series_list[4].id)">
                            {{goodsList.series_list[4].series_name}}
                        </div>
                    </div>

                    <div style="width: 33%;color: #606266;background: #fff" @click="goCustom">定制
                    </div>
                </div>
            </div>

        </div>
        <div>
            <h4 style="margin-bottom: 10px;">每日热卖</h4>
            <el-row :gutter="10" v-for="col in initalList">
                <el-col :span="12" v-for="item in col" :key="item.id" style="margin-bottom: 10px">
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
    </div>
</template>
<script lang="ts">
    import {Vue, Component} from 'vue-property-decorator';
    import {getGoodsList, GoodsList} from '@/service/fs/fs-goods-service';
    import {getBannerList} from '@/service/fs/fs-auth-service';

    @Component
    export default class FsHomePage extends Vue {
        private loading: boolean = false;
        private goodsList: GoodsList | null = null;
        private list: any[] = [];
        private initalList: any[] = [];
        private goodsForm = {
            page: 1,
            page_count: 20,
            series_id: '',
        };
        private carouselHeight: number = 150;

        get user() {
            return this.$store.state.user;
        }

        private total: number = 0;
        private bannerList: string[] = [];

        get firstSeriesBox() {
            return {
                marginBottom: '3px',
                height: (document.body.clientWidth - 10) / 3 + 'px',
            };
        }

        get secondSeriesBox() {
            return {
                height: (document.body.clientWidth - 10) / 9 + 'px',
                lineHeight: (document.body.clientWidth - 10) / 9 + 'px',
                fontSize: '14px',
                textAlign: 'center',
            };
        }

        get firstSeries() {
            if (!this.goodsList) {
                return;
            }
            if (this.goodsList.series_list.length < 5) {
                return;
            }
            return {
                width: '66%',
                backgroundImage: `url(${this.goodsList.series_list[0].image})`,
                backgroundSize: '100% 100%',
                lineHeight: (document.body.clientWidth - 10) / 3 + 'px',
                textAlign: 'center',
                color: '#fff',
            };
        }

        get secondSeries() {
            if (!this.goodsList) {
                return;
            }
            if (this.goodsList.series_list.length < 5) {
                return;
            }
            return {
                height: '49%',
                lineHeight: (document.body.clientWidth - 10) / 3 * 0.49 + 'px',
                backgroundImage: `url(${this.goodsList.series_list[1].image})`,
                backgroundSize: '100% 100%',
                textAlign: 'center',
                color: '#fff',
            };
        }

        get thirdSeries() {
            if (!this.goodsList) {
                return;
            }
            if (this.goodsList.series_list.length < 5) {
                return;
            }
            return {
                height: '49%',
                lineHeight: (document.body.clientWidth - 10) / 3 * 0.49 + 'px',
                backgroundImage: `url(${this.goodsList.series_list[2].image})`,
                backgroundSize: '100% 100%',
                textAlign: 'center',
                color: '#fff',
            };
        }

        get fourthSeries() {
            if (!this.goodsList) {
                return;
            }
            if (this.goodsList.series_list.length < 5) {
                return;
            }
            return {
                width: '49%',
                backgroundImage: `url(${this.goodsList.series_list[3].image})`,
                backgroundSize: '100% 100%',
                textAlign: 'center',
                color: '#fff',
            };
        }

        get fifthSeries() {
            if (!this.goodsList) {
                return;
            }
            if (this.goodsList.series_list.length < 5) {
                return;
            }
            return {
                width: '49%',
                backgroundImage: `url(${this.goodsList.series_list[4].image})`,
                backgroundSize: '100% 100%',
                textAlign: 'center',
                color: '#fff',
            };
        }

        private created(): void {
            this.getGoodsList();
            this.getBanner();
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

        private getBanner() {
            getBannerList()
                .then((res) => {
                    this.bannerList = res;
                })
                .catch((error) => {
                    this.$message({
                        type: 'warning',
                        message: error,
                    });
                });
        }

        private getGoodsList() {
            this.loading = true;
            getGoodsList(this.goodsForm.page, this.goodsForm.page_count, this.goodsForm.series_id)
                .then((res) => {
                    this.total = res.total;
                    this.list.push(...res.goods_list);
                    this.twoItemEachItemList(this.list);
                    this.goodsList = res;
                })
                .catch((error) => {
                    this.$message({
                        type: 'warning',
                        message: error,
                    });
                })
                .finally(() => this.loading = false);
        }

        private filterBySeries(id: string) {
            this.$router.push(`/fs/goods/list/${id}`);
        }

        private goCustom() {
            if (this.user.identity != 2) {
                this.$message({
                    type: 'warning',
                    message: '只有会员可以前往定制订单',
                });
                return;
            }
            this.$router.push('/fs/customMade');
        }

        /**
         * 一行两列初始化数组，变成一个二维数组，每个数组里面包含两项，防止item高度不一样导致的错位
         * @param list
         */
        public twoItemEachItemList(list: any[]) {
            /**
             * 列表长度/2，有余则+1，就是这个数组的长度
             */
            const lineNum = list.length % 2 === 0 ? list.length / 2 : Math.floor((list.length / 2) + 1);
            const newList: any[][] = [];
            for (let i = 0; i < lineNum; i++) {
                /**
                 * 新数组每项添加2条数据
                 */
                const temp = list.slice(i * 2, i * 2 + 2);
                newList.push(temp);
            }
            this.initalList = newList;
        }
    }
</script>