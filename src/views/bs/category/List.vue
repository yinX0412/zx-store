<template>
    <div v-loading="loading">
        <div>
            <el-button type="primary" size="small" @click="$router.push('/bs/category/create')">创建</el-button>
        </div>
        <el-table
            :data="categoryList" border
            style="width: 100%;margin-top: 20px;">
            <el-table-column type="index"></el-table-column>
            <el-table-column
                label="分类名称">
                <template slot-scope="scope">
                    <el-button type="text" @click="$router.push('/bs/category/'+scope.row.id)">
                        {{scope.row.category_name}}
                    </el-button>
                </template>
            </el-table-column>
            <el-table-column
                label="分类图片">
                <template slot-scope="scope">
                    <el-image :src="scope.row.image" style="width: 100px"></el-image>
                </template>
            </el-table-column>
            <el-table-column
                label="分类属性">
                <template slot-scope="scope">
                    <div>{{scope.row.attribute.map(item=>item.attribute_name).join('，')}}</div>
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
                    <el-button type="danger" size="small" @click="deleteCategory(scope.row.id, scope.$index)">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script lang="ts">
    import {Vue, Component} from 'vue-property-decorator';
    import {deleteCategory, getCategoryList} from '@/service/bs/bs-category-service';

    @Component
    export default class BsCategoryList extends Vue {
        private categoryList: any[] = [];
        private loading: boolean = false;

        private created() {
            this.getCategoryList();
        }

        private getCategoryList() {
            this.loading = true;
            getCategoryList()
                .then((res) => {
                    this.categoryList = res;
                })
                .catch((error) => this.$message({
                    type: 'warning',
                    message: error,
                }))
                .finally(() => this.loading = false);
        }

        private deleteCategory(id: string, index: number) {
            this.$confirm('确认删除该分类？')
                .then(() => {
                    this.loading = true;
                    return deleteCategory(id);
                })
                .then(() => {
                    this.$message({
                        type: 'success',
                        message: ' 删除成功',
                    });
                    this.categoryList.splice(index, 1);
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
