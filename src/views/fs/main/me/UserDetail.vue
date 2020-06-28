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
    <div v-if="user" style="padding: 10px 0">
        <div style="width: 95%;margin: 0 auto;background: #fff;padding: 0 10px;border-radius: 5px">
            <div class="detail-box">
                <div style="font-size: 14px">头像</div>
                <div>
                    <el-image :src="user.avatar"
                              style="width: 50px;height: 50px;border-radius: 50px;display: block"></el-image>
                </div>
            </div>
            <div class="detail-box">
                <div>用户名</div>
                <div>
                    {{user.username}}
                </div>
            </div>
            <div class="detail-box">
                <div>性别</div>
                <div>
                    {{user.sex === 1?'男':'女'}}
                </div>
            </div>
            <div class="detail-box">
                <div>手机</div>
                <div>
                    {{user.phone}}
                </div>
            </div>
            <div class="detail-box" style="border: 0;padding-bottom: 15px">
                <div>收货门面</div>
                <div>
                    {{user.store_name?user.store_name:'无'}}
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
    import {Vue, Component} from 'vue-property-decorator';

    @Component
    export default class FsMeDetail extends Vue {
        get user() {
            return this.$store.state.user;
        }
    }
</script>