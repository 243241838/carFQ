import { Vue, Common, Init } from 'js/base';
import {valid} from 'js/common';
import './scss/FQbankCardBind.scss'
import headerCommon from '../../components/headerCommon.vue';
import FQbankCardBind from './FQbankCardBind.vue'
var homeVue = new Vue({
    el: '#FQbankCardBind',
    data () {
        return {
            title: '绑定银行卡',
            isWeiXin: false
        }
    },
    template: '<div class="pageview"><headerCommon v-if="!isWeiXin" :title="title" :rem= "true" :isFiexd="true"></headerCommon><FQbankCardBind></FQbankCardBind></div>',
    components: {
        headerCommon: headerCommon,
        'FQbankCardBind': FQbankCardBind
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
    }
})