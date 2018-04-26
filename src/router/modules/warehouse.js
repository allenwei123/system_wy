const path = [
  //配件管理
  {
    name: 'unit',
	path: '/unit',
	props: true, 
    component: () =>
      import ( /*webpackChunkName:"unitList"*/ "@/page/home/warehousemangement/unit/list"),
    children: [
      //配件管理
      {
        name: 'unitAdd',
        path: '/unit/add',
        component: () =>
          import ('@/page/home/warehousemangement/unit/add')
      },
      //配件分类
      {
        name: 'accessories',
        path: '/unit/accessories',
        component: () =>
          import ('@/page/home/warehousemangement/unit/accessories')
      },
      //配件详情
      {
        name: 'unitDetail',
        path: '/unit/detail',
        component: () =>
          import ('@/page/home/warehousemangement/unit/detail')
      }
    ]
  },

  //订单中心
  {
    name: 'order',
    path: '/order',
    component: () =>
      import ( /*webpackChunkName:"orderList"*/ "@/page/home/warehousemangement/order/list"),
    children: [
      //新增订单
      {
        name: 'orderAdd',
        path: '/order/add',
        component: () =>
          import ('@/page/home/warehousemangement/order/add')
	  },
	  //确认订单
      {
        name: 'orderConfirm',
        path: '/order/confirm',
        component: () =>
          import ('@/page/home/warehousemangement/order/confirm')
	  },
	  //订单详情
      {
        name: 'orderDetail',
        path: '/order/detail',
        component: () =>
          import ('@/page/home/warehousemangement/order/detail')
	  },
    ]
  }
]
export default path
