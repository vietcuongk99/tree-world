<template>
  <div>
    <!-- Page Preloder -->
    <!--  <div id="preloder">-->
    <!--    <div class="loader"></div>-->
    <!--  </div>-->

    <!-- Humberger Begin -->
    <Humberger />
    <!-- Humberger End -->

    <!-- Header Section Begin -->
    <UserHeader />
    <!-- Header Section End -->

    <!-- Hero Section Begin -->
    <section class="hero hero-normal">
      <div class="container">
        <div class="row">
          <div class="col-lg-3">
            <div class="hero__categories">
              <div class="hero__categories__all">
                <i class="fa fa-bars"></i>
                <span>All departments</span>
              </div>
              <ul>
                <li><a href="#">Fresh Meat</a></li>
                <li><a href="#">Vegetables</a></li>
                <li><a href="#">Fruit & Nut Gifts</a></li>
                <li><a href="#">Fresh Berries</a></li>
                <li><a href="#">Ocean Foods</a></li>
                <li><a href="#">Butter & Eggs</a></li>
                <li><a href="#">Fastfood</a></li>
                <li><a href="#">Fresh Onion</a></li>
                <li><a href="#">Papayaya & Crisps</a></li>
                <li><a href="#">Oatmeal</a></li>
                <li><a href="#">Fresh Bananas</a></li>
              </ul>
            </div>
          </div>
          <div class="col-lg-9">
            <div class="hero__search">
              <div class="hero__search__form">
                <form action="#">
                  <div class="hero__search__categories">
                    All Categories
                    <span class="arrow_carrot-down"></span>
                  </div>
                  <input type="text" placeholder="What do yo u need?" />
                  <button type="submit" class="site-btn">SEARCH</button>
                </form>
              </div>
              <div class="hero__search__phone">
                <div class="hero__search__phone__icon">
                  <i class="fa fa-phone"></i>
                </div>
                <div class="hero__search__phone__text">
                  <h5>+65 11.188.888</h5>
                  <span>support 24/7 time</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- Hero Section End -->

    <!-- Breadcrumb Section Begin -->
    <!-- Breadcrumb Section End -->

    <!-- Checkout Section Begin -->
    <section class="checkout spad">
      <div class="container">
        <div class="checkout__form">
          <h4>Th??ng tin ????n h??ng</h4>
          <div class="row">
            <div class="col-lg-8 col-md-6">
              <div
                class="checkout__input"
                :class="{
                  'invalid-input': validationStatus($v.currentData.address),
                }"
              >
                <p>?????a ch???<span>*</span></p>
                <input
                  type="text"
                  placeholder="Nh???p ?????a ch???"
                  v-model.trim="$v.currentData.address.$model"
                  :class="{
                    'is-invalid': validationStatus($v.currentData.address),
                  }"
                />
                <div
                  v-if="!$v.currentData.address.required"
                  class="invalid-feedback"
                >
                  ?????a ch??? kh??ng ???????c ????? tr???ng.
                </div>
              </div>
              <div
                class="checkout__input"
                :class="{
                  'invalid-input': validationStatus($v.currentData.city),
                }"
              >
                <p>Th??nh ph???<span>*</span></p>
                <input
                  type="text"
                  placeholder="Nh???p t??n th??nh ph???"
                  v-model.trim="$v.currentData.city.$model"
                  :class="{
                    'is-invalid': validationStatus($v.currentData.city),
                  }"
                />
                <div
                  v-if="!$v.currentData.city.required"
                  class="invalid-feedback"
                >
                  Th??nh ph??? kh??ng ???????c ????? tr???ng.
                </div>
              </div>
              <div
                class="checkout__input"
                :class="{
                  'invalid-input': validationStatus($v.currentData.district),
                }"
              >
                <p>Ph?????ng/x??/huy???n<span>*</span></p>
                <input
                  type="text"
                  placeholder="Nh???p t??n"
                  v-model.trim="$v.currentData.district.$model"
                  :class="{
                    'is-invalid': validationStatus($v.currentData.district),
                  }"
                />
                <div
                  v-if="!$v.currentData.district.required"
                  class="invalid-feedback"
                >
                  Ph?????ng/x??/huy???n kh??ng ???????c ????? tr???ng.
                </div>
              </div>
              <div
                class="checkout__input"
                :class="{
                  'invalid-input': validationStatus($v.currentData.wards),
                }"
              >
                <p>Qu???n/Th??? tr???n<span>*</span></p>
                <input
                  type="text"
                  placeholder="Nh???p t??n"
                  v-model.trim="$v.currentData.wards.$model"
                  :class="{
                    'is-invalid': validationStatus($v.currentData.wards),
                  }"
                />
                <div
                  v-if="!$v.currentData.wards.required"
                  class="invalid-feedback"
                >
                  Qu???n/Th??? tr???n kh??ng ???????c ????? tr???ng.
                </div>
              </div>
              <div class="row">
                <div class="col-lg-6">
                  <div
                    class="checkout__input"
                    :class="{
                      'invalid-input': validationStatus(
                        $v.currentData.phoneNumber
                      ),
                    }"
                  >
                    <p>S??? ??i???n tho???i<span>*</span></p>
                    <input
                      type="number"
                      placeholder="Nh???p s??? ??i???n tho???i"
                      v-model="$v.currentData.phoneNumber.$model"
                      :class="{
                        'is-invalid': validationStatus(
                          $v.currentData.phoneNumber
                        ),
                      }"
                    />
                    <div
                      v-if="!$v.currentData.phoneNumber.required"
                      class="invalid-feedback"
                    >
                      S??? ??i???n tho???i kh??ng ???????c ????? tr???ng.
                    </div>
                    <div
                      v-if="!$v.currentData.phoneNumber.validPhoneNumber"
                      class="invalid-feedback"
                    >
                      S??? ??i???n tho???i kh??ng h???p l???.
                    </div>
                  </div>
                </div>
              </div>
              <div class="checkout__input">
                <p>Ghi ch??</p>
                <input
                  type="text"
                  v-model="currentData.note"
                  placeholder="Nh???p ghi ch?? c???a b???n cho shop ho???c ????n v??? v???n chuy???n."
                />
              </div>
            </div>
            <div class="col-lg-4 col-md-6">
              <div class="checkout__order">
                <h4>????n h??ng c???a b???n</h4>
                <div class="checkout__order__products">
                  S???n ph???m <span>Gi??</span>
                </div>
                <ul v-for="(item, index) in listCart" :key="index">
                  <li>
                    {{ item.product.productName }} x
                    {{ item.quantity }}
                    <span>{{
                      formatPrice(item.product.sellPrice * item.quantity)
                    }}</span>
                  </li>
                </ul>
                <div class="checkout__order__subtotal">
                  Gi?? <span>{{ formatPrice(subPrice) }}??</span>
                </div>
                <div class="checkout__order__total">
                  T???ng gi?? ????n h??ng <span>{{ formatPrice(totalPrice) }}??</span>
                </div>
                <button
                  class="site-btn"
                  @click="handleSubmit"
                  style="cursor:pointer"
                >
                  PLACE ORDER
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- Checkout Section End -->

    <!-- Footer Section Begin -->
    <UserFooter />
    <!-- Footer Section End -->
    <modalPayment :total-price="totalPrice" />
  </div>
</template>

<script>
import { handleJQuery } from "../common/utils";
import baseMixins from "../components/mixins/base";
import { formatPriceSearchV2 } from "@/common/common";
import {
  CREATE_ORDER,
  CREATE_ORDER_DETAIL,
  CREATE_ORDER_DETAIL_BY_ORDER_ID,
} from "@/store/action.type";
import { required, helpers } from "vuelidate/lib/validators";
import UserHeader from "../Layout/Components/UserHeader";
import UserFooter from "../Layout/Components/UserFooter";
import Humberger from "../Layout/Components/Humberger";
import moment from "moment";
import modalPayment from "../Layout/Components/PaymentInfo.vue";

const DEFAULT_PROMOTION_ID = 3;
const ORDER_STATUS_ID = 1;
const initOrder = {
  totalPrice: 0,
  note: null,
  orderStatusId: ORDER_STATUS_ID,
  date: null,
  promotionId: DEFAULT_PROMOTION_ID,
  address: null,
  city: null,
  district: null,
  wards: null,
  phoneNumber: 0,
};
const initOrderDetail = {
  order_detail_id: null,
  order: null,
  product: null,
  productName: null,
  productPrice: 0,
  quantity: 1,
};
const validPhoneNumber = helpers.regex(
  "validPhoneNumber",
  /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/
);

export default {
  name: "check-out",
  mixins: [baseMixins],
  components: { UserHeader, modalPayment, Humberger, UserFooter },
  data() {
    return {
      listCart: [],
      currentData: Object.assign({}, initOrder),
    };
  },
  validations: {
    currentData: {
      address: {
        required,
      },
      city: {
        required,
      },
      district: {
        required,
      },
      wards: {
        required,
      },
      phoneNumber: {
        required,
        validPhoneNumber,
      },
    },
  },
  mounted() {
    handleJQuery();
    this.getListCart();
  },
  computed: {
    totalPrice() {
      return this.listCart && this.listCart.length > 0
        ? this.listCart
            .map((cart) => cart.quantity * cart.product.sellPrice)
            .reduce((prev, current) => prev + current, 0)
        : 0;
    },
    subPrice() {
      return this.listCart && this.listCart.length > 0
        ? this.listCart
            .map((cart) => cart.quantity * cart.product.sellPrice)
            .reduce((prev, current) => prev + current, 0)
        : 0;
    },
  },
  methods: {
    formatPrice(price) {
      if (!price) return 0;
      return formatPriceSearchV2(price + "");
    },
    async getListCart() {
      const res = await this.getWithBigInt("/rest/carts");
      if (res && res.data && res.data.data) {
        this.listCart = res.data.data;
      }
    },
    async handleCreateOrder() {
      let successMsg = `T???o ????n h??ng th??nh c??ng.`;
      let errorMsg = `T???o ????n h??ng kh??ng th??nh c??ng.`;
      let outofProd = `S???n ph???m b???n ?????t hi???n t???i ???? h???t!`;
      let {
        note,
        address,
        city,
        district,
        wards,
        phoneNumber,
        orderStatusId,
        promotionId,
      } = { ...this.currentData };
      let payload = {
        totalPrice: this.totalPrice,
        promotionId,
        note: note ? note.trim() : null,
        orderStatusId,
        date: moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
        phoneNumber: phoneNumber && Number(phoneNumber),
        address,
        city,
        district,
        wards,
      };
      let payloadForCreateDetail = this.listCart.map((item) => {
        return {
          productId: item.product ? item.product.productId + "" : null,
          productName: item.product ? item.product.productName : null,
          quantity: item.quantity,
          productPrice:
            (item.product && item.quantity
              ? item.product.sellPrice * item.quantity
              : 0) + "",
        };
      });

      let res = await this.$store.dispatch(CREATE_ORDER, payload);
      console.log(res);
      if (res.status === 200 && res.data && res.data.data) {
        let newOrderId = res.data.data.orderId;
        payloadForCreateDetail = payloadForCreateDetail.map((item) => {
          return {
            ...item,
            orderId: newOrderId,
          };
        });
        let resForDetail = await this.$store.dispatch(
          CREATE_ORDER_DETAIL_BY_ORDER_ID,
          payloadForCreateDetail
        );
        if (resForDetail.status == 200) {
          this.$message({
            message: successMsg,
            type: "success",
            showClose: true,
          });
        }
      }
      if (res.data.status == "not ok") {
        this.$message({
          message: outofProd,
          type: "error",
          showClose: true,
        });
      }
      // this.$root.$emit("bv::show::modal", "modal-payment");
    },
    handleSubmit() {
      this.$v.$reset();
      this.$v.$touch();
      if (this.$v.currentData.$invalid) {
        return;
      }
      this.handleCreateOrder();
    },
    validationStatus: function(validation) {
      return typeof validation != "undefined" ? validation.$error : false;
    },
  },
};
</script>

<style scoped>
.is-invalid {
  border-color: #dc3545;
  /* box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25); */
}

.invalid-feedback {
  display: none;
  width: 100%;
  margin-top: 0.25rem;
  font-size: 80%;
  color: #ff7851;
}

.invalid-input .invalid-feedback {
  display: block !important;
}
</style>
