<template>
    <div v-loading="loading">
        <div style="justify-content: space-between;width: 100%;margin: 0 auto;text-align: center">
            <!--<div style="text-align: center;color: rgb(86, 92, 99)">-->
                <!--<h3>今日订单数</h3>-->
                <!--<div>99</div>-->
            <!--</div>-->
            <!--<div style="width: 1px;height: 40px;background: #ddd"></div>-->
            <div style="text-align: center;color: rgb(86, 92, 99)">
                <h2 style="margin-bottom: 15px">今日销售额</h2>
                <div>{{stats.length>0?stats[stats.length-1].money:0}}</div>
            </div>
        </div>
        <div style="width: 100%;height: 5px;background: #ddd;margin: 20px 0"></div>
        <!--<div>-->
        <!--<span style="color: rgb(86, 92, 99)">日期：</span>-->
        <!--<el-date-picker-->
        <!--v-model="duration"-->
        <!--type="daterange"-->
        <!--range-separator="至"-->
        <!--:clearable="false"-->
        <!--start-placeholder="开始日期"-->
        <!--end-placeholder="结束日期"-->
        <!--size="small">-->
        <!--</el-date-picker>-->
        <!--</div>-->
        <div id="chart" style="width: 100%;height: 350px;margin-top: 20px"></div>
    </div>
</template>
<script lang="ts">
    import {Vue, Component} from 'vue-property-decorator';
    import {getStats} from '@/service/bs/bs-goods-service';
    import * as echarts from 'echarts';

    @Component
    export default class BsHomePage extends Vue {
        private loading: boolean = false;
        private stats: Array<{ date: string, money: string }> = [];
        private duration: any = [new Date(new Date().getTime() - 144 * 60 * 60 * 1000), new Date()];

        private mounted(): void {
            this.getStat();
        }

        private getStat() {
            this.loading = true;
            getStats(this.duration[0], this.duration[1])
                .then((res) => {
                    this.stats = res;
                    this.init();
                })
                .catch((error) => alert(error))
                .finally(() => this.loading = false);
        }

        private init() {
            const optionChart = echarts.init(document.getElementById('chart') as any);
            const chartOptions: any = {
                title: {
                    text: '销售额曲线图',
                },
                xAxis: {
                    name: '日期',
                    type: 'category',
                    data: this.stats.map((i) => i.date),
                },
                yAxis: {
                    type: 'value'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
                    },
                },
                series: [
                    {
                        name: '销售额（元）',
                        data: this.stats.map((i) => i.money),
                        type: 'line',
                    },
                ],
            };
            optionChart.setOption(chartOptions);

        }
    }
</script>