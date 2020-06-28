<template>
    <div v-loading="loading">
        <div style="padding-bottom: 10px;border-bottom: 1px solid #ddd;margin-bottom: 20px">
            <el-button @click="$router.go(-1)">返回</el-button>
        </div>
        <el-form ref="form" :model="form">
            <el-form-item label="分类名称">
                <el-input v-model="form.category_name" size="small" placeholder="请输入分类名称"
                          style="width: 200px"></el-input>
            </el-form-item>
            <el-form-item label="分类图片">
                <el-image v-if="form.image" :src="form.image"
                          style="width: 200px;vertical-align: middle"></el-image>
                <el-upload
                    style="display: inline-block;vertical-align: middle;margin-left: 10px;"
                    action=""
                    accept="image/*"
                    :auto-upload="false"
                    :on-change="uploadImg"
                    :show-file-list="false">
                    <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
            </el-form-item>
            <el-form-item label="分类属性">
                <div style="display: inline-block;margin-right: 20px" v-if="selectedArr.length > 0">
                    {{selectedArr.map((item) => item.attribute_name).join(',')}}
                </div>
                <el-button size="small" @click="dialogVisible=true">选择</el-button>
            </el-form-item>
        </el-form>
        <el-button type="primary" size="small" @click="updatwCategory">保存</el-button>
        <el-dialog
            title="分类属性"
            @close="closeDialog"
            :visible.sync="dialogVisible"
            width="50%">
            <div>
                <el-table
                    @selection-change="changeSelectAttr"
                    :data="attrList"
                    ref="attrTable"
                    style="width: 100%">
                    <el-table-column type="selection"></el-table-column>
                    <el-table-column
                        prop="attribute_name"
                        label="属性名称">
                    </el-table-column>
                    <el-table-column
                        label="属性详情"
                        width="500">
                        <template slot-scope="scope">
                            <div>{{scope.row.attribute_value}}</div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <span slot="footer" class="dialog-footer">
            <el-button @click="closeDialog">取 消</el-button>
            <el-button type="primary" @click="selectAttr">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>
<script lang="ts">
    import {Vue, Component} from 'vue-property-decorator';
    import {
        AttributeList, CategoryList,
        getAttrList, getCategory, updateCategory, UpdateCategoryArgs,
    } from '@/service/bs/bs-category-service';
    import {uploadImg} from '@/service/bs/bs-img-upload-service';
    import {ElUploadInternalFileDetail} from 'element-ui/types/upload';

    @Component
    export default class BsCreateCategory extends Vue {
        private loading = false;
        private dialogVisible = false;
        private form: UpdateCategoryArgs = {
            category_id: '',
            category_name: '',
            image: '',
            attribute_id: [],
        };
        private attrList: AttributeList[] = [];
        private tableSelectedAttr: AttributeList[] = [];
        private selectedArr: AttributeList[] = [];
        private category: CategoryList | null = null;

        private created(): void {
            this.getAttrList();
            this.getCategory();
        }

        private getCategory() {
            this.loading = true;
            getCategory((this.$route.params as any).id)
                .then((res) => {
                    this.category = res;
                    this.form = {
                        category_id: res.id,
                        category_name: res.category_name,
                        image: this.baseUrl + res.image,
                        attribute_id: res.attribute.map((item) => item.id),
                    };
                    this.selectedArr = res.attribute;
                })
                .catch((error) => this.$message({message: error, type: 'error'}))
                .finally(() => this.loading = false);
        }

        private getAttrList() {
            this.loading = true;
            getAttrList()
                .then((list) => this.attrList = list)
                .catch((error) => this.$message({message: error, type: 'error'}))
                .finally(() => this.loading = false);
        }

        private uploadImg(file: ElUploadInternalFileDetail) {
            if (file.size > 1024 * 1024 * 10) {
                this.$message({
                    message: '请上传大小10M以内的图片',
                    type: 'error',
                });
                return;
            }
            this.loading = true;
            uploadImg(file.raw)
                .then((res) => {
                    this.form.image = this.baseUrl + res.path;
                })
                .catch((error) => this.$message({message: error, type: 'error'}))
                .finally(() => this.loading = false);
        }

        private updatwCategory() {
            this.loading = true;
            updateCategory(this.form)
                .then(() => {
                    this.$message({
                        message: '保存成功',
                        type: 'success',
                    });
                    this.$router.replace('/bs/category/list');
                })
                .catch((error) => this.$message({message: error, type: 'error'}))
                .finally(() => this.loading = false);
        }

        private selectAttr() {
            this.form.attribute_id = this.tableSelectedAttr.map((item) => item.id);
            this.selectedArr = this.tableSelectedAttr;
            this.closeDialog();
        }

        private closeDialog() {
            (this.$refs.attrTable as any).clearSelection();
            this.dialogVisible = false;
        }

        private changeSelectAttr(row: AttributeList[]) {
            this.tableSelectedAttr = row;
        }
    }
</script>