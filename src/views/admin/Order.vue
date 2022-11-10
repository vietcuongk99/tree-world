<template>
    <div>
      <page-title :heading="heading" :subheading="subheading" :icon="icon" :loading="loadingHeader"></page-title>
      <b-card class="main-card">
        <template v-if="loadingHeader">
          <a-skeleton active :paragraph="{ rows: 5 }"></a-skeleton>
        </template>
        <template v-else>
          <div class="text-right">
            <b-button variant="info" class="mb-4" @click="navigateToCreateOrder()" style="max-width: 200px">
              <i class="fas fa-edit"></i> Thêm đơn hàng
            </b-button>
          </div>
          <b-table :items="getOrders" :fields="visibleFields" :bordered="true" :hover="true" :fixed="true"
            :per-page="dataFilter.limit" :current-page="dataFilter.page" :foot-clone="false">
            <template #cell(key)="row">
              {{ dataFilter.limit * (dataFilter.page - 1) + row.index + 1 }}
            </template>
            <template #cell(user)="row">
              {{ row.item.user ? row.item.user.username : '' }}
            </template>
            <template #cell(date)="row">
              {{ formatDateTime(row.item.date) }}
            </template>
            <template #cell(totalPrice)="row">
              {{ formatPrice(row.item.totalPrice) }}
            </template>
            <template #cell(orderStatus)="row">
              <div v-if="row.item.orderStatus" class="d-flex justify-content-center">
                <b-badge
                  v-if="row.item.orderStatus.id === 1"
                  class="badge-process custom-badge-label"
                  >{{ row.item.orderStatus.statusName }}</b-badge
                >
                <b-badge
                  v-if="row.item.orderStatus.id === 2"
                  class="badge-success custom-badge-label"
                  >{{ row.item.orderStatus.statusName }}</b-badge
                >
                <b-badge
                  v-else-if="row.item.orderStatus.id === 3"
                  class="badge-inactive custom-badge-label"
                  >{{ row.item.orderStatus.statusName }}</b-badge
                >
              </div>
            </template>
            <template #cell(promotion)="row">
              {{ row.item.promotion ? row.item.promotion.salePercent + ' %' : 'Không áp dụng' }}
            </template>
            <template #cell(place)="row">
              {{ getUserPlace(row.item) }}
            </template>
            <template #cell(actions)="row">
              <div class="d-flex justify-content-center">
                <div class="px-3">
                  <a href="javascript:void(0)" type="button" v-b-tooltip.hover title="Cập nhật"
                    @click.prevent="navigateToUpdateOrder(row.item)">
                    <i class="fas fa-edit" style="font-size: 1.1rem"></i>
                  </a>
                </div>
                <div class="px-3">
                  <a href="javascript:void(0)" type="button" v-b-tooltip.hover title="Xoá đơn hàng"
                    @click.prevent="openModalDeleteOrder(row.item)">
                    <i class="fas fa-times" style="font-size: 1.1rem; color: red"></i>
                  </a>
                </div>
              </div>
            </template>
          </b-table>
  
          <b-row v-if="getOrders && getOrders.length > 0">
            <b-col class="pagination">
              <b-pagination v-model="dataFilter.page" :per-page="dataFilter.limit" :total-rows="getOrders.length"
                @change="changePage"></b-pagination>
            </b-col>
            <b-col class="mt-1">
              <span class="text-muted">
                {{ fromPage }} đến {{ toPage }} trên {{ getOrders.length }} bản ghi
              </span>
            </b-col>
          </b-row>
          <b-row v-else class="justify-content-center">
            <span>Không tìm thấy bản ghi nào</span>
          </b-row>
        </template>
      </b-card>
  
      <b-modal hide-footer id="delete-order" :title="'Xác nhận xoá đơn hàng'" :no-close-on-backdrop="true">
        <div class="pb-3">
          Bạn có muốn xoá đơn hàng <span class="font-weight-bold" v-if="this.currentOrder">{{
              this.currentOrder.orderId
          }}</span> không ?
        </div>
        <b-button class="mr-2 btn-light2 pull-right" @click="cancelDeleteOrder">
          Hủy
        </b-button>
        <b-button variant="primary pull-right" class="mr-2" type="submit" @click="handleDeleteOrder">
          Đồng ý
        </b-button>
      </b-modal>
    </div>
  </template>
      
  <script>
  import PageTitle from "../../Layout/Components/PageTitle";
  import baseMixins from "../../components/mixins/base";
  import { required } from "vuelidate/lib/validators";
  import { mapGetters } from "vuex";
  import router from '@/router';
  import { formatDateTime } from "../../common/utils"
  import { FETCH_ORDERS, DELETE_ORDER } from "@/store/action.type";
import { formatPriceSearchV2 } from "../../common/common";
  
  const initDataFilter = {
    page: 1,
    limit: 10
  };
  
  export default {
    name: "OrderManagement",
    data() {
      return {
        subheading: "Tạo và quản lý các đơn hàng",
        icon: "pe-7s-portfolio icon-gradient bg-happy-itmeo",
        heading: "Quản lý đơn hàng",
        loadingHeader: true,
        dataFilter: Object.assign({}, { ...initDataFilter }),
        userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null,
        currentOrder: null,
        orderStatusOption: [
          { value: "1", text: 'Chờ xác nhận' },
          { value: "2", text: 'Đã xác nhận' },
          { value: "3", text: 'Đã huỷ' },
        ],
        fields: [
          { key: "key", label: "STT", tdClass: 'align-middle', thClass: 'align-middle', visible: true, thStyle: { width: '4%' } },
          { key: "user", label: "Người tạo đơn", visible: true, thStyle: { width: '8%' }, thClass: 'text-left align-middle' },
          { key: "place", label: "Địa chỉ", visible: true, thStyle: { width: '15%' }, thClass: 'text-left align-middle' },
          { key: "phoneNumber", label: "Số điện thoại", visible: true, thStyle: { width: '6%' }, thClass: 'text-left align-middle' },
          { key: "totalPrice", label: "Tổng giá", visible: true, thStyle: { width: '8%' }, thClass: 'text-left align-middle' },
          { key: "promotion", label: "Khuyến mại", visible: true, thStyle: { width: '6%' }, thClass: 'text-center align-middle', tdClass: 'text-center' },
          { key: "orderStatus", label: "Trạng thái", visible: true, thStyle: { width: '8%' }, thClass: 'text-center align-middle', tdClass: 'text-center' },
          { key: "date", label: "Ngày tạo", visible: true, thStyle: { width: '8%' }, thClass: 'text-left align-middle' },
          {
            key: "actions",
            label: "Chức năng",
            visible: true,
            thStyle: { width: '5%' },
            thClass: 'text-center align-middle'
          }
        ],
      };
    },
    mixins: [baseMixins],
    components: {
      PageTitle,
    },
    mounted() {
      this.fetchOrders()
    },
    computed: {
      ...mapGetters(["getOrders"]),
      visibleFields() {
        return this.fields.filter(field => field.visible)
      },
      fromPage() {
        return (this.dataFilter.page - 1) * this.dataFilter.limit + 1;
      },
      toPage() {
        return this.getOrders.length
          ? this.dataFilter.page * this.dataFilter.limit >= this.getOrders.length
            ? this.getOrders.length
            : this.dataFilter.page * this.dataFilter.limit
          : 0;
      },
    },
    methods: {
      getUserPlace(order) {
        if (!order) return ''

        return [order.address, order.wards, order.district, order.city]
          .map(item => { 
            if (!item || item === '') return
            return item
          })
          .filter(item => item)
          .join(', ')
      },
      formatDateTime(date) {
        if (!date) return ''
        return formatDateTime(new Date(date))
      },  
      formatPrice(price) {
        if (!price) return ''
        return formatPriceSearchV2(price + '')
      },
      changePage(e) {
        this.dataFilter.page = e
      },
      async fetchOrders() {
        let response = await this.$store.dispatch(FETCH_ORDERS);
        if (response) {
          setTimeout(() => {
            if (this.loadingHeader) this.loadingHeader = !this.loadingHeader
          }, 200)
        }
  
        if (response && response.data) this.$store.commit("setOrders", response.data.data);
      },
      navigateToUpdateOrder(order) {
        if (!order.orderId) return
        this.$router.push({
          path: `/admin/order/update/${order.orderId}`
        })
      },
      navigateToCreateOrder() {
        this.$router.push({
          path: `/admin/order/create`
        })
      },
      openModalDeleteOrder(order) {
        this.$root.$emit("bv::show::modal", "delete-order");
        this.currentOrder = { ...order }
      },
      cancelDeleteOrder() {
        this.currentOrder = null
        this.$root.$emit("bv::hide::modal", "delete-order");
      },
      async handleDeleteOrder() {
        if (!this.currentOrder || !this.currentOrder.orderId) {
          this.$message.closeAll()
          this.$message({
            message: "Xoá đơn hàng không thành công.",
            type: "error",
            showClose: true,
          });
          return
        }
        let res = await this.$store.dispatch(DELETE_ORDER, this.currentOrder.orderId)
        if (res && res.status === 200) {
          this.$message.closeAll()
          this.$message({
            message: "Xoá đơn hàng thành công.",
            type: "success",
            showClose: true,
          });
          this.fetchOrders();
          this.cancelDeleteOrder()
        }
      },
    },
  };
  </script>
      
  <style scoped>
  
  </style>