<template>
    <div id="body" :class="{noWeiXin: !isWeiXin}">
         <div class="head">
            <div>
                <div class="fl left">
                    <div class="top" >{{output.principal | formatMoney}}</div>
                    <div class="bottom">借款本金&nbsp;&nbsp;(元)</div>
                </div>
                <div class="fl right">
                    <div class="top" v-text="output.periodNumber"></div>
                    <div class="bottom">借款期数&nbsp;&nbsp;(月)</div>
                </div>
            </div>
         </div>
         <div class="textData">
              <div class="item">
                  <div class="left fl">已还金额</div>
                  <div class="right fr">￥{{output.repaidAmount | formatMoney}}</div>
              </div>
              <div class="item">
                  <div class="left fl">剩余金额</div>
                  <div class="right fr">￥{{output.overplusAmount | formatMoney}}</div>
              </div>
              <div class="item">
                  <div class="left fl">扣款银行卡</div>
                  <div class="right fr">{{output.bankCardNo | ellipsisId}}</div>
              </div>
         </div>
         <div class="stsTime" v-show="output.abRepaymentPlanList && output.abRepaymentPlanList.length > 0"></div>
        <!--未还-->
         <div class="list" v-for="(item, index) in output.abRepaymentPlanList">
            <div class="top" :class="{select: item.current, overdue: item.overdueStatus == -10}">
                <div class="flexbox align-items">
                    <div :class="{select: item.current, overdue: item.overdueStatus == -10}"></div>
                    <div class="flex">第&nbsp;{{item.period}}&nbsp;期&nbsp;{{item.repayDate | timeFilter}}&nbsp;&nbsp;&nbsp;<span v-show="item.overdueStatus== -10">已逾期，滞纳金：{{item.dueLateInterest | formatMoney}}元</span></div>
                </div>
            </div>
            <div class="item flexbox align-items">
                <div class="left">
                    <div >{{item.duePrincipal | formatMoney}}</div>
                    <div>本期本金（元）</div>
                </div>
                <div class="center">
                    <div >{{item.dueInterest | formatMoney}}</div>
                    <div>本期利息（元）</div>
                </div>
                <div class="right">
                    <div class="period" v-if="item.overdueStatus != -10" :class="{select: index == 0}">{{index == 0 ? '本期' : '未到期'}}</div>
                    <div class="period overdue" v-else>{{item.overdueStatus == -10 ? '已逾期' : '未到期'}}</div>
                </div>
            </div>
         </div>
         <div class="weihuan" v-show="output.alRepaymentPlanList.length == output.periodNumber">已还{{output.alRepaymentPlanList.length}}期</div>
         <div class="btn" @click="isCurrent = !isCurrent" v-show="output.abRepaymentPlanList && output.abRepaymentPlanList.length > 0 &&  output.alRepaymentPlanList && output.alRepaymentPlanList.length > 0">
              <div>
                  已还历史
                  <i class="iconfont" v-show="isCurrent">&#xe6af;</i>
                  <i class="iconfont" v-show="!isCurrent">&#xe6ae;</i>
               </div>
         </div>
         <div class="list" v-show="!isCurrent" v-for="item in output.alRepaymentPlanList">
            <div class="top Has_also flexbox">
                <div class="flexbox align-items left">
                    <div class="Has_also"></div>
                    <div class="flex">第&nbsp;{{item.period}}&nbsp;期&nbsp;{{item.actualRepayDate | timeFilter}}</div>
                </div>
                <div class="flex flexbox align-items flex-right">
                    {{item.repaidAmount | formatMoney}}元
                </div>
            </div>
            <div class="item flexbox align-items">
                <div class="left">
                    <div class="Has_also">{{item.duePrincipal | formatMoney}}</div>
                    <div>本期本金（元）</div>
                </div>
                <div class="center">
                    <div class="Has_also">{{item.dueInterest | formatMoney}}</div>
                    <div>本期利息（元）</div>
                </div>
                <div class="right">
                    <div class="period Has_also">已还</div>
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
            isCurrent: true, // 是否当前
            output: {
                abRepaymentPlanList: '',
                alRepaymentPlanList: ''
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
        this.getData(); // 获取还款数据
    },
    watch: {
    },
    methods: {
        //获取借款数据
        getData () {
            let obj = {
                userId: Common.getUserId(),
                tradeId: Common.getQueryString('tradeId')
            }
            console.log(obj)
            request.loanOrderDetail(obj, (response) => {
                console.log(response.data.output)
                this.multiLogin(response);
                if (response.data.respCode === '000000') {
                    let output = response.data.output;
                    if (!output) {
                        return false;
                    }
                    this.output = output;
                    if (output.abRepaymentPlanList.length === 0) {
                        this.isCurrent = false;
                    }
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
         //金钱
        formatMoney (val) {
            if (!val) {
                return '0.00';
            } else {
                return (val/100).toFixed(2);
            }
        },
          // 身份证省略显示
        ellipsisId: function (value) {
            if (!value) {
                return;
            }
            var str = value.substring(0, 4);
            for (var i = 4; i < value.length - 4; i++) {
                str += '*';
            }
            return str + value.substring(value.length - 4);
        },
         //时间过滤
        timeFilter (val) {
            if (!val) {
                return '';
            } else {
                var date = new Date(val);
                let Y = date.getFullYear() + '-';
                let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
                let D = date.getDate() + ' ';
                let h = date.getHours() + ':';
                let m = (date.getMinutes()< 10 ? '0' + date.getMinutes() : date.getMinutes())+ ':';
                let s = date.getSeconds();
                return Y + M + D;
            }
        }
    }
}
</script>
