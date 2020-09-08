<style lang="less" scoped>
    .user-info {
        font-size: 14px;
        color: #606266;
        margin-bottom: 10px;
    }
</style>
<template>
    <div v-loading="loading">
        <div style="padding-bottom: 10px;border-bottom: 1px solid #ddd;margin-bottom: 20px">
            <el-button @click="$router.go(-1)">返回</el-button>
        </div>
        <div v-if="currentUser" style="padding-left: 20px">
            <div class="user-info">
                用户名：{{currentUser.username}}
            </div>
            <div class="user-info">
                身份：{{currentUser.identity | formatIdentity}}
            </div>
            <div class="user-info">
                性别：{{currentUser.sex==1?'男':'女'}}
            </div>
            <div class="user-info">
                电话：{{currentUser.phone}}
            </div>
            <div class="user-info">
                门店名称：{{currentUser.address.store_name}}
            </div>
            <div class="user-info">
                门店地址：{{currentUser.address.address_content + currentUser.address.hourse_number}}
            </div>
            <div class="user-info">
                下级：
                <div v-if="currentUser.sub_user.length>0" style="display: inline-block">
                    <span v-for="item in currentUser.sub_user" style="margin-right: 10px">
                        {{item.username}}
                    </span>
                </div>
                <span v-else>无</span>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import {Vue, Component} from 'vue-property-decorator';
    import {getUserDetail, UserDetail} from '@/service/bs/bs-user-service';

    @Component({
        filters: {
            formatIdentity(identity: 1 | 2 | 3 | 4) {
                switch (identity) {
                    case 1:
                        return '普通用户';
                    case 2:
                        return '会员';
                    case 3:
                        return '业务员';
                    case 4:
                        return '大代理';
                }
            },
        },
    })
    export default class BsUserDetail extends Vue {
        private loading: boolean = false;
        private currentUser: UserDetail | null = null;

        private created(): void {
            this.getUserDetail();
        }

        private getUserDetail() {
            this.loading = true;
            getUserDetail((this.$route.params as any).id)
                .then((res) => {
                    this.currentUser = res;
                })
                .catch((error) => this.$message({message: error, type: 'warning'}))
                .finally(() => this.loading = false);
        }
    }
</script>