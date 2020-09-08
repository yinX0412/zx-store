import wx from 'weixin-js-sdk';
import {getPayOrderConfig} from '@/service/fs/fs-pay-service';

var AppId = '';
var Timestamp = '';
var Signature = '';
var Noncestr = '';

function GetSignature(type: any, order_sn: string) {
    // qryWxSignature 这个是调用后台获取签名的接口
    getPayOrderConfig(type, order_sn).then((data) => {
        AppId = data.appId;
        Timestamp = data.timestamp;
        Signature = data.package;
        Noncestr = data.nonceStr;
        wx.config({
            beta: true,
            debug: false,
            appId: AppId,
            timestamp: Timestamp,
            nonceStr: Noncestr,
            signature: Signature,
            // 这里是把所有的方法都写出来了 如果只需要一个方法可以只写一个
            jsApiList: [
                'checkJsApi',
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'onMenuShareQQ',
                'onMenuShareWeibo',
                'hideMenuItems',
                'showMenuItems',
                'hideAllNonBaseMenuItem',
                'showAllNonBaseMenuItem',
                'translateVoice',
                'startRecord',
                'stopRecord',
                'onRecordEnd',
                'playVoice',
                'pauseVoice',
                'stopVoice',
                'uploadVoice',
                'downloadVoice',
                'chooseImage',
                'previewImage',
                'uploadImage',
                'downloadImage',
                'getNetworkType',
                'openLocation',
                'getLocation',
                'hideOptionMenu',
                'showOptionMenu',
                'closeWindow',
                'scanQRCode',
                'chooseWXPay',
                'openProductSpecificView',
                'addCard',
                'chooseCard',
                'openCard',
                'openWXDeviceLib',
                'closeWXDeviceLib',
                'configWXDeviceWiFi',
                'getWXDeviceInfos',
                'sendDataToWXDevice',
                'startScanWXDevice',
                'stopScanWXDevice',
                'connectWXDevice',
                'disconnectWXDevice',
                'getWXDeviceTicket',
                'WeixinJSBridgeReady',
                'onWXDeviceBindStateChange',
                'onWXDeviceStateChange',
                'onScanWXDeviceResult',
                'onReceiveDataFromWXDevice',
                'onWXDeviceBluetoothStateChange'
            ]
        });
        // wx.ready(function () {
        //     console.log(callback, 'callback');
        //     if (callback) callback();
        // });
    });
}

export {
    GetSignature
};