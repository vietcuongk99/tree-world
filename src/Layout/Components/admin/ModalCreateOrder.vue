<template>
  <b-modal size="lg" hide-footer id="modal-create-order" :title="currentTitleModal" :no-close-on-backdrop="true"
    @hide="cancelCreateOrder(false)">
    <b-card id="update-order" class="main-card search-wrapper mb-20">
      <div>
        <b-row>
          <b-col md="4">
            <b-form-group>
              <label>Tổng giá <span class="text-danger">*</span>:</label>
              <b-form-input id="input-price" @keypress="validateKeyCode" @keyup="formatTotalPrice" type="text"
                v-model.trim="$v.currentData.totalPrice.$model" placeholder="Nhập giá tiền" :class="{
                  'is-invalid': validationStatus($v.currentData.totalPrice),
                }" :disabled="disabledUpdateOrder"></b-form-input>
              <div v-if="!$v.currentData.totalPrice.required" class="invalid-feedback">
                Giá đơn hàng không được để trống.
              </div>
            </b-form-group>
          </b-col>
        </b-row>

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
                :disabled="disabledUpdateOrder" placeholder="Chọn" :options="orderStatusOptions" :searchable="true"
                :class="{
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
      </div>
      <div class="w-100">
        <b-form-group>
          <label>Ghi chú đơn hàng:</label>
          <b-form-textarea v-model="currentData.note" :disabled="disabledUpdateOrder">
          </b-form-textarea>
        </b-form-group>
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
import { CREATE_ORDER, UPDATE_ORDER, FETCH_PROMOTIONS } from "@/store/action.type";

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
  orderStatus: null,
  user: null
};

export default {
  name: "ModalCreateOrder",
  components: { PageTitle, DatePicker },
  props: {
    currentTitleModal: String,
    order: Object,
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
      currentData: Object.assign({}, initOrder)
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
    ...mapGetters(["getPromotions"]),
    saveCurrentData() {
      return this.order
    },
  },
  watch: {
    isUpdate(newValue, oldValue) {
      if (newValue) this.setCurrentUpdateData()
      if (!newValue) this.currentData = Object.assign({}, initOrder)
    }
  },
  mounted() {
    if (!this.getPromotions || this.getPromotions.length === 0) {
      this.$store.dispatch(FETCH_PROMOTIONS).then(res => {
        if (res && res.status === 200 && res.data) {
          this.promotionOptions = res.data.data.filter(item => item.amount > 0).map(item => {
            return {
              text: item.salePercent ? item.salePercent + '%' : '',
              value: item.promotionId
            }
          })
        }
      })
    } else {
      this.promotionOptions = this.getPromotions.filter(item => item.amount > 0).map(item => {
        return {
          text: item.salePercent ? item.salePercent + '%' : '',
          value: item.promotionId
        }
      })
    }
  },
  computed: {
    disabledUpdateOrder() {
      return this.currentData && this.isUpdate && !(this.currentData.orderStatus && this.currentData.orderStatus.value === 1)
    }
  },
  methods: {
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
    validateKeyCode: function (e) {
      if ((e.key < 48 || e.key > 57 || e.charCode === 13) && e.charCode !== 45 && e.charCode !== 32) {
        return true
      }

      e.preventDefault()
    },
    formatTotalPrice() {
      this.currentData.totalPrice = this.currentData.totalPrice !== null ? formatPriceSearchV2(this.currentData.totalPrice + '') : null
    },
    handleCreateAndUpdateOrder() {
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
          date,
          phoneNumber: phoneNumber && Number(phoneNumber),
          address, city, district, wards,
        },
      };

      if (!this.isUpdate) payload.orderData.date = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss.SSSZ')

      this.$store.dispatch(this.isUpdate ? UPDATE_ORDER : CREATE_ORDER, this.isUpdate ? payload : payload.orderData).then((res) => {
        if (!res) return

        let successMsg = `${this.isUpdate ? 'Cập nhật' : 'Tạo'} đơn hàng thành công.`
        let errorMsg = `${this.isUpdate ? 'Cập nhật' : 'Tạo'} đơn hàng không thành công.`
        if (res.status === 200) {
          this.$message({
            message: successMsg,
            type: "success",
            showClose: true,
          });
          setTimeout(() => {
            this.cancelCreateOrder(true)
          }, 500)
        }
        if (res.status !== 200) {
          this.$message({
            message: errorMsg,
            type: "error",
            showClose: true,
          });
        }
      });
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
      if (this.isUpdate) this.setCurrentUpdateData()
      if (!this.isUpdate) this.currentData = Object.assign({}, initOrder)

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