<template>
    <div id="body" :class="{noWeiXin: !isWeiXin}">
         <div class="head">联系人</div>
         <div class="list">
            <div class="item flexbox" >
                <div class="left">姓名</div>
                <input class=" flex" maxlength="8" type="text" placeholder="请输入联系人姓名" v-model="output.name">
            </div>
            <div class="item flexbox align-items">
                <div class="left">手机号</div>
                <input class=" flex" maxlength="11" type="text" placeholder="请输入联系人手机号" v-model="output.phone">
            </div>
         </div>
         <div class="head">次要联系人</div>
         <div class="list">
            <div class="item flexbox">
                <div class="left">姓名</div>
                <input class=" flex" maxlength="8" type="text" placeholder="请输入联系人姓名" v-model="output1.name">
            </div>
            <div class="item flexbox align-items">
                <div class="left">手机号</div>
                <input class=" flex" maxlength="11" type="text" placeholder="请输入联系人手机号" v-model="output1.phone">
            </div>
         </div>
         <div class="head">第三方联系人</div>
         <div class="list">
            <div class="item flexbox">
                <div class="left">姓名</div>
                <input class=" flex" maxlength="8" type="text" placeholder="请输入联系人姓名" v-model="output2.name" >
            </div>
            <div class="item flexbox align-items">
                <div class="left">手机号</div>
                <input class=" flex" maxlength="11" type="text" placeholder="请输入联系人手机号" v-model="output2.phone">
            </div>
         </div>
         <div class="btn">
             <div @click="verification()">提交审核</div>
         </div>
         <p class="footer flexbox align-items justify-content"><i class="iconfont">&#xe8e5;</i>联系人电话回访失败将影响您的分期审核，请谨慎填写</p>
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
            },
            output: {contactTypeId: 1},
            output1: {contactTypeId: 2},
            output2: {contactTypeId: 3}
        }
    },
    created () {
    },
    mounted () {
        this.isWeiXin = valid.isWeiXin();
        if (valid.isWeiXin()) {
            this.initWeixinSDK();
        }
        this.getData(); // 获取联系人数据
    },
    watch: {
    },
    methods: {
        //获取联系人数据
        getData () {
            let obj = {
                userId: Common.getUserId()
            }
            request.userContactList(obj, (response) => {
                this.multiLogin(response);//多点登陆
                if (response.data.respCode === '000000') {
                    console.log(response.data.output)
                    let output = response.data.output;
                    if (!output) {
                        return false;
                    }
                    for (let i = 0; i < output.length; i++) {
                        if (output[i].contactTypeId === 1) {
                            this.output = output[i]
                        }
                        if (output[i].contactTypeId === 2) {
                            this.output1 = output[i]
                        }
                        if (output[i].contactTypeId === 3) {
                            this.output2 = output[i]
                        }
                    }
                    // console.log(this.output1)
                } else {
                    this.showtoast(response.data.respMsg, true);
                }
            }, (err) => {
                console.log(JSON.stringify(err));
            })
        },
        //验证
        verification () {
            if (this.output.name && !valid.userName(this.output.name)) {
                this.showtoast('联系人姓名为2-8位中文', true);
                return false;
            }
            if (this.output1.name && !valid.userName(this.output1.name)) {
                this.showtoast('次要联系人姓名为2-8位中文', true);
                return false;
            }
            if (this.output2.name && !valid.userName(this.output2.name)) {
                this.showtoast('第三方联系人姓名为2-8位中文', true);
                return false;
            }
            if (this.output.phone && !valid.phone(this.output.phone)) {
                this.showtoast('联系人手机号格式错误', true);
                return false;
            }
            if (this.output1.phone && !valid.phone(this.output1.phone)) {
                this.showtoast('次要联系人手机号格式错误', true);
                return false;
            }
            if (this.output2.phone && !valid.phone(this.output2.phone)) {
                this.showtoast('第三方联系人手机号格式错误', true);
                return false;
            }
            let obj = [];
            obj.push(this.output);
            obj.push(this.output1);
            obj.push(this.output2);
            let number = [];
            obj.map((item, index) => {
                if (item.name && item.phone) {
                    number.push(item)
                }
            })
            if (number.length < 2) {
                this.showtoast('至少填写两个人的姓名和电话', true);
                return false;
            }
            if (this.output.phone && this.output1.phone && this.output.phone === this.output1.phone) {
                this.showtoast('联系人和次要联系人电话重复', true);
                return false;
            }
            if (this.output.phone && this.output2.phone && this.output.phone === this.output2.phone) {
                this.showtoast('联系人和第三方联系人电话重复', true);
                return false;
            }
            if (this.output1.phone && this.output2.phone && this.output1.phone === this.output2.phone) {
                this.showtoast('次要联系人和第三方联系人电话重复', true);
                return false;
            }
            this.submitData(number); // 提交数据
        },
        submitData (data) {
            let obj = {
                userId: Common.getUserId(),
                contactList: data,
                periodNumber: Common.getQueryString('periodNumber'),
                tradeId: Common.getQueryString('tradeId')
            }
            console.log(obj)
            request.carInstallmentApply(obj, (response) => {
                this.multiLogin(response);//多点登陆
                if (response.data.respCode === '000000') {
                    this.showtoast('提交成功', true);
                    window.location.href = 'FQresultDetail.html?tradeId=' + Common.getQueryString('tradeId');
                } else {
                    this.showtoast(response.data.respMsg, true);
                }
            }, (err) => {
                console.log(JSON.stringify(err));
            })
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
