<template>
    <div v-loading="loading">
        <div>
            <el-button type="primary" size="small" @click="$router.push('/bs/series/create')">创建</el-button>
        </div>
        <el-table
            :data="seriesList" border
            style="width: 100%;margin-top: 20px;">
            <el-table-column type="index"></el-table-column>
            <el-table-column
                label="系列名称">
                <template slot-scope="scope">
                    <el-button type="text" @click="$router.push('/bs/series/'+scope.row.id)">
                        {{scope.row.series_name}}
                    </el-button>
                </template>
            </el-table-column>
            <el-table-column
                label="系列图片">
                <template slot-scope="scope">
                    <el-image :src="scope.row.image" style="width: 100px"></el-image>
                </template>
            </el-table-column>
            <el-table-column
                label="创建时间"
                prop="created_at">
            </el-table-column>
            <el-table-column
                label="更新时间"
                prop="updated_at">
            </el-table-column>
            <el-table-column
                width="100px"
                label="更多操作">
                <template slot-scope="scope">
                    <el-button type="danger" size="small" @click="deleteSeries(scope.row.id, scope.$index)">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script lang="ts">
    import {Vue, Component} from 'vue-property-decorator';
    import {deleteSeries, getSeriesList, SeriesList} from '../../../service/bs/bs-series-service';

    @Component
    export default class BsSeriesList extends Vue {
        private seriesList: SeriesList[] = [];
        private loading: boolean = false;

        private created() {
            this.getSeriesList();
        }

        private getSeriesList() {
            this.loading = true;
            getSeriesList()
                .then((res) => {
                    this.seriesList = res.list;
                })
                .catch((error) => {
                    this.$message({
                        type: 'warning',
                        message: error,
                    });
                })
                .finally(() => this.loading = false);
        }

        private deleteSeries(id: string, index: number) {
            this.$confirm('确认删除该系列？')
                .then(() => {
                    this.loading = true;
                    return deleteSeries(id);
                })
                .then(() => {
                    this.$message({
                        type: 'success',
                        message: ' 删除成功',
                    });
                    this.seriesList.splice(index, 1);
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
