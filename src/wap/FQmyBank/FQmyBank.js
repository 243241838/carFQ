import { Vue, Common, Init } from 'js/base';
import {valid} from 'js/common';
import './scss/FQmyBank.scss'
import headerCommon from '../../components/headerCommon.vue';
import FQmyBank from './FQmyBank.vue'
var homeVue = new Vue({
    el: '#FQmyBank',
    data () {
        return {
            title: '我的银行卡',
            isWeiXin: false
        }
    },
    template: '<div class="pageview"><headerCommon v-if="!isWeiXin" :title="title" :rem= "true" :isFiexd="true"></headerCommon><FQmyBank></FQmyBank></div>',
    components: {
        headerCommon: headerCommon,
        'FQmyBank': FQmyBank
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
    }
})