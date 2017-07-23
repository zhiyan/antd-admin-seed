import React from 'react'
import { Row, Col, Icon, Menu, Dropdown } from 'antd'
import './index.scss'
import { Link } from 'react-router'
import { removeCookie, getCookie } from '../../utils/index'

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

export default class Header extends React.Component {
  constructor () {
    super()
  }

  handleClick (item) {
    if(item.key === 'logout'){
      removeCookie('uid')
      window.location.href = '/login'
    }
  }

  render () {
    const {user} = this.props
    const account = decodeURI(getCookie('account'))
    const logoinfo = decodeURI(getCookie('logo_text'))

    return (
      <div className='ant-layout-header'>
        <div className="header-title"> {logoinfo || 'MyPure健康信息管理平台'} </div>
        <Menu className="header-menu" onClick={this.handleClick}
        mode="horizontal">
          <SubMenu title={<span><Icon type="user" />欢迎, {account || 'Anonymous'}</span>}>
            <Menu.Item key="changepass"><Link to="/changepass">修改密码</Link></Menu.Item>
            <Menu.Divider />
            <Menu.Item key="logout">注销</Menu.Item>
          </SubMenu>
        </Menu>
      </div>
    )
  }
}
