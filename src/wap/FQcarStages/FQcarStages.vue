<template>
    <div id="body" :class="{noWeiXin: !isWeiXin}">
         <div class="head flexbox align-items">
             <div class="left">分期本金</div>
             <div class="right flex flexbox flex-right" >{{output.installmentBalance | formatMoney}}</div>
         </div>
         <div class="list">
             <div class="item flexbox first"  v-if="output.installmentList && output.installmentList.length > 0">
                 <div class="first">期数</div>
                 <div class="flex">每期应还总额</div>
                 <div class="flex">本金</div>
                 <div class="flex">利息 & 手续费</div>
                 <div class="last"></div>
             </div>
             <div class="item flexbox" v-for="(item, index) in output.installmentList" v-if="output.installmentList" @click="selected(item, index)">
                 <div class="first" v-text="item.period"></div>
                 <div class="flex">￥{{item.amount | formatMoney}}</div>
                 <div class="flex">￥{{item.principal | formatMoney}}</div>
                 <div class="flex">￥{{(item.interest + item.serviceFee) | formatMoney}}</div>
                 <div class="last">
                     <div v-show="item.select" ><i class="iconfont">&#xe6ac;</i></div>
                 </div>
             </div>
         </div>
         <div class="explain flexbox align-items" @click="isshowAlert = true">手续费说明<i class="iconfont">&#xe8e5;</i></div>
         <div class="money">
            <div class="top flexbox">
                <div>首付金额</div>
                <div class="flex flexbox flex-right">￥{{output.downPayment | formatMoney}}</div>
            </div>
            <div class="bottom">
                <div class="li flexbox">
                    <div>交强险</div>
                    <div class="flex flexbox flex-right">￥{{output.jqPremium | formatMoney}}</div>
                </div>
                <div class="li flexbox">
                    <div>车船险</div>
                    <div class="flex flexbox flex-right">￥{{output.ccsPremium | formatMoney}}</div>
                </div>
                <!--
                <div class="li flexbox">
                    <div>首期应付金额</div>
                    <div class="flex flexbox flex-right" v-text="'￥' + output.downPaymentAmount"></div>
                </div>
                -->
            </div>
         </div>
         <div class="btn">
             <div @click="submitData()" :class="{isSubmit: isSubmit}">申请分期</div>
         </div>
         <div class="footer">
             点击按钮，即表示您同意<span @click="go()">《汇保险借款协议》</span>
         </div>
        <!--弹窗-->
         <div class="layer-shade flexbox align-items justify-content" v-show="isshowAlert">
            <div class="com_alert">
                <div class="top">
                    <div>分期利率</div>
                    <span class="fr fr_span" @click="isshowAlert = false"><i class="iconfont">&#xe629;</i></span>
                </div>
                <div class="center">
                    <div class="flexbox align-items justify-content">
                        <div class="left">分期利率 </div>
                        <div class="write">——</div>
                        <div class="right">18%</div>
                    </div>
                     <div class="flexbox align-items justify-content">
                        <div class="left">逾期滞纳金</div>
                        <div class="write">——</div>
                        <div class="right">2‰</div>
                    </div>
                    <div class="flexbox align-items justify-content">
                        <i class="iconfont">&#xe8ec;</i>温馨提示：利息计算方式采用等额本息
                    </div>
                </div>
            </div>
        </div>

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
            isWeiXin: false, //判断是否是微信
            output: {//数据
                installmentList: []
            },
            number: 0, //分期数
            isshowAlert: false,
            isSubmit: true //判断是否可以提交
        }
    },
    created () {
    },
    mounted () {
        // this.showtoast('网络错误，请查看网络是否连接', true);
        // this.confirmShow('aa')
        this.isWeiXin = valid.isWeiXin();
        if (valid.isWeiXin()) {
            this.initWeixinSDK();
        }
        this.getData(); // 获取借款数据
    },
    watch: {
    },
    methods: {
        //获取借款数据
        getData () {
            let obj = {
                tradeId: Common.getQueryString('tradeId')
            }
            request.carInsuranceLoanInfo(obj, (response) => {
                this.multiLogin(response);//多点登陆
                if (response.data.respCode === '000000') {
                    console.log(response.data)
                    let output = response.data.output;
                    if (!output) {
                        return false;
                    }
                    this.output = output;
                    for (let i = 0; i < this.output.installmentList.length; i++) {
                        this.$set(this.output.installmentList[i], 'select', false);
                        if (i === 0) {
                            this.output.installmentList[i].select = true;
                        }
                    }
                    this.isSubmit = true;
                } else {
                    this.isSubmit =false;
                    this.showtoast(response.data.respMsg, true);
                }
            }, (err) => {
                this.isSubmit =false;
                console.log(JSON.stringify(err));
            })
        },
        //点击分期
        selected (item, index) {
            this.output.installmentList.map((value) => {
                value.select = false;
            })
            this.number = index;
            item.select = true;
        },
        //申请分期
        submitData () {
            if (!this.isSubmit) {
                return false; //借口报错，或已提交分期不用提交
            }
            // window.location.href = 'FQbankCardBind.html'
            let obj = {
                userId: Common.getUserId()
            }
            // 判断是否有银行卡
            request.bindBankCardList(obj, (response) => {
                this.multiLogin(response);//多点登陆
                if (response.data.respCode === '000000') {
                    let output = response.data.output;
                    if (parseInt(output.length) === 0) {
                        window.location.href = 'FQbankCardBind.html?periodNumber=' + this.output.installmentList[this.number].period + '&tradeId=' + Common.getQueryString('tradeId');
                    } else {
                        window.location.href = 'FQaddContact.html?periodNumber=' + this.output.installmentList[this.number].period + '&tradeId=' + Common.getQueryString('tradeId');
                    }
                } else {
                    this.showtoast(response.data.respMsg, true);
                }
            }, (err) => {
                console.log(err)
            })
        },
        go () {
            window.location.href = 'FQloanAgreement.html';
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
        //金钱
        formatMoney (val) {
            if (!val) {
                return '0.00';
            } else {
                return (val/100).toFixed(2);
            }
        }
    }
}
</script>
