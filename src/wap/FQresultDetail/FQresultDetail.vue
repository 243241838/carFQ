<template>
    <div id="body" :class="{noWeiXin: !isWeiXin}">
         <div class="head">
             <div class="top">
                <img src="./images/img.png" alt="">
             </div>
             <p class="success">提交成功</p>
             <p class="bottom">客服审核中，请保持手机畅通，同时保证银行卡余额充足以便成功代扣首付</p>
         </div>
        <div class="btn" @click="go()"><div>完成</div></div>
         <toast :isshow='toast.isshow' @ontoastback='closetoast'>{{ toast.message}}</toast>
        <loading :isshow='loading'></loading>
        <layer :layer-options="layer" v-on:onlayerback="closeLayer" ></layer>
    </div>
</template>
<script>
import {Common, valid, storage} from 'js/common';
import request from 'js/interface/request';
import toast from '../../components/toast' // toast引用：
import loading from '../../components/loading';
import layer from '../../components/layer';
import weixinSDK from 'js/weixinSDK';
export default {
    components: {
        toast,
        loading,
        layer
    },
    data () {
        return {
            loading: false, // 加载中
            toast: { // toast引用
                isshow: false,
                message: ''
            },
            layer: { // layer引用：2.属性
                isshow: false, // 是否打开弹框
                btns: [], // 弹框按钮名称
                type: 'alert', // 类型：'alert'/'confirm'/'prop'
                message: '', // 内容
                shadeClose: false, // 是否点击遮罩时关闭层
                yes: function () {}, // 确认回调
                no: function () {} // 取消回调
            }
        }
    },
    created () {
    },
    mounted () {
        this.isWeiXin = valid.isWeiXin();
        if (valid.isWeiXin()) {
            this.initWeixinSDK();
        }
    },
    watch: {
    },
    methods: {
        go () {
            window.location.href = 'FQOrderDetail.html?tradeId=' + Common.getQueryString('tradeId');
        },
        showtoast (msg, isshow) { // toast引用：3.显示
            this.toast.message = msg;
            this.toast.isshow = isshow;
        },
        closetoast () {
            this.toast.isshow = false;
        },
        confirmShow (val) { // confirm实例
            let that = this;
            this.showLayer(val, {
                type: 'confirm',
                btns: ['重新报价', '去看看'],
                yes: function () {
                    // that.mony_lsit()
                },
                no: function () {
                    // that.Re_Quote();
                }
            })
        },
        showLayer (msg, options) {
            // layer引用：3.显示弹框
            this.layer.type = options.type;
            this.layer.message = msg;
            this.layer.isshow = true;
            this.layer.shadeClose = options.shadeClose;
            this.layer.btns = options.btns;
            this.layer.yes = options.yes;
            this.layer.no = options.no;
        },
        alertShow (value) { // alert实例
            this.showLayer(value, {
                type: 'alert', // 必填
                btns: ['我知道啦'], // 必填
                yes: () => { // 选填
                    let localhost = window.location;
                    storage.set('prevPage', window.location.pathname.replace('/wap/', '') + window.location.search);
                    window.location.href = './FQLogin.html';
                    return false;
                }
            })
        },
        closeLayer (type, shade) {
            // layer引用：4.回调函数
            if (type === 'cancel') {
                this.layer.no && this.layer.no();
            } else {
                this.layer.yes && this.layer.yes();
            }
        },
        //微信分享
        initWeixinSDK () {
            let obj = {
                url: window.location.href
            }
            request.getWXJsAPISignature(obj, (response) => {
                this.multiLogin(response);
                if (response.data.respCode === '000000') {
                    let output = response.data.output;
                    if (window.wx) {
                        // 微信配置
                        weixinSDK.config(window.wx, output);
                        weixinSDK.ready(window.wx, () => {
                            // 判断当前客户端版本是否支持指定JS接口
                            weixinSDK.checkJsApi(window.wx);
                            // 分享
                            weixinSDK.initShare(window.wx, 1);
                        });
                    }
                }
            }, () => {
                this.showtoast('网络错误，请查看网络是否连接', true);
            })
        },
         // 多点登录
        multiLogin (response) {
            if (response.data.respCode === '100106') {
                this.loading = false;
                if (valid.isWeiXin()) {
                    //静默授权
                    weixinSDK.getAccessNone(window.location.href);
                } else {
                    this.alertShow(response.data.respMsg)
                }
                return false;
            } else if (response.data.respCode !== '000000') {
                this.showtoast(response.data.respMsg, true);
            }
        }
    },
    filters: {
    }
}
</script>
