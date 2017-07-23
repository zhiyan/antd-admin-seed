import React, { PropTypes } from 'react'
import { Table, Modal, notification, Form, Row, Col, Button, Input, Select } from 'antd'
import PanelBox from '../../components/PanelBox'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { getConsumerList, offlineConsumer } from '../../actions/consumer'
import {exportData} from '../../utils'

const confirm = Modal.confirm
const FormItem = Form.Item
const Option = Select.Option

class ConsumerList extends React.Component {

  constructor (props) {
    super(props)

    this.onOff = [
      '',
      '在线',
      '离线'
    ]

    this.columns = [{
        title: '设备',
        key: 'eid',
        render: (text, record) => (
          <div>
              <p>{record.eid}</p>
              <p> ({record.equipName})</p>
          </div>
        )
     }, {
        title: '绑定手机号',
        key: 'mobiles',
        render: (text, record) => (
          <div>
            {record.mobiles && record.mobiles.map((item, key) => <p key={key}>{item}</p>)}
          </div>
        )
      },{
      title: '客户姓名',
      dataIndex: 'owner',
      key: 'owner'
    },{
        title: '省份信息',
        dataIndex: 'province',
        key: 'province'
      },{
      title: '城市信息',
      dataIndex: 'city',
      key: 'city'
    },{
      title: '区县信息',
      dataIndex: 'district',
      key: 'district'
    },{
        title: '滤芯使用状况',
        key: 'components',
        render: (text, record) => (
          <div>
            {record.components.map((item, key) => 
              <p key={key}>
                {item.name}：剩余{item.remainingDays}天, {item.percentage}%&nbsp;
              </p>)
            }
          </div>
        )
      },{
        title: '设备状态',
        key: 'onOff',
        render: (text, record) => this.onOff[record.onOff]
    },{
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime'
    }, {
        title: '操作',
        key: 'operation',
        render: (text, record) => (
          <span>
            <Link to={'/order/add/' + record.eid}>缴费</Link>
            <span className="ant-divider"></span>
            <a href="javascript:void(0)" onClick={this.offlineHandler.bind(this, record.eid)}>解绑</a>
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
          this.props.getConsumerList({...this.params,currentPage: current, pageSize:this.pagination.pageSize})
        }
      },

      this.params = {
        'mobile' : '',
      }

      this.state = {
        citys : []
      }
  }

  componentWillMount(){
    this.props.getConsumerList({currentPage: 1, pageSize:this.pagination.pageSize})
  }

  offlineHandler(eid) {
      confirm({
        title: '确认解除绑定关系?',
        content: '点击确认将解除该设备的所有关联关系',
        onOk: () => {
          return new Promise((resolve) => {
            this.props.offlineConsumer(eid, function(res){
              if(res.ret){
                notification.success({
                  message: '操作成功'
                })
              }else{
                notification.error({
                  message: res.errmsg
                })
              }
              resolve()
            })
          })
        },
        onCancel() {}
      })
  }

  componentWillReceiveProps(nextProps) {
    this.pagination.total = nextProps.consumer.list.totalCount
    this.pagination.current = nextProps.consumer.list.currentPage
    this.pagination.pageSize = nextProps.consumer.list.pageSize
  }

  handleSubmit(e){
    let data = this.props.form.getFieldsValue()
    e.preventDefault()
    this.params = {
      'mobile' : data.mobile,
      'province' : data.province ? +data.province : '',
      'city' : data.city ? +data.city : ''
    }
    this.props.getConsumerList(this.params)
  }

  handleProvinceChange(provinceId){
    const data = this.props.province.list.filter(item => item.id === +provinceId)
    this.props.form.setFieldsValue({'province' : provinceId})
    this.props.form.setFieldsValue({'city' : undefined})
    this.setState({
      citys: data[0].citys
    })
  }

  render () {
    const { getFieldProps } = this.props.form
    return (
    <div>
      <PanelBox title="查询条件">
          <Form inline className="ant-advanced-search-form" onSubmit={this.handleSubmit.bind(this)}>
            <FormItem
              label="手机号：">
              <Input size="large" placeholder="请输入查询手机号" {...getFieldProps('mobile')}/>
            </FormItem>
            <FormItem
              label="省份">
              <Select {...getFieldProps('province')} style={{ width: 190 }} onChange={this.handleProvinceChange.bind(this)} placeholder="请选择省份">
                {this.props.province.list.map((item, key) => <Option value={item.id + ''} key={key}>{item.name}</Option>)}
              </Select>
            </FormItem>

            <FormItem
              label="城市：">
              <Select {...getFieldProps('city')} style={{ width: 190 }} placeholder="请选择城市">
                {this.state.citys.map((item, key) => <Option value={item.id + ''} key={key}>{item.name}</Option>)}
              </Select>
            </FormItem>
            <Button type="primary" htmlType="submit">查询</Button>
           </Form>
        </PanelBox>
        <div className="export-wrapper">
        <Button type="primary" htmlType="submit" icon="download" size="small" onClick={exportData.bind(this, 'consumer/export', this.params)}>导出</Button>
      </div>
      <Table rowKey={record => record.eid} columns={this.columns} dataSource={this.props.consumer.list.list} pagination={this.pagination}/>
    </div>
    )
  }
}

ConsumerList = Form.create()(ConsumerList)

ConsumerList.propTypes = {
  consumer: PropTypes.object
}

ConsumerList.contextTypes = {
  router: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired
}

function mapStateToProps(state) {
  const {consumer, province}  = state
  return {
    consumer,
    province
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getConsumerList: bindActionCreators(getConsumerList, dispatch),
    offlineConsumer : bindActionCreators(offlineConsumer, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConsumerList)
