<style lang="less">
    .w-e-text-container {
        z-index: 1000 !important;
    }
</style>
<template>
    <div v-loading="loading">
        <div style="padding-bottom: 10px;border-bottom: 1px solid #ddd;margin-bottom: 20px">
            <el-button @click="$router.go(-1)">返回</el-button>
        </div>
        <el-form ref="form" :model="form">
            <el-form-item label="商品名称" required>
                <el-input v-model="form.goods_name" size="small" placeholder="请输入商品名称"
                          style="width: 200px"></el-input>
            </el-form-item>
            <div style="margin-bottom: 15px">
                <div style="font-size: 14px;color: #606266">商品详情</div>
                <div id="richtext" style="display: block;"></div>
            </div>
            <el-form-item label="商品主图" required>
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
            <el-form-item label="直播图片" required>
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
            <el-form-item label="商品系列" required>
                <el-tag v-if="currentSeries" style="margin-right: 10px" closable
                        @close="currentSeries=null">
                    {{currentSeries.series_name}}
                </el-tag>
                <el-button size="small" @click="seriesDialog=true">选择</el-button>
            </el-form-item>
            <el-form-item label="商品分类" required>
                <el-tag v-if="currentCategory" style="margin-right: 10px" closable
                        @close="currentCategory=null">
                    {{currentCategory.category_name}}
                </el-tag>
                <el-button size="small" @click="categoryDialog=true">选择</el-button>
            </el-form-item>
            <el-form-item label="商品规格" v-if="currentCategory" required>
                <div v-for="(item, index) in form.goods_sku"
                     style="margin-right: 10px;display: inline-block;position: relative;">
                    <div @click="showSkuDetail(index)"
                         style="text-align: center;display: block;border: 1px solid #ddd;cursor: pointer;
                            font-size: 12px;padding: 0 10px">
                        <el-image v-if="item.sku_img"
                                  style="width: 50px;height: 50px;cursor: pointer;margin-right: 10px"
                                  :src="item.sku_img"></el-image>
                        <div style="display: inline-block">
                            <div>普通价格：{{item.normal_price}}，会员价：{{item.member_price}}，直播价：{{item.video_price}}</div>
                            <div>{{Object.keys(item.sku_content).map((k) => item.sku_content[k]).join('，')}}</div>
                        </div>
                    </div>

                    <i class="el-icon-error"
                       style="position: absolute;font-size: 15px;top: -5px;right: -5px;cursor: pointer;"
                       @click="form.goods_sku.splice(index, 1)"></i>
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
            width="900px">
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
            width="900px">
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
            width="900px">
            <div v-if="currentCategory">
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
                <div>规格详情：</div>
                <div v-for="(item, index) in currentCategory.attribute" style="padding-left: 15px">
                    <span>{{item.attribute_name}}：</span>
                    <el-radio-group v-model="currentSku.sku_content[item.attribute_key]" @change="filterKey">
                        <el-radio :label="i" v-for="(val, i) in item.attribute_value.split(',')" :key="i"
                                  style="margin-bottom: 5px">
                            {{val}}
                        </el-radio>
                    </el-radio-group>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="confirmSku">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>
<script lang="ts">
    import {Vue, Component} from 'vue-property-decorator';
    import {createGoods, CreateGoodsArgs, CreateGoodsSku, GoodsSku} from '@/service/bs/bs-goods-service';
    import {uploadImg} from '@/service/bs/bs-img-upload-service';
    import {ElUploadInternalFileDetail} from 'element-ui/types/upload';
    import {CategoryList, getCategoryList} from '@/service/bs/bs-category-service';
    import {getSeriesList, SeriesList} from '@/service/bs/bs-series-service';

    const E = require('wangeditor');

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
            member_price: '',
            normal_price: '',
            video_price: '',
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
        private currentSku: CreateGoodsSku = {
            sku_content: {},
            sku_img: '',
            member_price: '',
            video_price: '',
            normal_price: '',
        };
        private currentSkuIndex: number | null = null;
        private richtext: any = null;

        private created() {
            this.getCategoryList();
            this.getSeriesList();
        }

        private mounted(): void {
            this.richtext = new E('#richtext');
            this.richtext.customConfig.uploadImgServer = '/api/uploads';
            this.richtext.customConfig.uploadImgMaxSize = 5 * 1024 * 1024;
            this.richtext.customConfig.uploadFileName = 'file';
            this.richtext.customConfig.withCredentials = true;
            this.richtext.customConfig.uploadImgHooks = {
                customInsert: function (insertImg: any, result: any, editor: any) {
                    var url = 'http://annual.gengyong.com.cn/' + result.data;
                    insertImg(url);
                }
            };
            this.richtext.create();
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

        private uploadMainImg(file: ElUploadInternalFileDetail) {
            if (file.size > 1024 * 1024 * 10) {
                this.$message({
                    message: '请上传大小10M以内的图片',
                    type: 'warning',
                });
                return;
            }
            this.loading = true;
            uploadImg(file.raw)
                .then((res) => {
                    this.form.main_img = this.baseUrl + res.path;
                })
                .catch((error) => this.$message({message: error, type: 'warning'}))
                .finally(() => this.loading = false);
        }

        private uploadVideoImg(file: ElUploadInternalFileDetail) {
            if (file.size > 1024 * 1024 * 10) {
                this.$message({
                    message: '请上传大小10M以内的图片',
                    type: 'warning',
                });
                return;
            }
            this.loading = true;
            uploadImg(file.raw)
                .then((res) => {
                    this.form.video_img = this.baseUrl + res.path;
                })
                .catch((error) => this.$message({message: error, type: 'warning'}))
                .finally(() => this.loading = false);
        }

        private uploadSkuImg(file: ElUploadInternalFileDetail) {
            if (file.size > 1024 * 1024 * 10) {
                this.$message({
                    message: '请上传大小10M以内的图片',
                    type: 'warning',
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
                .catch((error) => this.$message({message: error, type: 'warning'}))
                .finally(() => this.loading = false);
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
                this.currentCategory.attribute.forEach((item) => {
                    this.currentSku.sku_content[item.attribute_key] = '';
                });
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
            if (!this.currentCategory) {
                return;
            }
            let skuContent: any = {};
            this.currentCategory.attribute.forEach((item) => {
                skuContent[item.attribute_key] = 0;
            });
            this.form.goods_sku.push({
                sku_img: '',
                sku_content: skuContent,
                member_price: '',
                video_price: '',
                normal_price: '',
            });
            this.currentSku = {
                sku_img: '',
                sku_content: skuContent,
                member_price: '',
                video_price: '',
                normal_price: '',
            };
            this.currentSkuIndex = this.form.goods_sku.length - 1;
            this.filterKey();
        }

        private showSkuDetail(index: number) {
            this.currentSku = this.form.goods_sku[index];
            this.currentSkuIndex = index;
            if (this.currentCategory) {
                this.currentCategory.attribute.forEach((item) => {
                    this.currentSku.sku_content[item.attribute_key]
                        = item.attribute_value.split(',').indexOf(this.currentSku.sku_content[item.attribute_key]);
                });
            }
            this.filterKey();
            this.skuDetailDialog = true;

        }

        private confirmSku() {
            this.skuDetailDialog = false;
        }

        private filterKey() {
            if (this.currentSku && (this.currentSkuIndex || this.currentSkuIndex == 0) && +this.currentSkuIndex >= 0
                && this.currentCategory) {
                let skuContent: any = {};
                this.currentCategory.attribute.forEach((item) => {
                    let attrIndex = this.currentSku.sku_content[item.attribute_key];
                    skuContent[item.attribute_key] = item.attribute_value.split(',')[attrIndex];
                });
                this.form.goods_sku[this.currentSkuIndex] = {
                    member_price: this.currentSku.member_price,
                    normal_price: this.currentSku.normal_price,
                    video_price: this.currentSku.video_price,
                    sku_img: this.currentSku.sku_img,
                    sku_content: skuContent,
                };
            }
        }

        private createGoods() {
            if (!this.form.goods_name) {
                this.$message({
                    type: 'warning',
                    message: '请输入商品名称'
                });
                return;
            }
            if (this.form.goods_sku.length == 0) {
                this.$message({
                    type: 'warning',
                    message: '请设置商品规格'
                });
                return;
            }
            if (!this.form.series_id) {
                this.$message({
                    type: 'warning',
                    message: '请设置商品系列'
                });
                return;
            }
            if (this.form.goods_sku.length == 0) {
                this.$message({
                    type: 'warning',
                    message: '请设置商品规格'
                });
                return;
            }
            if (!this.form.category_id) {
                this.$message({
                    type: 'warning',
                    message: '请设置商品分类'
                });
                return;
            }
            if (!this.form.main_img) {
                this.$message({
                    type: 'warning',
                    message: '请设置商品图片'
                });
                return;
            }
            if (!this.form.video_img) {
                this.$message({
                    type: 'warning',
                    message: '请设置直播图片'
                });
                return;
            }
            if (parseFloat(this.form.normal_price) <= 0 || parseFloat(this.form.member_price) <= 0
                || parseFloat(this.form.video_price) <= 0) {
                this.$message({
                    type: 'warning',
                    message: '价格必须大于0'
                });
                return;
            }
            this.form.goods_detail = this.richtext.txt.html();
            this.loading = true;
            createGoods(this.form)
                .then(() => {
                    this.$message({
                        message: '创建成功',
                        type: 'success',
                    });
                    this.$router.replace('/bs/goods/list');
                })
                .catch((error) => this.$message({message: error, type: 'warning'}))
                .finally(() => this.loading = false);
        }
    }
</script>