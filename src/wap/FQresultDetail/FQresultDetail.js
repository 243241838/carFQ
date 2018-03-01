import { Vue, Common, Init } from 'js/base';
import {valid} from 'js/common';
import './scss/FQresultDetail.scss'
import headerCommon from '../../components/headerCommon.vue';
import FQresultDetail from './FQresultDetail.vue'
var homeVue = new Vue({
    el: '#FQresultDetail',
    data () {
        return {
            title: '结果详情',
            isWeiXin: false
        }
    },
    template: '<div class="pageview"><headerCommon v-if="!isWeiXin" :title="title" :rem= "true" :isFiexd="true"></headerCommon><FQresultDetail></FQresultDetail></div>',
    components: {
        headerCommon: headerCommon,
        'FQresultDetail': FQresultDetail
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
    }
})