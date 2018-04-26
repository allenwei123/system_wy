  const unitHttpUrl = {
    //配件管理
    list: '/stock/list', //分页查询配件 unit不包含库存
    add: '/unit/add', //新增配件
    edit: '/unit/edit', //修改配件
    liftList: '/elevatortype/list', //电梯种类
    brandList: '/brand/list', //品牌
    in: '/stock/in', //配件入库接口
    kindList: '/unit/list', //分页查询配件分类
    delete: '/unit/', // {id}/delete //删除配件分类
    detail: '/stock/', //{id}detail查询配件详情
    kind: '/unitType/list', //全部部件分类
    newKind: '/unitType/page', //部件分类支持分页功能 
    kindAdd: '/unitType/add', //新增部件
    kindEdit: '/unitType/edit', //修改部件
    kindDelete: '/unitType/', //{id}delete 删除部件类型
  },
  orderHttpUrl = {
    //订单
    list: '/unitOrder/list', //分页查询订单 
    add: '/unitOrder/add', //新增订单
    ship: '/unitOrder/ship', //已发货状态
    against: '/unitOrder/', //{id}/against //已取消状态
    confirm: '/unitOrder/',//已生效状态
    detail: '/unitOrder/', //{id}detail订单详情
    addressList: '/deliveryAddress/list', //分页查询收货地址

  }
    
  export {
    unitHttpUrl,
    orderHttpUrl
  };
