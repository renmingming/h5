import Vue from "vue"
import Vuex from "vuex";

Vue.use(Vuex)

export default new Vuex.Store({
	state:{
		betTotal: 0,
		sumTotal: 0,
		sc_id: 0,
		pool_one: null,
		pool_two: null,
		pool_one_active: false,
		pool_two_active: false,
		param:{},
		mask: false,
		tips_1: false,
		tips_2: false,
		tips_3: false,
		submit: false,
		ticket: 0,
		isLotterty: false,
	},
});