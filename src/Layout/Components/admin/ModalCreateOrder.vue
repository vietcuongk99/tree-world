<template>
  <b-modal size="xl" hide-footer id="modal-create-order" :title="currentTitleModal" :no-close-on-backdrop="true"
    @hide="cancelCreateOrder(false)">
    <b-card id="update-order" class="main-card search-wrapper mb-20">
      <div class="mb-4">
        <div class="mb-2 font-weight-bold">Thông tin đơn hàng</div>
        <b-row>
          <b-col md="4">
            <b-form-group>
              <label>Mã khuyến mại:</label>
              <multiselect v-model="currentData.promotion" track-by="text" label="text" :show-labels="false"
                :disabled="disabledUpdateOrder" placeholder="Chọn" :options="promotionOptions" :searchable="true">
                <template slot="singleLabel" slot-scope="{ option }">
                  {{ option.text }}
                </template>
              </multiselect>
            </b-form-group>
          </b-col>
          <b-col md="4">
            <b-form-group>
              <label>Trạng thái <span class="text-danger">*</span>:</label>
              <multiselect v-model="$v.currentData.orderStatus.$model" track-by="text" label="text" :show-labels="false"
                :disabled="disabledUpdateOrder || !isUpdate" placeholder="Chọn" :options="orderStatusOptions"
                :searchable="true" :class="{
                  'is-invalid-option': validationStatus(
                    $v.currentData.orderStatus
                  ),
                }">
                <template slot="singleLabel" slot-scope="{ option }">
                  {{ option.text }}
                </template>
              </multiselect>
              <div v-if="!$v.currentData.orderStatus.required" class="invalid-feedback">
                Trạng thái không được để trống.
              </div>
            </b-form-group>
          </b-col>
          <b-col md="4">
            <b-form-group>
              <label>Số điện thoại <span class="text-danger">*</span>:</label>
              <b-form-input id="input-phonenumber" type="number" v-model="$v.currentData.phoneNumber.$model"
                placeholder="Nhập số điện thoại" :class="{
                  'is-invalid': validationStatus($v.currentData.phoneNumber),
                }" :disabled="disabledUpdateOrder"></b-form-input>
              <div v-if="!$v.currentData.phoneNumber.required" class="invalid-feedback">
                Số điện thoại không được để trống.
              </div>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col md="4">
            <b-form-group>
              <label>Địa chỉ <span class="text-danger">*</span>:</label>
              <b-form-input id="input-price" type="text" v-model.trim="$v.currentData.address.$model"
                placeholder="Nhập địa chỉ" :class="{
                  'is-invalid': validationStatus($v.currentData.address),
                }" :disabled="disabledUpdateOrder"></b-form-input>
              <div v-if="!$v.currentData.address.required" class="invalid-feedback">
                Địa chỉ không được để trống.
              </div>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col md="4">
            <b-form-group>
              <label>Phường/xã/huyện:</label>
              <b-form-input id="input-district" type="text" v-model.trim="currentData.district" placeholder="Nhập tên"
                :disabled="disabledUpdateOrder"></b-form-input>
            </b-form-group>
          </b-col>
          <b-col md="4">
            <b-form-group>
              <label>Quận/Thị trấn:</label>
              <b-form-input id="input-ward" type="text" v-model.trim="currentData.wards" placeholder="Nhập tên"
                :disabled="disabledUpdateOrder"></b-form-input>
            </b-form-group>
          </b-col>
          <b-col md="4">
            <b-form-group>
              <label>Thành phố:</label>
              <b-form-input id="input-city" type="text" v-model.trim="currentData.city" placeholder="Nhập tên"
                :disabled="disabledUpdateOrder"></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
        <div class="w-100">
          <b-form-group>
            <label>Ghi chú đơn hàng:</label>
            <b-form-textarea v-model="currentData.note" :disabled="disabledUpdateOrder">
            </b-form-textarea>
          </b-form-group>
        </div>
      </div>
      <div class="w-100 mb-4" v-if="currentDetailData">
        <div class="d-flex align-items-center mb-2">
          <span class="font-weight-bold">Danh sách sản phẩm</span>
          <b-button class="ml-3" variant="outline-success" @click.prevent="addNewProductForDetail"
            :disabled="disabledUpdateOrder">
            <i class="fas fa-plus"></i>
            Thêm
          </b-button>
        </div>
        <div v-for="(item, index) in currentDetailData" :key="index">
          <b-row>
            <b-col md="4">
              <b-form-group>
                <label>Sản phẩm:</label>
                <multiselect v-model="item.product" track-by="text" label="text" :show-labels="false"
                  :disabled="disabledUpdateOrder" placeholder="Chọn" :options="productOptions" :searchable="true">
                  <template slot="singleLabel" slot-scope="{ option }">
                    {{ option.text }}
                  </template>
                </multiselect>
              </b-form-group>
            </b-col>
            <b-col md="2">
              <b-form-group>
                <label>Số lượng:</label>
                <b-form-input id="input-product-quantity" v-model="item.quantity" type="number"
                  placeholder="Nhập giá tiền" :disabled="disabledUpdateOrder" @input="calculateProductPrice">
                </b-form-input>
              </b-form-group>
            </b-col>
            <b-col md="2">
              <b-form-group>
                <label>Tổng giá:</label>
                <div v-if="item.product && item.quantity">{{ getFormatPrice(item.product.sellPrice * item.quantity) }}đ</div>
              </b-form-group>
            </b-col>
            <b-col md="2">
              <b-button class="mt-4" variant="danger"
                @click.prevent="openModalDeleteOrderDetail(item.order_detail_id, index)"
                :disabled="disabledUpdateOrder">
                <i class="fas fa-trash"></i>
                Xoá
              </b-button>
            </b-col>
          </b-row>
        </div>
      </div>
      <div>
        <b-row>
          <b-col md="4">
            <b-form-group>
              <label class="font-weight-bold mr-2">Tổng giá sản phẩm:</label>
              <span>{{ getTotalProductPrice() }}đ</span>
            </b-form-group>
            <b-form-group>
              <label class="font-weight-bold mr-2">Tổng giá đơn hàng:</label>
              <span>{{ getFormatPrice(currentData.totalPrice) }}đ</span>
            </b-form-group>
          </b-col>
        </b-row>
      </div>
      <div class="text-right">
        <b-button variant="outline-danger" @click="cancelCreateOrder(false)">
          <i class="fas fa-times"></i>
          Hủy
        </b-button>
        <b-button variant="outline-secondary" @click.prevent="handleReset">
          <i class="fas fa-undo"></i>
          Hoàn tác
        </b-button>
        <b-button variant="primary" @click.prevent="handleSubmit" :disabled="disabledUpdateOrder">
          <i class="fas fa-check"></i>
          Đồng ý
        </b-button>
      </div>
    </b-card>

  </b-modal>
</template>
  
<script>
import PageTitle from "@/Layout/Components/PageTitle";
import baseMixins from "@/components/mixins/base";
import { required } from "vuelidate/lib/validators";
import { formatPriceSearchV2 } from "@/common/common";
import Vue from "vue";
import Multiselect from "vue-multiselect";
import moment from "moment-timezone";
import DatePicker from "vue2-datepicker";
import { mapGetters } from "vuex";
import "vue2-datepicker/index.css";
import "vue2-datepicker/locale/vi";
Vue.component("multiselect", Multiselect);
import { CREATE_ORDER, UPDATE_ORDER, FETCH_PROMOTIONS, FETCH_PRODUCTS_AVAILABLE, CREATE_ORDER_DETAIL, UPDATE_ORDER_DETAIL, DELETE_ORDER_DETAIL } from "@/store/action.type";

const initOrder = {
  totalPrice: null,
  note: null,
  orderStatusId: null,
  date: null,
  promotionId: 0,
  address: null,
  city: null,
  district: null,
  wards: null,
  phoneNumber: 0,
  orderId: null,
  promotion: null,
  orderStatus: { value: "1", text: 'Chờ xác nhận' },
  user: null
};

const initOrderDetail = {
  order_detail_id: null,
  order: null,
  product: null,
  productName: null,
  productPrice: null,
  quantity: null
}

export default {
  name: "ModalCreateOrder",
  components: { PageTitle, DatePicker },
  props: {
    currentTitleModal: String,
    order: Object,
    orderDetail: Array,
    isUpdate: Boolean,
  },
  data() {
    return {
      heading: "Tạo đơn hàng",
      subheading: "Tạo đơn hàng",
      userInfo: localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem("userInfo"))
        : null,
      loadingHeader: true,
      orderStatusOptions: [
        { value: "1", text: 'Chờ xác nhận' },
        { value: "2", text: 'Đã xác nhận' },
        { value: "3", text: 'Đã huỷ' },
      ],
      promotionOptions: [],
      productOptions: [],
      currentData: Object.assign({}, initOrder),
      currentDetailData: [Object.assign({}, initOrderDetail)],
    };
  },
  mixins: [baseMixins],
  validations: {
    currentData: {
      orderStatus: {
        required,
      },
      totalPrice: {
        required,
      },
      address: {
        required,
      },
      phoneNumber: {
        required
      }
    },
  },
  computed: {
    ...mapGetters(["getPromotions", "getProducts"]),
    saveCurrentData() {
      return this.order
    },
  },
  watch: {
    isUpdate(newValue, oldValue) {
      console.log(newValue)
      if (newValue) this.setCurrentUpdateDetailData()
    }
  },
  mounted() {
    if (!this.getPromotions || this.getPromotions.length === 0) {
      this.$store.dispatch(FETCH_PROMOTIONS).then(res => {
        if (res && res.status === 200 && res.data) this.getPromotionOptions(res.data.data)
      })
    } else {
      this.getPromotionOptions(this.getPromotions)
    }

    if (!this.getProducts || this.getProducts.length === 0) {
      this.$store.dispatch(FETCH_PRODUCTS_AVAILABLE).then(res => {
        if (res && res.status === 200 && res.data) this.getProductOptions(res.data.data)
      })
    } else {
      this.getProductOptions(this.getProducts)
    }
  },
  computed: {
    disabledUpdateOrder() {
      return (this.currentData && this.isUpdate && !(this.currentData.orderStatus && this.currentData.orderStatus.value === 1))
    },
  },
  methods: {
    calculateProductPrice() {
      this.currentDetailData.productPrice = this.currentDetailData && this.currentDetailData.length > 0
        ? this.currentDetailData.map(item => item.quantity * item.sellPrice).reduce((prev, current) => prev + current, 0)
        : 0

      this.currentData.totalPrice = this.currentDetailData.productPrice
    },
    setCurrentUpdateData() {
      if (!this.order) return
      let { promotion, user, orderStatus } = { ...this.order }
      this.currentData = {
        ...this.order,
        promotion: promotion ? { text: promotion.salePercent + '%', value: promotion.promotionId } : null,
        orderStatus: orderStatus ? { text: orderStatus.statusName, value: orderStatus.id } : null,
        user: user ? { text: user.username, value: user.userId } : null,
      }
    },
    setCurrentUpdateDetailData() {
      if (!this.orderDetail) return
      this.currentDetailData = this.orderDetail.map(item => {
        return {
          ...item,
          product: item.product ? { text: product.productName, value: product.productId, img: product.mainImg, sellPrice: product.sellPrice, } : null,
        }
      })
    },
    validateKeyCode: function (e) {
      if ((e.key < 48 || e.key > 57 || e.charCode === 13) && e.charCode !== 45 && e.charCode !== 32) {
        return true
      }

      e.preventDefault()
    },
    getPromotionOptions(promotions) {
      this.promotionOptions = promotions.filter(item => item.amount > 0).map(item => {
        return {
          text: item.salePercent ? item.salePercent + '%' : '',
          value: item.promotionId
        }
      })
    },
    getProductOptions(products) {
      this.productOptions = products.filter(item => item.amount > 0).map(item => {
        return {
          text: item.productName,
          value: item.productId,
          img: item.mainImg,
          sellPrice: item.sellPrice,
        }
      })
    },
    getFormatPrice(price) {
      return price ? formatPriceSearchV2(price + '') : 0
    },
    formatTotalPrice() {
      this.currentData.totalPrice = this.currentData.totalPrice !== null ? formatPriceSearchV2(this.currentData.totalPrice + '') : null
    },
    async handleCreateAndUpdateOrder() {
      let {
        totalPrice,
        note,
        date,
        address,
        city,
        district,
        wards,
        phoneNumber,
        orderStatus,
        promotion,
        user,
        orderId
      } = { ...this.currentData };

      let payload = {
        orderId,
        orderData: {
          totalPrice,
          promotionId: promotion ? promotion.value : null,
          note,
          totalPrice: totalPrice && Number((totalPrice + '').replace(',', '')),
          orderStatusId: orderStatus ? orderStatus.value : null,
          date: this.isUpdate ? date : moment(new Date()).format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
          phoneNumber: phoneNumber && Number(phoneNumber),
          address, city, district, wards,
        },
      };

      let successMsg = `${this.isUpdate ? 'Cập nhật' : 'Tạo'} đơn hàng thành công.`
      let errorMsg = `${this.isUpdate ? 'Cập nhật' : 'Tạo'} đơn hàng không thành công.`

      let payloadForDetail = {
        orderDetailId: this.currentDetailData.order_detail_id,
        orderDetailData: {
          orderId: orderId + '',
          productId: this.currentDetailData.product ? this.currentDetailData.product.value + '' : null,
          productName: this.currentDetailData.product ? this.currentDetailData.product.text : null,
          quantity: this.currentDetailData.quantity,
          productPrice: this.currentDetailData.productPrice + '',
        },
      }

      if (this.isUpdate) {
        Promise.all([
          this.$store.dispatch(UPDATE_ORDER, payload),
          this.$store.dispatch(UPDATE_ORDER_DETAIL, payloadForDetail)
        ]).then(res => {
          if (res[0].status === 200 && res[1].status === 200) {
            this.$message({
              message: successMsg,
              type: "success",
              showClose: true,
            });
            setTimeout(() => {
              this.cancelCreateOrder(true)
            }, 500)
          }
        })
      }

      if (!this.isUpdate) {
        let res = await this.$store.dispatch(CREATE_ORDER, payload.orderData)

        if (res.status === 200 && res.data && res.data.data) {
          payloadForDetail.orderDetailData.orderId = res.data.data.orderId
          let resForDetail = await this.$store.dispatch(CREATE_ORDER_DETAIL, payloadForDetail.orderDetailData)

          if (resForDetail.status === 200) {
            this.$message({
              message: successMsg,
              type: "success",
              showClose: true,
            });
            setTimeout(() => {
              this.cancelCreateOrder(true)
            }, 500)
          }
        }
      }
    },
    handleSubmit() {
      this.$v.$reset();
      this.$v.$touch();

      if (this.$v.currentData.$invalid) {
        return;
      }
      this.handleCreateAndUpdateOrder();
    },
    handleReset() {
      if (this.isUpdate) {
        this.setCurrentUpdateData()
        this.setCurrentUpdateDetailData()
      }
      if (!this.isUpdate) {
        this.currentData = Object.assign({}, initOrder)
        this.currentDetailData = [Object.assign({}, initOrderDetail)]
      }

      this.$nextTick(() => {
        this.$v.$reset();
      });
    },
    validationStatus: function (validation) {
      return typeof validation != "undefined" ? validation.$error : false;
    },
    cancelCreateOrder(isFetchOrders) {
      this.$v.$reset()
      this.$root.$emit("bv::hide::modal", "modal-create-order");
      this.$emit('cancelCreateOrder', isFetchOrders)
    },
    openModalDeleteOrderDetail(item, indexVal) {
      if (item && item.order_detail_id) {
        this.$emit('openModalDeleteOrderDetail', item.order_detail_id)
        // this.$root.$emit("bv::show::modal", "delete-order-detail");
      }
      else {
        this.currentDetailData = this.currentDetailData.filter((item, index) => index !== indexVal)
      }
    },
    addNewProductForDetail() {
      let newProduct = Object.assign({}, { ...initOrderDetail })
      this.currentDetailData.push(newProduct)
    }
  },
};
</script>

<style lang="scss" scoped>
#update-order {
  .multiselect {
    min-height: 32px !important;
  }
}

.is-invalid-option {
  border-radius: 5px;
  border: 1px solid #ff7851 !important;
}

.custom-wrapper {
  overflow-wrap: break-word;
}

.custom-banner-image {
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.2);
}

.banner-image__preview {
  width: 100%;
  height: 10rem;

  .overlay {
    width: 100%;
    height: 100%;
    display: none;
    background-color: rgba(0, 0, 0, 0.4);
  }

  &:hover .overlay {
    display: block;
    display: flex;
    justify-content: center;
    cursor: pointer;
    transition-duration: 500ms;
  }

  .banner-image__btn {
    border: none;
    outline: none;
    background-color: transparent;
    margin: 1rem;
    cursor: pointer;
    border-radius: 10px;
    color: white;
    font-size: 1.5rem;
  }
}
</style>
  
<style lang="scss">
#update-order {

  .was-validated .form-control:invalid,
  .form-control.is-invalid {
    background-image: none !important;
  }

  .invalid-date-feedback {
    display: none;
    width: 100%;
    margin-top: 0.25rem;
    font-size: 80%;
    color: #ff7851;
  }

  .invalid-editor-feedback {
    display: none;
    width: 100%;
    margin-top: 0.25rem;
    font-size: 80%;
    color: #ff7851;
  }

  .invalid-date {
    .invalid-date-feedback {
      display: block !important;
    }
  }

  .invalid-editor {
    .invalid-editor-feedback {
      display: block !important;
    }
  }
}
</style>