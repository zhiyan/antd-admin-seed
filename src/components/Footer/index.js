import React from 'react'

import './index.scss'

export default class Footer extends React.Component {
  constructor () {
    super()
  }

  render () {

    return (
      <div className="ant-layout-footer">
      &copy; {this.props.text}
      </div>
    )
  }
}
