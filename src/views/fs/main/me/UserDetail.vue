<style lang="less">
    .detail-box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #ddd;
        padding: 10px;
        font-size: 14px;
    }
</style>
<template>
    <div v-if="user" style="padding: 10px 0" v-loading="loading">
        <div style="width: 95%;margin: 0 auto;background: #fff;padding: 0 10px;border-radius: 5px">
            <div class="detail-box">
                <div style="font-size: 14px">头像</div>
                <div>
                    <div class="avatar-box">
                        <el-image :src="user.avatar"
                                  style="width: 50px;height: 50px;border-radius: 50px;display: block"></el-image>
                    </div>
                </div>
            </div>
            <div class="detail-box">
                <div>用户名</div>
                <div @click="usernameDialog=true">
                    {{user.username}}
                    <i class="el-icon-arrow-right"></i>
                </div>
            </div>
            <div class="detail-box">
                <div>城市</div>
                <div @click="cityDialog=true">
                    {{user.city}}
                    <i class="el-icon-arrow-right"></i>
                </div>
            </div>
            <div class="detail-box">
                <div>性别</div>
                <div @click="sexDialog=true">
                    {{user.sex == 1?'男':'女'}}
                    <i class="el-icon-arrow-right"></i>
                </div>
            </div>
            <div class="detail-box">
                <div>手机</div>
                <div @click="phoneDialog=true">
                    {{user.phone}}
                    <i class="el-icon-arrow-right"></i>
                </div>
            </div>
            <div class="detail-box" style="border: 0;">
                <div>收货门面</div>
                <div @click="storeDialog=true">
                    <i class="el-icon-arrow-right"></i>
                </div>
            </div>
        </div>

        <el-dialog
            title="用户名"
            :visible.sync="usernameDialog"
            width="90%"
            @close="closeDialog">
            <el-input v-model="form.username" size="small" style="width: 100%"></el-input>
            <span slot="footer" class="dialog-footer">
            <el-button @click="closeDialog" size="small">取 消</el-button>
            <el-button type="primary" @click="updateUser" size="small">
                <span style="color: #fff">确 定</span>
            </el-button>
          </span>
        </el-dialog>
        <el-dialog
            title="城市"
            :visible.sync="cityDialog"
            width="90%"
            @close="closeDialog">
            <el-input v-model="form.city" size="small" style="width: 100%"></el-input>
            <span slot="footer" class="dialog-footer">
            <el-button @click="closeDialog" size="small">取 消</el-button>
            <el-button type="primary" @click="updateUser" size="small">
                <span style="color: #fff">确 定</span>
            </el-button>
          </span>
        </el-dialog>
        <el-dialog
            title="手机"
            :visible.sync="phoneDialog"
            width="90%"
            @close="closeDialog">
            <el-input v-model="form.phone" size="small" style="width: 100%"></el-input>
            <span slot="footer" class="dialog-footer">
            <el-button @click="closeDialog" size="small">取 消</el-button>
            <el-button type="primary" @click="updateUser" size="small">
                <span style="color: #fff">确 定</span>
            </el-button>
          </span>
        </el-dialog>
        <el-dialog
            title="性别"
            :visible.sync="sexDialog"
            width="90%"
            @close="closeDialog">
            <div style="text-align: center">
                <el-radio-group v-model="form.sex">
                    <el-radio :label="1">男</el-radio>
                    <el-radio :label="0">女</el-radio>
                </el-radio-group>
            </div>
            <span slot="footer" class="dialog-footer">
            <el-button @click="closeDialog" size="small">取 消</el-button>
            <el-button type="primary" @click="updateUser" size="small">
                <span style="color: #fff">确 定</span>
            </el-button>
          </span>
        </el-dialog>
        <el-dialog
            title="收货门店"
            :visible.sync="storeDialog"
            width="90%"
            @close="closeDialog">
            <div>
                <div style="margin-bottom: 10px">
                    <span>门店名称：</span>
                    <el-input v-model="form.store_name" size="small"
                              :disabled="user.identity==1||user.identity==3"></el-input>
                </div>
                <div style="margin-bottom: 10px">
                    <span>门店图片：</span>
                    <el-upload
                        action=""
                        accept="image/*"
                        :auto-upload="false"
                        :on-change="uploadStoreImg"
                        :show-file-list="false">
                        <el-image v-if="form.store_img" :src="form.store_img" style="height: 80px;"></el-image>
                        <el-button type="primary" size="small" v-else>上传</el-button>
                    </el-upload>
                </div>
                <div style="margin-bottom: 10px">
                    <span style="vertical-align: top">详细地址：</span>
                    <el-input v-model="form.address_content" size="small" type="textarea" rows="3"
                              :disabled="user.identity==1||user.identity==3"></el-input>
                </div>
                <div>
                    <span>门牌号：</span>
                    <el-input v-model="form.hourse_number" size="small"
                              :disabled="user.identity==1||user.identity==3"></el-input>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
            <el-button @click="closeDialog" size="small">取 消</el-button>
            <el-button type="primary" @click="updateUser" size="small" :disabled="user.identity==1||user.identity==3">
                <span style="color: #fff">确 定</span>
            </el-button>
          </span>
        </el-dialog>
    </div>
</template>
<script lang="ts">
    import {Vue, Component} from 'vue-property-decorator';
    import {getCurrentUser, updateUser, UpdateUserArgs} from '@/service/fs/fs-auth-service';
    import AuthImp from '@/service/auth/AuthImp';
    import {ElUploadInternalFileDetail} from 'element-ui/types/upload';
    import {uploadImg} from '@/service/fs/fs-img-upload-service';

    @Component
    export default class FsMeDetail extends Vue {
        private loading = false;
        private usernameDialog: boolean = false;
        private cityDialog: boolean = false;
        private sexDialog: boolean = false;
        private storeDialog: boolean = false;
        private phoneDialog: boolean = false;
        private form: UpdateUserArgs = {
            username: this.user.username,
            sex: this.user.sex,
            city: this.user.city,
            phone: this.user.phone,
            store_name: this.user.store_name,
            address_content: this.user.address_content,
            store_img: this.user.store_img,
            hourse_number: this.user.hourse_number,
        };

        get user() {
            return this.$store.state.user;
        }

        private updateUser() {
            if (!/^1[3456789]\d{9}$/.test(this.form.phone)) {
                this.$message({
                    type: 'warning',
                    message: '请输入正确的手机号',
                });
                return;
            }
            this.loading = true;
            if (this.user.identity == 2 || this.user.identity == 4) {
                // 会员 大代理
                updateUser(this.form)
                    .then(() => {
                        this.getCurrentUser();
                        this.$message({
                            type: 'success',
                            message: '修改成功',
                        });
                    })
                    .catch((error) => {
                        this.$message({
                            type: 'warning',
                            message: error,
                        });
                    })
                    .finally(() => {
                        this.loading = false;
                        this.closeDialog();
                    });
            }
            if (this.user.identity == 1 || this.user.identity == 3) {
                // 用户 业务员
                updateUser({
                    username: this.form.username,
                    sex: this.form.sex,
                    city: this.form.city,
                    phone: this.form.phone,
                })
                    .then(() => {
                        this.getCurrentUser();
                        this.$message({
                            type: 'success',
                            message: '修改成功',
                        });
                    })
                    .catch((error) => {
                        this.$message({
                            type: 'warning',
                            message: error,
                        });
                    })
                    .finally(() => {
                        this.loading = false;
                        this.closeDialog();
                    });
            }
        }

        private getCurrentUser() {
            getCurrentUser()
                .then((user) => {
                    this.$store.commit('updateUser', user);
                    new AuthImp().setAccessToken(user.token);
                })
                .catch((error) => {
                    if (error) {
                            alert(error);
                        }
                    if (error.code == 2016) {
                        new AuthImp().redirectToGetAuthCode();
                    } else if (error.code == 201) {
                        // this.$router.push()
                    }
                });
        }

        private closeDialog() {
            this.usernameDialog = false;
            this.cityDialog = false;
            this.sexDialog = false;
            this.phoneDialog = false;
            this.storeDialog = false;
            this.form = {
                username: this.user.username,
                sex: this.user.sex,
                city: this.user.city,
                phone: this.user.phone,
                store_name: this.user.store_name,
                address_content: this.user.address_content,
                store_img: this.user.store_img,
                hourse_number: this.user.hourse_number,
            };
        }

        private uploadStoreImg(file: ElUploadInternalFileDetail) {
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
                    this.form.store_img = this.baseUrl + res.path;
                })
                .catch((error) => this.$message({message: error, type: 'warning'}))
                .finally(() => this.loading = false);
        }
    }
</script>