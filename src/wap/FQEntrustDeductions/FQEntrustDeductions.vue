<template>
    <div id="body" :class="{noWeiXin: !isWeiXin}">
        <div class="head">授权扣款委托书</div>
        <p>授权人： <span v-text="output.policyholderName"></span></p>
        <p>被授权人： 宝付网络科技（上海）有限公司</p>
        <p>授权人同意并签署本委托书，在此通过本委托书作出如下授权与承诺：</p>
        <p>一、授权人同意并授权被授权人针对授权人通过使用被授权人或被授权人合作方运营的网络平台（以下简称“平台”）发起的所有借款项目（包括本委托书生效之前及其之后的借款项目，具体以授权人签订的各《借款协议》、《平台服务协议》为准），协同与被授权人或被授权人合作方合作的指定第三方银行或第三方支付机构（以下简称“被授权人指定第三方”）从授权人通过本委托书指定银行卡（银行卡账户信息见第十五条）进行资金的代扣、代还、代付及划转各《借款协议》、《平台服务协议》项下的应付款项。</p>
        <p>二、授权人同意，在各《借款协议》及《平台服务协议》生效后，被授权人及被授权人指定第三方有权依照各《借款协议》及《平台服务协议》约定的期限和金额代扣授权人指定银行卡账户中的相应资金。</p>
        <p>三、本委托书项下的应付款项包括但不限于授权人通过使用平台发起的全部借款相关款项，支付顺序依次：</p>
        <p>1、没有逾期的，还款顺序依次为利息、本金；</p>
        <p>2、选择提前结清的，需一次性偿还利息和本金；</p>
        <p>3、发生逾期时还款顺序依次为逾期管理费、利息、本金。</p>
        <p>四、授权人承诺，本委托书第十五条记载的授权银行卡账户是以本人真实姓名开立的合法、有效的银行卡账户，授权人同意本委托书第一条、第二条约定的资金代扣及转账优先于该账<p>户其他任何用途的支付。</p>
        <p>五、授权人同意，在借款成功后，如因银行、第三方支付等任何原因导致被授权人及被授权人指定第三方无法将款项代还至授权指定的银行卡账户中，由此引起的任何后果，由授权人承担。</p>
        <p>六、授权人知悉被授权人及被授权人指定第三方对此项资金代扣、代还、代付及划转服务不收费，被授权人及被授权人指定第三方会尽其最大努力及时完成此项资金划转服务，但被授权人不对此项服务作任何永久性承诺。与本委托书项下的资金代扣、代还、代付及划转服务相关的任何责任，与被授权人及被授权人指定第三方无关，被授权人及被授权人指定第三方亦无义务承担。</p>
        <p>七、授权人在指定银行卡账户中必须留有足够余额，否则因账户余额不足或不可归责于被授权人的任何事由，导致无法及时扣款或扣款错误、失败，责任由授权人自行承担。余额不足的，授权人知悉并同意被授权人会就授权人全部应还款项持续进行代扣，直至授权人还清全部应还款项。</p>
        <p>八、各《借款协议》的出借人按照相关协议约定和平台规则转让各《借款协议》项下的债权的，不影响本委托书的有效性。</p>
        <p>九、授权人针对授权人指定的银行卡账户向被授权人进行授权后，即视为授权人就该银行卡在授权人通过平台发起的所有借款项目范围内进行了授权，不因授权人后续更换绑定银行卡，或对其他银行卡进行授权而无效或产生任何影响。</p>
        <p>十、本委托书为授权人对被授权人从其授权的指定账户中扣款和/或向该账户转账的授权证明，不作为收付现金的直接凭据。</p>
        <p>十一、凡本委托书中未约定的事项，适用各《借款协议》、《平台服务协议》的约定，凡本委托书中出现的与各《借款协议》、《平台服务协议》相同的词语或术语，如果在本委托书中无特别定义，适用各《借款协议》、《平台服务协议》中相同词语和术语的定义、涵义或解释，本委托书的规定与各《借款协议》、《平台服务协议》不一致的，以本委托书的规定为准。</p>
        <p>十二、授权人发起终止授权或变更账户、通讯地址时，在当期款项支付日2个工作日前通知被授权人并完成信息更新，否则自行承担所造成的风险损失。</p>
        <p>十三、授权人保证本委托书的真实性、合法性、有效性，被授权人依据本委托书进行的操作引起的一切法律纠纷或风险，由授权人独立承担或解决。</p>
        <p>十四、本委托书自授权人确认同意起生效，至授权人通过平台签订的全部《借款协议》、《平台服务协议》履行完毕，所有款项全部还清时终止。</p>
        <p>十五、授权人资料：</p>
        <p>姓名	</p>
        <p>身份证号码	</p>
        <p>联系手机	</p>
        <p>借记卡户名	</p>
        <p>借记卡开户银行	</p>
        <p>借记卡账号	</p>
        <br>
        <br>
        <p>授权人： <span v-text="output.policyholderName"></span></p>
        <p>被授权人： 宝付网络科技（上海）有限公司</p>
        <p><span>{{time | formatter}}</span></p>
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
            output: '',
            time: new Date()
        }
    },
    created () {
    },
    mounted () {
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
                userId: Common.getUserId()
            }
            request.idCardMesInfo(obj, (response) => {
                this.multiLogin(response);
                if (response.data.respCode === '000000') {
                    let output = response.data.output;
                    if (!output) {
                        return false;
                    }
                    this.output = output;
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
        // 身份证省略显示
        formatter: function (value) {
            if (!value) {
                return;
            }
            var date = value;
            let Y = date.getFullYear();
            let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
            let D = date.getDate();
            return Y + '年' + M + '月' + D + '日';
        }
    }
}
</script>
