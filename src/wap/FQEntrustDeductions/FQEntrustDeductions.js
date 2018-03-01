import { Vue, Common, Init } from 'js/base';
import {valid} from 'js/common';
import './scss/FQEntrustDeductions.scss'
import headerCommon from '../../components/headerCommon.vue';
import FQEntrustDeductions from './FQEntrustDeductions.vue'
var homeVue = new Vue({
    el: '#FQEntrustDeductions',
    data () {
        return {
            title: '委托扣款协议',
            isWeiXin: false
        }
    },
    template: '<div class="pageview"><headerCommon v-if="!isWeiXin" :title="title" :rem= "true" :isFiexd="true"></headerCommon><FQEntrustDeductions></FQEntrustDeductions></div>',
    components: {
        headerCommon: headerCommon,
        'FQEntrustDeductions': FQEntrustDeductions
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
    }
})