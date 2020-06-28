<template>
    <div v-loading="loading">
        <div style="padding-bottom: 10px;border-bottom: 1px solid #ddd;margin-bottom: 20px">
            <el-button @click="$router.go(-1)">返回</el-button>
        </div>
        <el-form ref="form" :model="createForm">
            <el-form-item label="系别名称">
                <el-input v-model="createForm.series_name" size="small" placeholder="请输入系别名称"
                          style="width: 200px"></el-input>
            </el-form-item>
            <el-form-item label="系别图片">
                <el-image v-if="createForm.image" :src="createForm.image" style="width: 200px;vertical-align: middle"></el-image>
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
        </el-form>
        <el-button type="primary" size="small" @click="createSeries">创建</el-button>
    </div>
</template>
<script lang="ts">
    import {Vue, Component} from 'vue-property-decorator';
    import {ElUploadInternalFileDetail} from 'element-ui/types/upload';
    import {uploadImg} from '@/service/bs/bs-img-upload-service';
    import {createSeries} from '@/service/bs/bs-series-service';

    @Component
    export default class BsCreateSeries extends Vue {
        private loading: boolean = false;
        private createForm: { series_name: string, image: string } = {
            series_name: '',
            image: '',
        };

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
                    this.createForm.image = this.baseUrl + res.path;
                })
                .catch((error) => this.$message({message: error, type: 'error'}))
                .finally(() => this.loading = false);
        }

        private createSeries() {
            if (!this.createForm.series_name) {
                this.$message({
                    message: '请输入系别名称',
                    type: 'error',
                });
                return;
            }
            this.loading = true;
            createSeries(this.createForm.series_name, this.createForm.image)
                .then(() => {
                    this.$message({
                        message: '创建成功',
                        type: 'success',
                    });
                    this.$router.replace('/bs/series/list');
                })
                .catch((error) => this.$message({message: error, type: 'error'}))
                .finally(() => this.loading = false);
        }
    }
</script>
