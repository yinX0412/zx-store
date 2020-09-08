<template>
    <div v-loading="loading" style="height: 100vh;background: #fff;overflow: auto;padding: 15px">
        <div v-if="total==0" style="text-align: center;padding-top: 100px">
            <h3>暂无会员信息</h3>
        </div>
        <div v-if="total>0">
            <div>
                <el-input v-model="name" placeholder="请输入名称" style="width: 180px;" size="small" clearable>
                    <i slot="suffix" class="el-input__icon el-icon-search" @click="search"></i>
                </el-input>
                <el-select v-model="dist" placeholder="请选择区域" size="small" style="width: 100px;float: right;"
                           @change="search" clearable>
                    <el-option
                        v-for="item in citys"
                        :key="item"
                        :label="item"
                        :value="item">
                    </el-option>
                </el-select>
            </div>

            <div v-for="item in memberList"
                 style="display: flex;justify-content: space-between;align-items: center;
                 padding-bottom: 10px;border-bottom: 1px solid #ddd;margin-top: 10px">
                <div>
                    <el-image :src="item.avatar" style="width: 50px;height: 50px;margin-right: 10px"></el-image>
                    <div style="display: inline-block">
                        <h4 style="padding: 0">{{item.username}}</h4>
                        <div style="font-size: 14px">门店地址：{{item.address_content + item.hourse_number}}</div>
                        <div style="font-size: 14px">{{item.phone}}</div>
                    </div>
                </div>
                <div>
                    <el-button type="danger" @click="submitDel(item.id)" size="mini">提交除名</el-button>
                </div>
            </div>
            <div style="text-align: center" v-if="memberList.length<total">
                <el-button size="small" type="text" @click="loadMore">加载更多</el-button>
            </div>
            <div v-else style="font-size: 12px;text-align: center;margin-top: 10px">暂无更多会员信息</div>
        </div>
    </div>
</template>
<script lang="ts">
    import {Vue, Component} from 'vue-property-decorator';
    import {getMemberList, submitDelMember} from '@/service/fs/fs-member-service';

    @Component
    export default class FsMemberList extends Vue {
        private loading: boolean = false;
        private memberList: any[] = [];
        private dist: string = '';
        private name: string = '';
        private page: number = 1;
        private citys: string[] = [];
        private total: number | null = null;

        private created(): void {
            this.getMemberList();
        }

        private search() {
            this.page = 1;
            this.memberList = [];
            this.getMemberList();
        }

        private loadMore() {
            this.page++;
            this.getMemberList();
        }

        private getMemberList() {
            this.loading = true;
            getMemberList(this.page, this.dist, this.name)
                .then((res) => {
                    this.memberList.push(...res.userInfo.data);
                    this.total = res.userInfo.total;
                    this.citys = [];
                    res.zoneInfo.forEach((c: any) => {
                        this.citys.push(c.city);
                    });
                })
                .catch((error) => alert(error))
                .finally(() => this.loading = false);
        }

        private submitDel(id: string) {
            this.$confirm('确认将该会员除名')
                .then(() => {
                    this.loading = true;
                    return submitDelMember(id);
                })
                .then((res) => {
                    if (res.operation.toString() == '1') {
                        this.$message({
                            type: 'success',
                            message: '提交成功',
                        });
                    }
                    if (res.operation.toString() == '2') {
                        this.$message({
                            type: 'warning',
                            message: '该用户已提交除名',
                        });
                    }

                })
                .catch((error) => error == 'cancel' ? null : alert(error))
                .finally(() => this.loading = false);
        }
    }
</script>