<template>
    <div style="padding: 15px;background: #fff;min-height: 100vh;text-align: center" v-loading="loading">
        <div style="margin-bottom: 20px">
            <span style="font-size: 14px">材质：</span>
            <el-select v-model="material" size="mini">
                <el-option
                    v-for="item in materialList"
                    :key="item.value"
                    :label="item.value"
                    :value="item.value">
                </el-option>
            </el-select>
        </div>
        <div style="margin-bottom: 15px">
            <span style="font-size: 14px">尺寸：</span>
            <el-select v-model="spec" size="mini">
                <el-option
                    v-for="item in specList"
                    :key="item.value"
                    :label="item.value"
                    :value="item.value">
                </el-option>
            </el-select>
        </div>
        <div style="margin-bottom: 15px">
            <span style="font-size: 14px">颜色：</span>
            <el-select v-model="color" size="mini">
                <el-option
                    v-for="item in colorList"
                    :key="item.value"
                    :label="item.value"
                    :value="item.value">
                </el-option>
            </el-select>
        </div>
        <div style="text-align: center">
            <el-button type="primary" size="small" @click="createOrder">下单</el-button>
        </div>
    </div>
</template>
<script lang="ts">
    import {Vue, Component} from 'vue-property-decorator';
    import {createOrder} from '@/service/fs/fs-order-service';

    @Component
    export default class FsCustomMade extends Vue {
        private loading: boolean = false;
        private material: string = '';
        private spec: string = '';
        private color: string = '';
        private materialList = [
            {
                value: '全铝',
            },
            {
                value: '航空版',
            },
        ];
        private specList = [
            {
                value: '100*100*100',
            },
            {
                value: '200*200*100',
            },
        ];
        private colorList = [
            {
                value: '红色',
            },
            {
                value: '黑色',
            },
        ];

        get user() {
            if (this.$store.state.user) {
                return this.$store.state.user;
            }
            return null;
        }

        private createOrder() {
            if (this.user.identity != 2) {
                this.$message({
                    type: 'warning',
                    message: '只有会员可以下定制订单',
                });
                return;
            }
            this.$confirm('确认下单？')
                .then(() => {
                    this.loading = true;
                    return createOrder({
                        type: 4,
                        custom_content: {
                            material: this.material,
                            color: this.color,
                            spec: this.spec,
                        },
                    });
                })
                .then(() => {
                    this.$message({
                        message: '下单成功',
                        type: 'success',
                    });
                    this.$router.replace('/fs');
                })
                .catch((error) => {
                    this.$message({
                        type: 'warning',
                        message: error,
                    });
                })
                .finally(() => this.loading = false);

        };
    }
</script>