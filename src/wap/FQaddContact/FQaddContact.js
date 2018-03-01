import { Vue, Common, Init } from 'js/base';
import {valid} from 'js/common';
import './scss/FQaddContact.scss'
import headerCommon from '../../components/headerCommon.vue';
import FQaddContact from './FQaddContact.vue'
var homeVue = new Vue({
    el: '#FQaddContact',
    data () {
        return {
            title: '添加联系人',
            isWeiXin: false
        }
    },
    template: '<div class="pageview"><headerCommon v-if="!isWeiXin" :title="title" :rem= "true" :isFiexd="true"></headerCommon><FQaddContact></FQaddContact></div>',
    components: {
        headerCommon: headerCommon,
        'FQaddContact': FQaddContact
    },
    created () {
        this.isWeiXin = valid.isWeiXin();
    }
})