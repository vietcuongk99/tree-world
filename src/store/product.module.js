import { FETCH_PRODUCTS, FETCH_PRODUCTS_AVAILABLE, FETCH_PRODUCT_BY_ID, CREATE_PRODUCT, UPDATE_PRODUCT, DISABLE_PRODUCT } from "./action.type";
import baseMixins from '../components/mixins/base'
const state = {
  products: []
}
const getters = {
  getProducts(state) {
    return state.products;
  },
}

const mutations = {
  setProducts(state, payload) {
    state.products = payload;
  },
}

const actions = {
  [FETCH_PRODUCTS](context, payload) {
    return new Promise(async resolve => {
      let response = await baseMixins.methods.getWithBigInt('/rest/products/listAllProduct')
      if (response && response.status === 200 && response.data) {
        context.commit("setProducts", response.data.data)
      }
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
