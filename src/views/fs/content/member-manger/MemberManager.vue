<template>
    <div>
        <div class="flex-menu-box">
            <div>
                <el-image src="/img/invite-member.svg"></el-image>
                <span style="font-size: 14px">邀请会员</span>
            </div>
            <div style="font-size: 20px">&gt;</div>
        </div>
        <div class="flex-menu-box">
            <div>
                <el-image src="/img/area-member.svg"></el-image>
                <span style="font-size: 14px">区域会员</span>
            </div>
            <div style="font-size: 20px">&gt;</div>
        </div>
    </div>
</template>
<script lang="ts">
    import {Vue, Component} from 'vue-property-decorator';

    @Component
    export default class FsMemberManager extends Vue {

    }
</script>
