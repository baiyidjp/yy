import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		openid: null,
		companyList: null,
		clientList: null,
		channelList: null
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
		UPDATEOPENID (state, payload) {
			state.openid = payload.openid
		},
		UPDATECOMPANYLIST (state, payload) {
			state.companyList = payload.companyList
		},
		ADDCOMPANY (state, payload) {
			state.companyList = [...state.companyList, payload.company]
		},
		UPDATECLIENTLIST (state, payload) {
			state.clientList = payload.clientList
		},
		UPDATECHANNELLIST (state, payload) {
			state.channelList = payload.channelList
		}
	},
	actions: {
	}
})

export default store