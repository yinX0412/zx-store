<template>
    <div>
        <div class="flex-menu-box">
            <div @click="chooseInvite">
                <el-image src="/img/me/invite-register.svg"></el-image>
                <span style="font-size: 14px">邀请注册</span>
            </div>
            <div style="font-size: 20px">&gt;</div>
        </div>
        <el-dialog
            title="邀请"
            :visible.sync="dialogVisible"
            width="90%">
            <el-radio-group v-model="inviteMode">
                <el-radio label="1">普通用户</el-radio>
                <el-radio label="2">会员</el-radio>
            </el-radio-group>
            <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="goInvite">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>
<script lang="ts">
    import {Vue, Component} from 'vue-property-decorator';

    @Component
    export default class MeOfBusinessManager extends Vue {
        private dialogVisible: boolean = false;
        private inviteMode: '2' | '3' = '2';

        private goInvite() {
            this.$router.push(`/fs/invite?identity=${this.inviteMode}`);
        }

        private chooseInvite() {
            this.dialogVisible = true;
        }
    }
</script>
