import { Vue, Common, Init } from 'js/base';
import {valid} from 'js/common';
import './scss/FQcarStages.scss'
import headerCommon from '../../components/headerCommon.vue';
import FQcarStages from './FQcarStages.vue'
var homeVue = new Vue({
    el: '#FQcarStages',
    data () {
        return {
            title: '车险分期',
            isWeiXin: false
        }
    },
    template: '<div class="pageview"><headerCommon v-if="!isWeiXin" :title="title" :rem= "true" :isFiexd="true"></headerCommon><FQcarStages></FQcarStages></div>',
    components: {
        headerCommon: headerCommon,
        'FQcarStages': FQcarStages
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
    }
})