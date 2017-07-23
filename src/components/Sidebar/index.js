import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Menu, Icon } from 'antd'
import { Link } from 'react-router'
import { getAllMenu, updateNavPath } from '../../actions/menu'

const SubMenu = Menu.SubMenu

import './index.scss'

const defaultProps = {
  items: [],
  currentIndex: 1
}

const propTypes = {
  items: PropTypes.array,
  currentIndex: PropTypes.number
}

class Sidebar extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      openKeys:[],
      current: ''
    }
  }

  componentDidMount () {
    this.props.getAllMenu()
  }

  componentWillReceiveProps(props){
    const routes = window.location.pathname.substring(1).split('/')
    const baseRoute = routes.shift()
    const subRoute = routes.join('/')
    props.items.forEach((item) => {
      if(item.path === baseRoute){
        item.child && item.child.forEach(sub => {
          if(sub.path === subRoute){
            this.setState({
              current: 'menu'+sub.key,
              openKeys: ['sub'+item.key]
            })
          }
        })
      }
    })
  }

  openHandler(item){
    this.setState({
      openKeys: [item.key]
    })
  }

  clickHandler(item){
    this.setState({
      current: item.key
    })
  }

  render () {
    const { items } = this.props
    let openKey = []
    const menu = items.map((item) => {
      return item.key === 0 ? (
        <Menu.Item key={'menu'+item.key}><Link to={item.path}><Icon type={item.icon} />{item.name}</Link></Menu.Item>
      ) : 
      (
        <SubMenu
          key={'sub'+item.key}
          title={<span><Icon type={item.icon} />{item.name}</span>}
        >
          {item.child.map((node) => {
            return (
            <Menu.Item key={'menu'+node.key}><Link to={'/'+item.path+'/'+node.path}>{node.name}</Link></Menu.Item>
            )
          })}
        </SubMenu>
      )
    });
    return (
      <aside className="ant-layout-sider">
        <Menu
          mode="inline" 
          theme="light" 
          openKeys={this.state.openKeys}
          onOpen={this.openHandler.bind(this)}
          onClick={this.clickHandler.bind(this)}
          selectedKeys={[this.state.current]}>
          {menu}
        </Menu>
      </aside>
    )
  }
}

Sidebar.propTypes = propTypes;
Sidebar.defaultProps = defaultProps;

Sidebar.contextTypes = {
  router: PropTypes.object.isRequired
}

function mapStateToProps(state) {

  return {
    items: state.menu.items,
    currentIndex: state.menu.currentIndex
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getAllMenu: bindActionCreators(getAllMenu, dispatch),
    updateNavPath: bindActionCreators(updateNavPath, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar)
