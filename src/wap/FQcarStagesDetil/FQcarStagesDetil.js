import { Vue, Common, Init } from 'js/base';
import {valid} from 'js/common';
import './scss/FQcarStagesDetil.scss'
import headerCommon from '../../components/headerCommon.vue';
import FQcarStagesDetil from './FQcarStagesDetil.vue'
var homeVue = new Vue({
    el: '#FQcarStagesDetil',
    data () {
        return {
            title: '车险保单',
            isWeiXin: false
        }
    },
    template: '<div class="pageview"><headerCommon v-if="!isWeiXin" :title="title" :rem= "true" :isFiexd="true"></headerCommon><FQcarStagesDetil></FQcarStagesDetil></div>',
    components: {
        headerCommon: headerCommon,
        'FQcarStagesDetil': FQcarStagesDetil
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
    }
})