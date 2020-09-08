<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<style lang="less">
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    html {
        min-height: 100%;
        width: 100%;
        overflow-x: hidden;
        background: #f3f4f5;
    }

    .el-button--primary span {
        color: #fff !important;
    }

    .el-message {
        width: 300px !important;
    }
</style>
