import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {Router, Route, IndexRedirect, browserHistory} from 'react-router'

import configureStore from './store/configureStore'

import App from './views/App'
import Home from './views/Home'
import Login from './views/Login'
import Changepass from './views/Changepass'
import ConsumerList from './views/Consumer/list'
import MemberList from './views/Member/list'
import MemberAdd from './views/Member/add'
import UserList from './views/User/list'
import UserAdd from './views/User/add'
import ContentList from './views/Content/list'
import ContentAdd from './views/Content/add'
import LogList from './views/Log/list'
import UpkeepList from './views/Upkeep/list'
import UpkeepAdd from './views/Upkeep/add'
import ShopEdit from './views/Shop/edit'
import ShopResult from './views/Shop/result.js'
import RentList from './views/Rent/list'
import RentAdd from './views/Rent/add'
import ProductList from './views/Product/list'
import ProductAdd from './views/Product/add'
import EquipList from './views/Equip/list'
import EquipAdd from './views/Equip/add'
import OrderList from './views/Order/list'
import OrderAdd from './views/Order/add'

import {getCookie} from './utils'

const store = configureStore()

const validate = function (next, replace, callback) {
  const isLoggedIn = !!getCookie('uid')
  if (!isLoggedIn && next.location.pathname != '/login') {
    replace('/login')
  }
  callback()
}

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
        <Route path="/" onEnter={validate} breadcrumbName="首页">
          <IndexRedirect to="home" />
          <Route component={App}>
            <Route path="home" component={Home} breadcrumbName="数据概览"/>
            <Route path="changepass" component={Changepass} breadcrumbName="更改密码"/>

            <Route path="product" breadcrumbName="租赁定价管理">
              <IndexRedirect to="list" />
              <Route path="list" component={ProductList} breadcrumbName="定价列表"/>
              <Route path="add" component={ProductAdd} breadcrumbName="定价添加"/>
              <Route path="edit/:id" component={ProductAdd} breadcrumbName="定价修改"/>
            </Route>

            <Route path="member" breadcrumbName="公司账号管理">
              <IndexRedirect to="list" />
              <Route path="list" component={MemberList} breadcrumbName="账号列表"/>
              <Route path="add" component={MemberAdd} breadcrumbName="账号添加"/>
              <Route path="edit/:id" component={MemberAdd} breadcrumbName="账号修改"/>
            </Route>

            <Route path="consumer" breadcrumbName="客户信息管理">
              <IndexRedirect to="list" />
              <Route path="list" component={ConsumerList} breadcrumbName="客户信息列表"/>
            </Route>

            <Route path="content" breadcrumbName="资讯信息管理">
              <IndexRedirect to="list" />
              <Route path="list" component={ContentList} breadcrumbName="资讯列表"/>
              <Route path="add" component={ContentAdd} breadcrumbName="资讯添加"/>
              <Route path="edit/:id" component={ContentAdd} breadcrumbName="资讯修改"/>
            </Route>

            <Route path="upkeep" breadcrumbName="维修工单管理">
              <IndexRedirect to="list" />
              <Route path="list" component={UpkeepList} breadcrumbName="工单列表"/>
              <Route path="add" component={UpkeepAdd} breadcrumbName="工单添加"/>
              <Route path="edit/:id" component={UpkeepAdd} breadcrumbName="工单修改"/>
            </Route>

            <Route path="shop" breadcrumbName="商铺管理">
              <IndexRedirect to="edit" />
              <Route path="edit" component={ShopEdit} breadcrumbName="商铺修改"/>
              <Route path="success" component={ShopResult} breadcrumbName="商铺设置成功"/>
            </Route>

            <Route path="system" breadcrumbName="系统用户管理">
              <IndexRedirect to="log" />
              <Route path="log" component={LogList} breadcrumbName="日志管理"/>
              <Route path="user/list" component={UserList} breadcrumbName="用户列表"/>
              <Route path="user/add" component={UserAdd} breadcrumbName="用户添加"/>
              <Route path="user/edit/:id" component={UserAdd} breadcrumbName="用户修改"/>
            </Route>

            <Route path="rent" breadcrumbName="销售订单管理">
              <IndexRedirect to="list" />
              <Route path="list" component={RentList} breadcrumbName="销售订单列表"/>
              <Route path="add" component={RentAdd} breadcrumbName="销售订单添加"/>
              <Route path="edit/:id" component={RentAdd} breadcrumbName="销售订单修改"/>
            </Route>

            <Route path="order" breadcrumbName="缴费订单管理">
              <IndexRedirect to="list" />
              <Route path="list" component={OrderList} breadcrumbName="缴费订单列表"/>
              <Route path="add" component={OrderAdd} breadcrumbName="缴费订单添加"/>
              <Route path="add/:eid" component={OrderAdd} breadcrumbName="缴费订单添加"/>
            </Route>

            <Route path="equip" breadcrumbName="设备品牌管理">
              <IndexRedirect to="add" />
              <Route path="add" component={EquipAdd} breadcrumbName="设备品牌添加"/>
              <Route path="list" component={EquipList} breadcrumbName="设备品牌列表"/>
              <Route path="edit/:id" component={EquipAdd} breadcrumbName="设备品牌修改"/>
            </Route>

          </Route>
          <Route path="login" component={Login}/>
        </Route>
      </Router>
  </Provider>,
  document.getElementById('root')
)
