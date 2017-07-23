import React, { PropTypes } from 'react'
import { Table, notification, Radio, Form, Input, Row, Col, Button,DatePicker } from 'antd'
import PanelBox from '../../components/PanelBox'
import Modal from '../../components/Modal'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { getOrderList, getOrder } from '../../actions/order'
import {exportData} from '../../utils'
import moment from 'moment'

const FormItem = Form.Item
const RadioGroup = Radio.Group

class OrderList extends React.Component {

  constructor (props) {
    super(props)

    this.columns = [{
        title: '订单号',
        dataIndex: 'orderNo',
        key: 'orderNo'
      }, {
      title: '设备',
      key: 'eid',
      render: (text, record) => (
          <div>
             <p>{record.eid}</p>
             <p> ({record.equipName})</p>
          </div>
      )
     }, {
      title: '客户手机号',
      dataIndex: 'userMobile',
      key: 'userMobile'
    }, {
        title: '购水额',
        key: 'goodValue',
        render: (text, record) => <span>{this.getGoodValue(record.goodValue, record.productType)}</span>
    },  {
        title: '支付金额',
        key: 'amount',
        render: (text, record) => <span>&yen;{record.amount}</span>
      }, {
        title: '订单备注',
        dataIndex: 'text',
        key: 'text'
      }, {
        title: '订单状态',
        key: 'orderStatus',
        render: (text, record) => <span>{this.getOrderStatus(record.orderStatus)}</span>
      },{
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime'
    },  {
        title: '操作',
        key: 'operation',
        render: (text, record) => <span><a href="javascript:void(0)" onClick={this.showModal.bind(this, record.orderNo)}>详情</a></span>
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
          this.props.getOrderList({...this.params, pageSize: this.pagination.pageSize, currentPage: current})
        }
      }

      this.params = {
        'userMobile' : '',
        'orderNo' : ''
      }

      this.state = {
        detailShow: false,
        data:{}
      }

  }

  componentWillMount(){
    this.props.getOrderList({...this.params, pageSize: this.pagination.pageSize, currentPage: 1})
  }

  componentWillReceiveProps(nextProps) {
    this.pagination.total = nextProps.order.list.totalCount
    this.pagination.current = nextProps.order.list.currentPage
    this.pagination.pageSize = nextProps.order.list.pageSize
  }

  getOrderStatus(status){
    switch(status){
      case 1:
        return '新单'
      case 2:
        return '处理中'
      case 3: 
        return '处理完成'
      case 4:
        return '取消单'
      default:
        return '未知状态'
    }
  }

  getPayStatus(status){
    switch(status){
      case 0:
        return '未支付'
      case 2:
        return '支付成功'
      case 3: 
        return '支付失败'
    }
  }

  getProductType(type){
    switch(type){
      case 1:
        return '按天购水'
      case 2:
        return '按量购水'
    }
  }

  getGoodValue(value, type){
    if(type === 1){
      return `${value}天`
    }else if(type === 2){
      return `${value}升`
    }else{
      return value
    }
  }

  handleSubmit(e){
    e.preventDefault()
    this.setParams()
    this.props.getOrderList(this.params)
  }

  setParams(){
    this.params = {...this.props.form.getFieldsValue(), pageSize:this.pagination.pageSize, currentPage:1}

    if(this.params.startTime){
      this.params.startTime = moment(this.params.startTime).format('YYYY-MM-DD')
    }
    if(this.params.endTime){
      this.params.endTime = moment(this.params.endTime).format('YYYY-MM-DD')
    }
  }

  showModal(orderNo){
    this.props.getOrder(orderNo, res =>{
      if(res.ret){
        this.setState({
          data: res.data,
          detailShow: true
        })
      }
    })
  }

  hideModal(){
    this.setState({
      data: {},
      detailShow: false
    })
  }

  render () {
    const { getFieldProps } = this.props.form
    const {data} = this.state
    const styles = {
      textAlign: 'right',
      paddingRight:'20px',
      marginBottom:'20px'
    }
    const LeftSpan = 6
    const rightSpan = 12
    return (
      <div>
        <PanelBox title="查询条件">
          <Form inline className="ant-advanced-search-form" onSubmit={this.handleSubmit.bind(this)}>
             <FormItem
                label="订单号">
                <Input {...getFieldProps('orderNo')}/>
              </FormItem>
              <FormItem
                label="手机">
                <Input {...getFieldProps('userMobile')}/>
              </FormItem>
              <FormItem
              label="开始时间：">
              <DatePicker size="default" {...getFieldProps('startTime')}/>
              </FormItem>
              <FormItem
                label="结束时间：">
                <DatePicker size="default"  {...getFieldProps('endTime')}/>
              </FormItem>
              <Button type="primary" htmlType="submit">查询</Button>
           </Form>
        </PanelBox>
         <div className="export-wrapper">
            <Button type="primary" htmlType="submit" icon="download" size="small" onClick={exportData.bind(this, 'order/export', this.params)}>导出</Button>
          </div>
        <Table rowKey={record => record.orderNo} columns={this.columns} dataSource={this.props.order.list.list} pagination={this.pagination}/>
        <Modal visible={this.state.detailShow} title="订单详情" close={this.hideModal.bind(this)}>
          <Row>
            <Col className="gutter-row" span={LeftSpan} style={styles}>
              <div className="gutter-box">订单号:</div>
            </Col>
            <Col className="gutter-row" span={rightSpan}>
              <div className="gutter-box">&yen;{data.orderNo}</div>
            </Col>
          </Row>
          <Row>
            <Col className="gutter-row" span={LeftSpan} style={styles}>
              <div className="gutter-box">购水额:</div>
            </Col>
            <Col className="gutter-row" span={rightSpan}>
              <div className="gutter-box">{this.getGoodValue(data.goodValue, data.productType)}</div>
            </Col>
          </Row>
          <Row>
            <Col className="gutter-row" span={LeftSpan} style={styles}>
              <div className="gutter-box">设备id:</div>
            </Col>
            <Col className="gutter-row" span={rightSpan}>
              <div className="gutter-box">{data.eid}</div>
            </Col>
          </Row>
          <Row>
            <Col className="gutter-row" span={LeftSpan} style={styles}>
              <div className="gutter-box">设备名称:</div>
            </Col>
            <Col className="gutter-row" span={rightSpan}>
              <div className="gutter-box">{data.equipName}</div>
            </Col>
          </Row>
          <Row>
            <Col className="gutter-row" span={LeftSpan} style={styles}>
              <div className="gutter-box">产品描述:</div>
            </Col>
            <Col className="gutter-row" span={rightSpan}>
              <div className="gutter-box">{data.text}</div>
            </Col>
          </Row>
          <Row>
            <Col className="gutter-row" span={LeftSpan} style={styles}>
              <div className="gutter-box">用户ID:</div>
            </Col>
            <Col className="gutter-row" span={rightSpan}>
              <div className="gutter-box">{data.userId}</div>
            </Col>
          </Row>
          <Row>
            <Col className="gutter-row" span={LeftSpan} style={styles}>
              <div className="gutter-box">订单状态:</div>
            </Col>
            <Col className="gutter-row" span={rightSpan}>
              <div className="gutter-box">{this.getOrderStatus(data.orderStatus)}</div>
            </Col>
          </Row>
          <Row>
            <Col className="gutter-row" span={LeftSpan} style={styles}>
              <div className="gutter-box">支付金额:</div>
            </Col>
            <Col className="gutter-row" span={rightSpan}>
              <div className="gutter-box">&yen;{data.amount}</div>
            </Col>
          </Row>
          <Row>
            <Col className="gutter-row" span={LeftSpan} style={styles}>
              <div className="gutter-box">支付渠道:</div>
            </Col>
            <Col className="gutter-row" span={rightSpan}>
              <div className="gutter-box">{data.payChannel}</div>
            </Col>
          </Row>
          <Row>
            <Col className="gutter-row" span={LeftSpan} style={styles}>
              <div className="gutter-box">支付状态:</div>
            </Col>
            <Col className="gutter-row" span={rightSpan}>
              <div className="gutter-box">{this.getPayStatus(data.payStatus)}</div>
            </Col>
          </Row>
          <Row>
            <Col className="gutter-row" span={LeftSpan} style={styles}>
              <div className="gutter-box">产品类型:</div>
            </Col>
            <Col className="gutter-row" span={rightSpan}>
              <div className="gutter-box">{this.getProductType(data.productType)}</div>
            </Col>
          </Row>
          <Row>
            <Col className="gutter-row" span={LeftSpan} style={styles}>
              <div className="gutter-box">下单时间:</div>
            </Col>
            <Col className="gutter-row" span={rightSpan}>
              <div className="gutter-box">{data.createTime}</div>
            </Col>
          </Row>
          <Row>
            <Col className="gutter-row" span={LeftSpan} style={styles}>
              <div className="gutter-box">备注:</div>
            </Col>
            <Col className="gutter-row" span={rightSpan}>
              <div className="gutter-box">{data.remark}</div>
            </Col>
          </Row>
        </Modal>
      </div>
    )
  }
}

OrderList.propTypes = {
  order: PropTypes.object
}

OrderList.contextTypes = {
  router: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired
}

OrderList = Form.create()(OrderList)

function mapStateToProps(state) {
  const {order}  = state
  return {
    order: order
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getOrderList: bindActionCreators(getOrderList, dispatch),
    getOrder: bindActionCreators(getOrder, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderList)
