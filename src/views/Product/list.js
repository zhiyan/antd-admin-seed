import React, { PropTypes } from 'react'
import { Table, Modal, notification, Button } from 'antd'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { getProductList, onOffProduct } from '../../actions/product'
import {exportData} from '../../utils'

const confirm = Modal.confirm

class ProductList extends React.Component {

  constructor (props) {
    super(props)

    this.columns = [{
        title: '产品ID',
        dataIndex: 'product',
        key: 'product'
      }, {
        title: '产品标题',
        dataIndex: 'text',
        key: 'text'
      }, {
        title: '产品数值',
        key: 'goodValue',
        render(text, record){
          return `${record.goodValue} ${['','日','月','年','升'][record.productUnit]}`
        }
      },{
        title: '产品价格',
        key: 'price',
        render(text, record){
          return `${record.price}元`
        }
      },{
        title: '产品类型',
        key: 'productType',
        render(text, record){
          return `${['','按天购水','按量购水'][record.productType]}`
        }
      }, {
        title: '设备品牌',
        dataIndex: 'categoryName',
        key: 'categoryName'
      }, {
        title: '上线状态',
        key: 'onOff',
        render(text, record){
          return record.onOff === 2 ? '已下线' : '已上线'
        }
      },{
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime'
    }, {
        title: '操作',
        key: 'operation',
        render: (text, record) => (
          <span>
            <a href="#" onClick={this.onOffHandler.bind(this, record.product, record.onOff === 1 ? 2 : 1)}>{record.onOff === 2 ? '上线' : '下线'}</a>
            <span className="ant-divider"></span>
            <Link to={'/product/edit/' + record.product}>修改</Link>
          </span>
        )
      }]

      this.pagination = {
        showQuickJumper:true,
        size: 'small',
        total: 0,
        current:1,
        pageSize: 12,
        showTotal(total){
          return `共 ${total} 条`
        },
        onChange: (current) => {
          this.props.getProductList(current,this.pagination.pageSize)
        }
      }
  }

  componentWillMount(){
    this.props.getProductList(1,this.pagination.pageSize)
  }

  componentWillReceiveProps(nextProps) {
    this.pagination.total = nextProps.product.list.totalCount
    this.pagination.current = nextProps.product.list.currentPage
    this.pagination.pageSize = nextProps.product.list.pageSize
  }

  onOffHandler(product, onOff){
    this.props.onOffProduct(product, onOff, function(res){
      if(res.ret){
        notification.success({
          message: onOff === 1 ? `产品${product}成功上线` : `产品${product}成功下线`
        })
      }else{
        notification.error({
          message: res.errmsg
        })
      }
    })
  }

  render () {
    return (
      <div>
       <div className="export-wrapper">
        <Button type="primary" htmlType="submit" icon="download" size="small" onClick={exportData.bind(this, 'product/export', '')}>导出</Button>
      </div>
    <Table rowKey={record => record.product} columns={this.columns} dataSource={this.props.product.list.list} pagination={this.pagination}/>
    </div>
    )
  }
}

ProductList.propTypes = {
  product: PropTypes.object
}

ProductList.contextTypes = {
  router: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired
}

function mapStateToProps(state) {
  const {product}  = state
  return {
    product: product
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getProductList: bindActionCreators(getProductList, dispatch),
    onOffProduct: bindActionCreators(onOffProduct, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductList)
