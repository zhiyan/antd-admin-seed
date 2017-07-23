import React from 'react'
import { Button } from 'antd'

import './index.scss'

export default class Modal extends React.Component {
  constructor () {
    super()
  }

  render () {
    return (
      this.props.visible ? <div className="page-modal-container"><div className="page-modal">
      <header>{this.props.title}<i onClick={this.props.close}>X</i></header>
        <div className="page-modal-content">
          {this.props.children}
        </div>
        <footer>
          <Button type="primary" onClick={this.props.close}>关闭</Button>
        </footer>
        </div><div className="page-modal-mask"></div></div> : <div></div>
    )
  }
}
