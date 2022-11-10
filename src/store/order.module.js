import {
  FETCH_ORDERS, CREATE_ORDER, UPDATE_ORDER, DELETE_ORDER,
  FETCH_ORDER_DETAIL, FETCH_ORDER_DETAIL_BY_ID, FETCH_ORDER_DETAIL_BY_ORDER_ID, CREATE_ORDER_DETAIL, UPDATE_ORDER_DETAIL, DELETE_ORDER_DETAIL
} from "./action.type";
import baseMixins from '../components/mixins/base'
const state = {
  orders: []
}
const getters = {
  getOrders(state) {
    return state.orders;
  },
}

const mutations = {
  setOrders(state, payload) {
    state.orders = payload;
  },
}

const actions = {
  [FETCH_ORDERS](context, payload) {
    return new Promise(async resolve => {
      let response = await baseMixins.methods.getWithBigInt('/rest/orders')
      if (response && response.status === 200 && response.data) {
        context.commit("setOrders", response.data.data)
      }
      resolve(response)
    })
  },
  [CREATE_ORDER](context, payload) {
    return new Promise(async resolve => {
      let response = await baseMixins.methods.post('/rest/orders', payload)
      resolve(response)
    })
  },
  [UPDATE_ORDER](context, payload) {
    return new Promise(async resolve => {
      let response = await baseMixins.methods.put(`/rest/orders/${payload.orderId}`, payload.orderData)
      resolve(response)
    })
  },
  [DELETE_ORDER](context, orderId) {
    return new Promise(async resolve => {
      let response = await baseMixins.methods.delete(`/rest/orders/${orderId}`)
      resolve(response)
    })
  },
}

export default {
  state,
  actions,
  mutations,
  getters
};
