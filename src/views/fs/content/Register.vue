<template>
    <div v-loading="loading">
        <el-image src="/img/loginLogo.png" style="width: 100%;margin-bottom: 10px;"></el-image>
        <h3 style="display: block;text-align: center">会员注册登录</h3>
        <div style="width: 70%;margin: 20px auto 0">
            <el-input v-model="form.username" placeholder="用户名" style="margin-bottom: 10px" autocomplete="off">
                <el-image slot="prefix" class="el-input__icon" src="/img/username.svg"
                          style="width: 18px"></el-image>
            </el-input>
            <el-input v-model="form.phone" placeholder="手机号码" style="margin-bottom: 10px" autocomplete="off">
                <el-image slot="prefix" class="el-input__icon" src="/img/username.svg"
                          style="width: 18px"></el-image>
            </el-input>
            <el-input v-model="form.invite_code" disabled placeholder="邀请码"
                      autocomplete="off">
                <el-image slot="prefix" class="el-input__icon" src="/img/username.svg"
                          style="width: 18px"></el-image>
            </el-input>
            <div style="font-size: 12px;color: rgb(245, 108, 108);" v-if="!inviteCode">请联系商家获取邀请码</div>
            <el-input v-model="form.city" placeholder="所属城市" style="margin-top: 10px"
                      autocomplete="off">
                <el-image slot="prefix" class="el-input__icon" src="/img/username.svg"
                          style="width: 18px"></el-image>
            </el-input>
            <template v-if="identityNo==2||identityNo==3">
                <el-input v-model="form.store_name" placeholder="门店名称" style="margin-top: 10px"
                          autocomplete="off">
                    <el-image slot="prefix" class="el-input__icon" src="/img/username.svg"
                              style="width: 18px"></el-image>
                </el-input>
                <el-input v-model="form.address_content" placeholder="门店地址" style="margin-top: 10px"
                          autocomplete="off">
                    <el-image slot="prefix" class="el-input__icon" src="/img/username.svg"
                              style="width: 18px"></el-image>
                </el-input>
                <el-input v-model="form.hourse_number" placeholder="门牌号" style="margin-top: 10px"
                          autocomplete="off">
                    <el-image slot="prefix" class="el-input__icon" src="/img/username.svg"
                              style="width: 18px"></el-image>
                </el-input>
                <div style="margin-top: 10px">
                    <span style="font-size: 12px;color: #606266;">门店图片：</span>
                    <el-image v-if="form.store_img" :src="form.store_img"
                              style="width: 100px;vertical-align: middle"></el-image>
                    <el-upload
                        style="display: inline-block;vertical-align: middle;margin-left: 10px;"
                        action=""
                        accept="image/*"
                        :auto-upload="false"
                        :on-change="uploadImg"
                        :show-file-list="false">
                        <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                </div>
            </template>
        </div>
        <div style="font-size: 12px;text-align: center;margin-top: 20px">
            <i style="color: #F56C6C;">* </i>
            <span>注册代表您同意</span>
            <el-link type="primary" style="font-size: 12px;margin-bottom: 3px;">《筑馨家会员协议》</el-link>
        </div>
        <div style="text-align: center">
            <el-button type="primary" @click="register">注册</el-button>
        </div>
    </div>
</template>
<script lang="ts">
    import {Vue, Component} from 'vue-property-decorator';
    import {RegisterArgs, registerUser, userAuthCodeLogin} from '@/service/fs/fs-auth-service';
    import router from '@/router';
    import AuthImp from '@/service/auth/AuthImp';
    import {ElUploadInternalFileDetail} from 'element-ui/types/upload';
    import {uploadImg} from '@/service/fs/fs-img-upload-service';

    @Component
    export default class FsRegister extends Vue {
        private loading = false;
        private form: RegisterArgs = {
            phone: '',
            invite_code: '',
            type: 1,
            username: '',
            city: '',
            store_name: '',
            address_content: '',
            membershipfee: 599,
            store_img: '',
            hourse_number: '',
        };


        get inviteCode(): string {
            const code = window.sessionStorage.getItem('invite_code');
            if (code) {
                return code;
            }
            return '';
        }

        get identityNo(): any {
            const identity = window.sessionStorage.getItem('identityNo');
            if (identity) {
                return identity;
            }
            return 1;
        }

        private created(): void {
            if ((this.$route.query as any).identityNo) {
                window.sessionStorage.setItem('identityNo', (this.$route.query as any).identityNo);
            }
            if ((this.$route.query as any).invite_code) {
                window.sessionStorage.setItem('invite_code', (this.$route.query as any).invite_code);
            }
            if ((this.$route.query as any).code) {
                userAuthCodeLogin((router.currentRoute.query as any).code as string)
                    .then((res: any) => {
                        if (res.token) {
                            new AuthImp().setAccessToken(res.token);
                        }
                        window.location.replace(window.location.pathname);
                    })
                    .catch((error) => {
                        if (!error) {
                            return;
                        }
                        if (error.data && error.data.token) {
                            new AuthImp().setAccessToken(error.data.token);
                        }
                        if (error.code === 2003) {
                            // const invitecode = (this.$route.query as any).invite_code ?
                            //     (this.$route.query as any).invite_code : '';
                            // const identityNo = (this.$route.query as any).identityNo ?
                            //     (this.$route.query as any).identityNo : '';
                            window.location.replace(`/fs/register`);
                            return;
                        }
                        if (error.code === 201) {
                            window.location.href = 'http://zxfront.gengyong.com.cn/fs/member/pay';
                            return;
                        }
                    });
                return;
            }
            new AuthImp().getAccessToken()
                         .then((ak) => {
                             if (!ak) {
                                 new AuthImp().redirectToGetAuthCode();
                             }
                         });
            const code = window.sessionStorage.getItem('invite_code');
            if (code) {
                this.form.invite_code = code;
            }
            const identity = window.sessionStorage.getItem('identityNo');
            if (identity) {
                this.form.type = identity;
            }
        }

        private register() {
            if (!this.form.invite_code) {
                alert('请获取邀请码');
                return;
            }
            if (!this.form.type) {
                alert('身份类型错误请重新获取邀请码');
                return;
            }
            if (!/^1[3456789]\d{9}$/.test(this.form.phone)) {
                alert('请填写正确手机号');
                return;
            }
            if (!this.form.city) {
                alert('请填写城市');
                return;
            }
            this.loading = true;
            registerUser(this.form)
                .then((res) => {
                    this.$message({
                        message: '注册成功',
                        type: 'success',
                    });
                    if (this.identityNo == 2) {
                        window.sessionStorage.removeItem('invite_code');
                        window.sessionStorage.removeItem('identityNo');
                        this.$router.replace('/fs/member/pay');
                    } else {
                        window.sessionStorage.removeItem('invite_code');
                        window.sessionStorage.removeItem('identityNo');
                        this.$router.replace('/fs');
                    }
                })
                .catch((error) => {
                    if (error.data.code.toString().startsWith('20')) {
                        if (this.identityNo == 2) {
                            window.sessionStorage.removeItem('invite_code');
                            window.sessionStorage.removeItem('identityNo');
                            this.$router.replace('/fs/member/pay');
                        } else {
                            window.sessionStorage.removeItem('invite_code');
                            window.sessionStorage.removeItem('identityNo');
                            this.$router.replace('/fs');
                        }
                    }
                    this.$message({
                        type: 'warning',
                        message: error,
                    });
                })
                .finally(() => this.loading = false);
        }

        private uploadImg(file: ElUploadInternalFileDetail) {
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