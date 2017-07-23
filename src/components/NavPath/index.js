import React, {PropTypes} from 'react'
import { bindActionCreators } from 'redux'
import { Breadcrumb } from 'antd'
import { connect } from 'react-redux'
import { Link } from 'react-router'

import './index.scss'

const defaultProps = {
}

const propTypes = {
}

class NavPath extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      exportType: ''
    }
  }

  transferLink(href, name, paths){
     return ( <Link to={href}>{name}</Link> )
  }

  render () {
    // <Breadcrumb {...this.props} separator=">" linkRender={this.transferLink}/>
    const name = this.props.routes[this.props.routes.length-1].breadcrumbName
    return (
      <div className="ant-layout-breadcrumb">
        <h1>{name}</h1>
      </div>
    )
  }
}

NavPath.propTypes = propTypes;
NavPath.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
  }
}

export default connect(mapStateToProps)(NavPath)
