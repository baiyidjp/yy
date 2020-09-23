import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		currentUser: null,
		companyList: null,
		clientList: null,
		channelList: null
	},
	getters: {
		currentUser: state => {
			return state.currentUser
		},
		companyList: state => {
			return state.companyList
		},
		channelList: state => {
			return state.channelList
		},
		clientList: state => {
			return state.clientList
		}
	},
	mutations: {
		UPDATECURRENTUSER (state, payload) {
			state.currentUser = payload.user
		},
		// company
		UPDATECOMPANYLIST (state, payload) {
			state.companyList = payload.companyList
		},
		ADDCOMPANY (state, payload) {
			state.companyList = [...state.companyList, payload.company]
		},
		UPDATECOMPANY (state, payload) {
			state.companyList[payload.index] = payload.company
		},
		DELETECOMPANY (state, payload) {
			state.companyList.splice(payload.index, 1)
		},
		// client
		UPDATECLIENTLIST (state, payload) {
			state.clientList = payload.clientList
		},
		ADDCLIENT (state, payload) {
			state.clientList = [...state.clientList, payload.client]
		},
		UPDATECLIENT (state, payload) {
			state.clientList[payload.index] = payload.client
		},
		DELETECLIENT (state, payload) {
			state.clientList.splice(payload.index, 1)
		},
		// channel
		UPDATECHANNELLIST (state, payload) {
			state.channelList = payload.channelList
		},
		ADDCHANNEL (state, payload) {
			state.channelList = [...state.channelList, payload.channel]
		},
		UPDATECHANNEL (state, payload) {
			state.channelList[payload.index] = payload.channel
		},
		DELETECHANNEL (state, payload) {
			state.channelList.splice(payload.index, 1)
		}
	},
	actions: {
	}
})

export default store