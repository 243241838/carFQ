<template>
    <div id="body" :class="{noWeiXin: !isWeiXin}">
         <div class="head">
            <p>绑卡将用于首付款的自动扣除，请保证银行卡余额充足</p>
         </div>
         <div class="list">
             <div class="item flexbox">
                 <div class="left">真实姓名</div>
                 <div class="flex right">
                     <span v-if="name" v-text="name">432</span>
                     <input v-else v-model="name1"  maxlength="8" placeholder="请输入真是姓名"  type="text">
                 </div>
             </div>
             <div class="item flexbox">
                 <div class="left">身份证号</div>
                 <div class="flex right">
                      <span v-if="idNo">{{idNo | ellipsisId}}</span>
                      <input v-model="idNo1" v-else placeholder="请输入身份证号"  type="text">
                 </div>
             </div>
         </div>
         <div class="list">
             <div class="item flexbox">
                 <div class="left">银行卡号</div>
                 <div class="flex right flexbox align-items">
                     <input class="flex" maxlength="30"  v-model="bankData"  type="text" placeholder="请输入您的银行卡号">
                     <div class="clear flexbox flex-right jian" @click="bankData = ''"><i class="iconfont clear">&#xe609;</i></div>
                  </div>
             </div>
             <div class="item flexbox"  @click="isshowBank = true">
                 <div class="left bank" v-if="!opening_bank">请选择的开户行</div>
                 <div class="left bank" v-else v-text="opening_bank.name"></div>
                 <div class="flex flexbox flex-right right"><i class="iconfont">&#xe667;</i></div>
             </div>
         </div>
          <div class="list">
             <div class="item flexbox">
                 <div class="left">手机号</div>
                 <div class="flex right">
                     <span v-if="mobile" v-text="mobile"></span>
                     <input v-else class="flex" maxlength="11"  v-model="mobile1"  type="text" placeholder="请输手机号">
                 </div>
             </div>
             <div class="item flexbox">
                 <div class="left">验证码</div>
                 <div class="flex right flexbox align-items">
                     <input class="flex" maxlength="6" v-model="code" type="text" placeholder="请输入验证码">
                     <div class="clickCode" :class="{'isGeting': !isGeting}">
                          <span v-show="isGeting" @click="verification(1)" v-model="code">获取验证码</span>
                          <span v-show="!isGeting"><span v-text="time.seconds"></span>秒</span>
                     </div>
                 </div>
             </div>
         </div>
         <div class="footer">
             <div@click="verification()" :class="{isCode: !isCode}">确认绑定</div>
         </div>
         <p class="agreement">点击按钮，即表示您同意<span @click="go()">《委托扣款协议》</span></p>
         <!--底部滑窗-->
        <div class="layer-shade car_number" v-show="isshowBank">
                <div class="choose-city">
                    <div class="title">
                        请选择开户行
                        <span class="close" @click="isshowBank = false">
                            <i class="iconfont position">&#xe629;</i>
                        </span>
                    </div>
                    <div class="city-list">
                        <span class="city-item cur">
                            请选择
                        </span>
                    </div>
                    <ul class="cityDetail-list"> 
                        <li class="cityDetail-item" v-for="item in bankList" v-text="item.name" @click="selectBottomBamk(item)"></li>
                    </ul>
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
            isshowBank: false,
            bankList: [], //银行列表
            isWeiXin: false, //判断是否是微信
            isshowAlert: false,
            isGeting: true,
            time: { // 倒计时
                seconds: ''
            },
            endTime: 0,
            isTimeout: false, // 是否超时
            name: '', //名字
            name1: '', //输入的值
            idNo: '', //身份证号
            idNo1: '', //输入的值
            bankData: '', //银行卡号
            opening_bank: '', //开户行
            code: '', //二维码
            mobile: '', //手机电话
            mobile1: '', //输入的值
            transId: '', // 订单号
            isCode: false
        }
    },
    created () {
        this.initTime();
    },
    mounted () {
        this.isWeiXin = valid.isWeiXin();
        if (valid.isWeiXin()) {
            this.initWeixinSDK();
        }
        this.init(); //初始化
    },
    watch: {
    },
    methods: {
        //初始化
        init () {
            let userInfo = storage.get('userInfo')
            if (userInfo) {
                userInfo = JSON.parse(userInfo);
                if (userInfo.mobile) {
                    this.mobile = userInfo.mobile;
                }
            }
            this.getBankList(); //获取银行列表
            this.bankContactData();
        },
        //获取银行开户行数据
        getBankList () {
            request.bankList({}, (response) => {
                console.log(response.data)
                this.multiLogin(response);//多点登陆
                if (response.data.respCode === '000000') {
                    let output = response.data.output;
                    if (!output) {
                        return false;
                    }
                    this.bankList = output;
                } else {
                    this.showtoast(response.data.respMsg, true);
                }
            }, (err) => {
                console.log(JSON.stringify(err));
            })
        },
         //获取银行联系人
        bankContactData () {
            let obj = {
                userId: Common.getUserId()
            }
            request.idCardMesInfo(obj, (response) => {
                console.log(response.data)
                this.multiLogin(response);//多点登陆
                if (response.data.respCode === '000000') {
                    let output = response.data.output;
                    if (!output) {
                        return false;
                    }
                    this.name = output.policyholderName;
                    if (output.mobile) {
                        this.mobile = output.mobile;
                    }
                    this.idNo = output.identifyNumber
                } else {
                    this.showtoast(response.data.respMsg, true);
                }
            }, (err) => {
                console.log(JSON.stringify(err));
            })
        },
        //点击开户行
        selectBottomBamk (item) {
            this.opening_bank = item;
            this.isshowBank = false;
        },
           // 初始化倒计时
        initTime () {
            let t = storage.get('bankTime');
            let ct = new Date().getTime();
            if (t) {
                if (ct < t) {
                    this.time60();
                }
            }
        },
        //
        verification (number) {
            if (!valid.userName(this.name1) && !this.name) {
                this.showtoast('姓名为2-8位中文', true);
                return false;
            }
            if (!valid.ID(this.idNo1) && !this.idNo) {
                this.showtoast('请检查身份证号', true);
                return false;
            }
            if (!valid.BankVerification(this.bankData)) {
                this.showtoast('请检查银行卡号(8-30位)', true);
                return false;
            }
            if (this.opening_bank === '') {
                this.showtoast('请选择开户行', true);
                return false;
            }
            if (!valid.phone(this.mobile1) && !this.mobile) {
                this.showtoast('手机号格式不正确', true);
                return false;
            }
            if (number === 1) {
                this.getVerifyCode(); //获取验证码
            } else {
                if (!this.isCode) return false;
                if (this.transId === '') {
                    this.showtoast('请点击获取验证码', true);
                    return false;
                }
                if (this.code === '') {
                    this.showtoast('请填写验证码', true);
                    return false;
                }
                if (!valid.number(this.code) || this.code.length < 6) {
                    this.showtoast('验证码为6位数字', true);
                }
                this.notarizeBind(); //确认绑卡
            }
        },
        //获取验证码(预绑卡)
        getVerifyCode () {
            let obj = {
                accNo: this.bankData,
                bankId: this.opening_bank.id,
                idCard: this.idNo ? this.idNo : this.idNo1,
                idHolder: this.name ? this.name : this.name1,
                mobile: this.mobile ? this.mobile : this.mobile1,
                validDate: '',
                validNo: '',
                userId: Common.getUserId()
            }
            console.log(obj)
            request.bankCardBindPre(obj, (response) => {
                console.log(response.data)
                this.multiLogin(response);//多点登陆
                this.time60();// 倒计时
                if (response.data.respCode === '000000') {
                    let output = response.data.output;
                    if (!output) {
                        return false;
                    }
                    this.isCode = true;
                    this.transId = output.transId;
                } else {
                    this.showtoast(response.data.respMsg, true);
                }
            }, (err) => {
                console.log(JSON.stringify(err));
            })
        },
        //确认绑定
        notarizeBind () {
            let obj = {
                bankCardNo: this.bankData,
                bankId: this.opening_bank.id,
                bankName: this.opening_bank.name,
                bindId: '',
                cardId: this.idNo ? this.idNo : this.idNo1,
                name: this.name ? this.name : this.name1,
                phone: this.mobile ? this.mobile : this.mobile1,
                smsCode: this.code,
                transId: this.transId,
                userId: Common.getUserId()
            }
            request.bankCardBind(obj, (response) => {
                console.log(response.data)
                this.multiLogin(response);//多点登陆
                if (response.data.respCode === '000000') {
                    let output = response.data.output;
                    this.showtoast('绑卡成功！', true);
                    if (Common.getQueryString('isAdd')) {
                        window.history.back();
                        return false;
                    } else {
                        window.location.href = 'FQaddContact.html?periodNumber=' + Common.getQueryString('periodNumber') + '&tradeId=' + Common.getQueryString('tradeId');
                    }
                } else {
                    this.showtoast(response.data.respMsg, true);
                }
            }, (err) => {
                console.log(JSON.stringify(err));
            })
        },
         // 倒计时
        // 过期时间
        getEndTime () {
            let sTime = storage.get('bankTime');
            var endTime = '';
            if (sTime) {
                endTime = new Date().getTime() >= sTime ? new Date().getTime() + 60 * 1000 : sTime;
            } else {
                endTime = new Date().getTime() + 60 * 1000;
            }
            storage.set('bankTime', endTime);
            return endTime;
        },
          // 倒计时
        time60 () {
            this.endTime = this.getEndTime();
            this.isGeting = false;// 切换倒计时和获得验证码
            this.isTimeout = false;// 是否超时
            Common.countdown(this.time, this.endTime, this.isTimeout, (time, isTimeout) => {
                this.time = time;
                this.isTimeout = isTimeout;
                if (this.isTimeout) {
                    this.isGeting = true;
                }
            });
        },
        go () {
            window.location.href = 'FQEntrustDeductions.html';
        },
        //去掉空格
        keyTrim  (name) {
            this[name].trim();
        },
        formatBankNo (BankNo) {
            if (this[BankNo] === '') return;
            var account = this[BankNo].toString();
            account = account.substring(0, 22); /*帐号的总数, 包括空格在内 */
            if (account.match('.[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}') === null) {
                /* 对照格式 */
                if (account.match('.[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}|' + '.[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}|' +
                '.[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}|' + '.[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}') === null) {
                    var accountNumeric = '';
                    var accountChar = '';
                    var i = '';
                    for (i = 0; i < account.length; i++) {
                        accountChar = account.substr(i, 1);
                        if (!isNaN(accountChar) && (accountChar !== ' ')) accountNumeric = accountNumeric + accountChar;
                    }
                    account = '';
                    for (i = 0; i < accountNumeric.length; i++) { /* 可将以下空格改为-,效果也不错 */
                        if (i === 4) account = account + ' '; /* 帐号第四位数后加空格 */
                        if (i === 8) account = account + ' '; /* 帐号第八位数后加空格 */
                        if (i === 12) account = account + ' ';/* 帐号第十二位后数后加空格 */
                        account = account + accountNumeric.substr(i, 1)
                    }
                }
            } else {
                account = ' ' + account.substring(1, 5) + ' ' + account.substring(6, 10) + ' ' + account.substring(14, 18) + '-' + account.substring(18, 25);
            }
            if (account !== this[BankNo]) this[BankNo] = account;
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
        }
    }
}
</script>
