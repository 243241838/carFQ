import { Vue, Common, Init } from 'js/base';
import {valid} from 'js/common';
import './scss/FQloanAgreement.scss'
import headerCommon from '../../components/headerCommon.vue';
import FQloanAgreement from './FQloanAgreement.vue'
var homeVue = new Vue({
    el: '#FQloanAgreement',
    data () {
        return {
            title: '汇保险借款协议',
            isWeiXin: false
        }
    },
    template: '<div class="pageview"><headerCommon v-if="!isWeiXin" :title="title" :rem= "true" :isFiexd="true"></headerCommon><FQloanAgreement></FQloanAgreement></div>',
    components: {
        headerCommon: headerCommon,
        'FQloanAgreement': FQloanAgreement
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
    }
})