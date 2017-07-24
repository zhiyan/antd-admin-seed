import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {Router, Route, IndexRedirect, browserHistory} from 'react-router'

import configureStore from './store/configureStore'

import App from './views/App'
import Home from './views/Home'
import Login from './views/Login'
import Changepass from './views/Changepass'
import UserList from './views/User/list'
import UserAdd from './views/User/add'

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

            <Route path="system" breadcrumbName="系统管理">
              <IndexRedirect to="usr/list" />
              <Route path="user/list" component={UserList} breadcrumbName="用户列表"/>
              <Route path="user/add" component={UserAdd} breadcrumbName="用户添加"/>
              <Route path="user/edit/:id" component={UserAdd} breadcrumbName="用户修改"/>
            </Route>

          </Route>
          <Route path="login" component={Login}/>
        </Route>
      </Router>
  </Provider>,
  document.getElementById('root')
)
