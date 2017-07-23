import React, { PropTypes } from 'react'
import { Form, Input, Button, notification, Modal, Icon } from 'antd'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { offlineShop, getShop, editShop, addShop } from '../../actions/shop'

import './shop.scss'

class ShopResult extends React.Component {

  constructor (props) {
    super(props)
  }

  goback(){
    this.context.router.replace('/shop/edit')
  }

  render () {

    return (
      <div className="shop-result">
      <h1><Icon type="check-circle" /><span>商铺设置成功</span></h1>
        <Button size="large" onClick={this.goback.bind(this)}>返回</Button>
      </div>
    )
  }
}

ShopResult.propTypes = {
}

ShopResult.contextTypes = {
  router: PropTypes.object.isRequired
}

function mapStateToProps(state) {
  return {}
}

function mapDispatchToProps(dispatch) {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(ShopResult)
