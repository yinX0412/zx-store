<template>
    <div v-loading="loading">
        <div style="padding-bottom: 10px;border-bottom: 1px solid #ddd;margin-bottom: 20px">
            <el-button @click="$router.go(-1)">返回</el-button>
        </div>
        <el-form ref="form" :model="form">
            <el-form-item label="商品名称">
                <el-input v-model="form.goods_name" size="small" placeholder="请输入商品名称"
                          style="width: 200px"></el-input>
            </el-form-item>
            <el-form-item label="商品详情">
                <el-input v-model="form.goods_detail" size="small" type="textarea" placeholder="请输入商品详情"
                          style="width: 300px" rows="3"></el-input>
            </el-form-item>
            <el-form-item label="商品主图">
                <el-image v-if="form.main_img" :src="form.main_img"
                          style="width: 200px;vertical-align: middle"></el-image>
                <el-upload
                    style="display: inline-block;vertical-align: middle;margin-left: 10px;"
                    action=""
                    accept="image/*"
                    :auto-upload="false"
                    :on-change="uploadMainImg"
                    :show-file-list="false">
                    <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
            </el-form-item>
            <el-form-item label="直播图片">
                <el-image v-if="form.video_img" :src="form.video_img"
                          style="width: 200px;vertical-align: middle"></el-image>
                <el-upload
                    style="display: inline-block;vertical-align: middle;margin-left: 10px;"
                    action=""
                    accept="image/*"
                    :auto-upload="false"
                    :on-change="uploadVideoImg"
                    :show-file-list="false">
                    <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
            </el-form-item>
            <el-form-item label="商品系列">
                <el-tag v-if="currentSeries" style="margin-right: 10px" closable
                        @close="currentSeries=null">
                    {{currentSeries.series_name}}
                </el-tag>
                <el-button size="small" @click="seriesDialog=true">选择</el-button>
            </el-form-item>
            <el-form-item label="商品分类">
                <el-tag v-if="currentCategory" style="margin-right: 10px" closable
                        @close="currentCategory=null">
                    {{currentCategory.category_name}}
                </el-tag>
                <el-button size="small" @click="categoryDialog=true">选择</el-button>
            </el-form-item>
            <el-form-item label="商品规格" v-if="currentCategory">
                <div v-for="(item, index) in form.goods_sku" style="margin-right: 10px;display: inline-block">
                    <div v-if="!item.sku_img" @click="showSkuDetail(index)"
                         style="width: 50px;height: 50px;line-height: 50px;
                         text-align: center;display: inline-block;border: 1px solid #ddd;cursor: pointer;
                            font-size: 12px">
                        规格{{index+1}}
                    </div>
                    <el-image v-else style="width: 50px;height: 50px;cursor: pointer;vertical-align: middle"
                              :src="item.sku_img"
                              @click="showSkuDetail(item)"></el-image>
                </div>
                <el-button size="small" @click="addSku">添加</el-button>
            </el-form-item>
            <el-form-item label="商品价格">
                <el-input v-model="form.normal_price" placeholder="请输入价格" style="width: 120px" size="small"
                          type="number"></el-input>
            </el-form-item>
            <el-form-item label="会员价">
                <el-input v-model="form.member_price" placeholder="请输入价格" style="width: 120px" size="small"
                          type="number"></el-input>
            </el-form-item>
            <el-form-item label="直播价">
                <el-input v-model="form.video_price" placeholder="请输入价格" style="width: 120px" size="small"
                          type="number"></el-input>
            </el-form-item>
            <el-form-item label="开启直播商品">
                <el-radio-group v-model="form.is_video">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="2">否</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <el-button type="primary" size="small" @click="createGoods">创建</el-button>
        <el-dialog
            title="分类"
            :visible.sync="categoryDialog"
            width="50%">
            <div>
                <el-table
                    @current-change="changeSelectCategory"
                    ref="categoryTable"
                    max-height="500px"
                    highlight-current-row
                    :data="categoryList" border
                    style="width: 100%">
                    <el-table-column type="index"></el-table-column>
                    <el-table-column
                        prop="category_name"
                        label="分类名称">
                    </el-table-column>
                </el-table>
            </div>
            <span slot="footer" class="dialog-footer">
            <el-button @click="closeCategoryDialog">取 消</el-button>
            <el-button type="primary" @click="selectCategory">确 定</el-button>
          </span>
        </el-dialog>
        <el-dialog
            title="系列"
            :visible.sync="seriesDialog"
            width="50%">
            <el-table
                @current-change="changeSelectSeries"
                ref="seriesTable"
                max-height="500px"
                highlight-current-row
                :data="seriesList" border
                style="width: 100%">
                <el-table-column type="index"></el-table-column>
                <el-table-column
                    prop="series_name"
                    label="系列名称">
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
            <el-button @click="closeSeriesDialog">取 消</el-button>
            <el-button type="primary" @click="selectSeries">确 定</el-button>
          </span>
        </el-dialog>
        <el-dialog
            title="规格设置"
            :visible.sync="skuDetailDialog"
            @close="closeSkuDialog"
            width="50%">
            <div v-if="currentSku">
                <div style="margin-bottom: 10px">
                    <span>商品价格：</span>
                    <el-input v-model="currentSku.normal_price" placeholder="请输入价格"
                              style="width: 100px;" size="small" type="number"></el-input>
                </div>
                <div style="margin-bottom: 10px">
                    <span>会员价格：</span>
                    <el-input v-model="currentSku.member_price" placeholder="请输入价格"
                              style="width: 100px;" size="small" type="number"></el-input>
                </div>
                <div style="margin-bottom: 10px">
                    <span>直播价格：</span>
                    <el-input v-model="currentSku.video_price" placeholder="请输入价格"
                              style="width: 100px;" size="small" type="number"></el-input>
                </div>
                <div style="margin-bottom: 10px">
                    <span>规格图片：</span>
                    <el-image v-if="currentSku.sku_img" :src="currentSku.sku_img"
                              style="width: 50px;height: 50px;vertical-align: middle"></el-image>
                    <el-upload
                        style="display: inline-block;vertical-align: middle;margin-left: 10px;"
                        action=""
                        accept="image/*"
                        :auto-upload="false"
                        :on-change="uploadSkuImg"
                        :show-file-list="false">
                        <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                </div>
                <div>
                    <span>规格详情：</span>
                    <el-select size="small" v-model="currentSku.sku_content"
                               value-key="id" clearable>
                        <el-option
                            v-for="item in currentCategory.attribute"
                            :key="item.id"
                            :label="item.attribute_name"
                            :value="item">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
            <el-button @click="closeSkuDialog">取 消</el-button>
            <el-button type="primary" @click="confirmSku">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>
<script lang="ts">
    import {Vue, Component} from 'vue-property-decorator';
    import {createGoods, CreateGoodsArgs, GoodsSku} from '@/service/bs/bs-goods-service';
    import {uploadImg} from '@/service/bs/bs-img-upload-service';
    import {ElUploadInternalFileDetail} from 'element-ui/types/upload';
    import {CategoryList, getCategoryList} from '@/service/bs/bs-category-service';
    import {getSeriesList, SeriesList} from '@/service/bs/bs-series-service';

    @Component
    export default class BsCreateGoods extends Vue {
        private loading: boolean = false;
        private categoryDialog: boolean = false;
        private seriesDialog: boolean = false;
        private skuDetailDialog: boolean = false;
        private form: CreateGoodsArgs = {
            goods_name: '',
            main_img: '',
            video_img: '',
            category_id: '',
            member_price: 0,
            normal_price: 0,
            video_price: 0,
            series_id: '',
            is_video: 1,
            status: 1,
            goods_detail: '',
            goods_sku: [],
        };
        private categoryList: CategoryList[] = [];
        private seriesList: SeriesList[] = [];
        private currentCategory: CategoryList | null = null;
        private currentSeries: SeriesList | null = null;
        private categoryCurrentSelected: CategoryList | null = null;
        private seriesCurrentSelected: SeriesList | null = null;
        private currentSku: GoodsSku | null = null;
        private currentSkuIndex: number | null = null;

        private created() {
            this.getCategoryList();
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
                        type: 'error',
                        message: error,
                    });
                })
                .finally(() => this.loading = false);
        }

        private uploadMainImg(file: ElUploadInternalFileDetail) {
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
                    this.form.main_img = this.baseUrl + res.path;
                })
                .catch((error) => this.$message({message: error, type: 'error'}))
                .finally(() => this.loading = false);
        }

        private uploadVideoImg(file: ElUploadInternalFileDetail) {
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
                    this.form.video_img = this.baseUrl + res.path;
                })
                .catch((error) => this.$message({message: error, type: 'error'}))
                .finally(() => this.loading = false);
        }

        private uploadSkuImg(file: ElUploadInternalFileDetail) {
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
                    if (!this.currentSku) {
                        return;
                    }
                    this.currentSku.sku_img = this.baseUrl + res.path;
                })
                .catch((error) => this.$message({message: error, type: 'error'}))
                .finally(() => this.loading = false);
        }

        private getCategoryList() {
            this.loading = true;
            getCategoryList()
                .then((res) => {
                    this.categoryList = res;
                })
                .catch((error) => this.$message({
                    type: 'error',
                    message: error,
                }))
                .finally(() => this.loading = false);
        }

        private changeSelectCategory(val: CategoryList) {
            this.categoryCurrentSelected = val;
        }

        private changeSelectSeries(val: SeriesList) {
            this.seriesCurrentSelected = val;
        }

        private closeCategoryDialog() {
            (this.$refs.categoryTable as any).setCurrentRow();
            this.categoryDialog = false;
        }

        private closeSeriesDialog() {
            (this.$refs.seriesTable as any).setCurrentRow();
            this.seriesDialog = false;
        }

        private selectCategory() {
            if (this.categoryCurrentSelected) {
                this.currentCategory = this.categoryCurrentSelected;
                this.form.category_id = this.categoryCurrentSelected.id;
            }
            this.closeCategoryDialog();
        }

        private selectSeries() {
            if (this.seriesCurrentSelected) {
                this.currentSeries = this.seriesCurrentSelected;
                this.form.series_id = this.seriesCurrentSelected.id;
            }
            this.closeSeriesDialog();
        }

        private addSku() {
            this.form.goods_sku.push({
                id: '',
                sku_img: '',
                sku_content: null,
                member_price: 0,
                video_price: 0,
                normal_price: 0,
            });
        }

        private showSkuDetail(index: number) {
            this.currentSku = this.form.goods_sku[index];
            this.currentSkuIndex = index;
            this.skuDetailDialog = true;
        }

        private closeSkuDialog() {
            this.currentSku = null;
            this.currentSkuIndex = null;
            this.skuDetailDialog = false;
        }

        private confirmSku() {
            if (this.currentSku && (this.currentSkuIndex || this.currentSkuIndex === 0) && +this.currentSkuIndex >= 0) {
                let skuContent: any = {};
                skuContent[this.currentSku.sku_content.attribute_key] = this.currentSku.sku_content.attribute_value;
                this.form.goods_sku[this.currentSkuIndex] = {
                    id: this.currentSku.id,
                    member_price: this.currentSku.member_price,
                    normal_price: this.currentSku.normal_price,
                    video_price: this.currentSku.video_price,
                    sku_img: this.currentSku.sku_img,
                    sku_content: skuContent,
                };
                this.closeSkuDialog();
            }
        }

        private createGoods() {
            this.loading = true;
            createGoods(this.form)
                .then(() => {
                    this.$message({
                        message: '创建成功',
                        type: 'success',
                    });
                    this.$router.replace('/bs/goods/list');
                })
                .catch((error) => this.$message({message: error, type: 'error'}))
                .finally(() => this.loading = false);
        }
    }
</script>