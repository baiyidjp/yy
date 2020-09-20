import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		openid: '',
		companyList: []
	},
	getters: {
		openid: state => {
			return state.openid
		},
		companyList: state => {
			return state.companyList
		}
	},
	mutations: {
		UPDATECOMPANYLIST (state, payload) {
			state.companyList = payload.data
		}
	},
	actions: {
		
	}
})

export default store