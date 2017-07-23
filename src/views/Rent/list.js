import React, { PropTypes } from 'react'
import { Table, Modal, notification, Form, Input, Row, Col, Button, Select, DatePicker } from 'antd'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { getRentList, delRent } from '../../actions/rent'
import PanelBox from '../../components/PanelBox'
import {exportData} from '../../utils'
import moment from 'moment'

const confirm = Modal.confirm
const FormItem = Form.Item
const Option = Select.Option

class RentList extends React.Component {

  constructor (props) {
    super(props)

    this.columns = [{
        title: 'ID',
        dataIndex: 'id',
        key: 'id'
      }, {
        title: '设备',
        key: 'eid',
        render: (text, record) => (
          <div>
            <p>{record.eid}&nbsp;</p>
            <p> ({record.equipName})</p>
          </div>
      )
      }, {
        title: '用户地址',
        dataIndex: 'renterAddress',
        key: 'renterAddress'
      }, {
        title: '用户手机号',
        dataIndex: 'renterMobile',
        key: 'renterMobile'
      }, {
        title: '用户姓名',
        dataIndex: 'renterName',
        key: 'renterName'
      }, {
        title: '销售人员',
        dataIndex: 'staffName',
        key: 'staffName'
      },{
        title: '备注',
        dataIndex: 'remark',
        key: 'remark'
      }, {
        title: '操作',
        key: 'operation',
        render: (text, record) => (
          <span>
            <a href="#" onClick={this.delHandler.bind(this, record.id)}>删除</a>
            <span className="ant-divider"></span>
            <Link to={'/rent/edit/' + record.id}>修改</Link>
          </span>
        )
      }]

      this.state = {
        citys : []
      }

      this.params = {
        'renterMobile' : '',
        'renterMobile' : '',
        'staffName' : ''
      }

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
          this.props.getRentList({...this.params, pageSize: this.pagination.pageSize, currentPage: current})
        }
      }
  }

  componentWillMount(){
    this.props.getRentList({...this.params, pageSize: this.pagination.pageSize, currentPage: 1})
  }

  componentWillReceiveProps(nextProps) {
    this.pagination.total = nextProps.rent.list.totalCount
    this.pagination.current = nextProps.rent.list.currentPage
    this.pagination.pageSize = nextProps.rent.list.pageSize
  }

  delHandler(id){
    let that = this
    confirm({
      title: '您是否确认要删除这项内容',
      onOk() {
        return new Promise((resolve) => {
          that.props.delRent(id, function(res){
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

  handleSubmit(e){
    e.preventDefault()
    this.setParams()
    this.props.getRentList(this.params)
  }

  setParams(){
    this.params = {...this.props.form.getFieldsValue(), pageSize:this.pagination.pageSize, currentPage:1}
    if(this.params.province){
      this.params.province = +this.params.province
    }
    if(this.params.city){
      this.params.city = +this.params.city
    }
    if(this.params.startTime){
      this.params.startTime = moment(this.params.startTime).format('YYYY-MM-DD')
    }
    if(this.params.endTime){
      this.params.endTime = moment(this.params.endTime).format('YYYY-MM-DD')
    }
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
    const { getFieldProps } = this.props.form;
    return (
    <div>
      <PanelBox title="查询条件">
          <Form inline  className="ant-advanced-search-form" onSubmit={this.handleSubmit.bind(this)}>
              <Row type="flex" justify="start">
                  <Col span="12">
                      <FormItem label="时间范围"  labelCol={{span: 4}} wrapperCol={{span: 18}}>
                              <Row type="flex" justify="start">
                                  <Col span="11">
                                      <DatePicker size="default" {...getFieldProps('startTime')}/>
                                  </Col>
                                  <Col span="1">
                                      <p className="ant-form-split">-</p>
                                  </Col>
                                  <Col span="11">
                                      <DatePicker size="default"  {...getFieldProps('endTime')}/>
                                  </Col>
                              </Row>
                      </FormItem>
                  </Col>
                  <Col span="12">
                      <FormItem label="所在地"  labelCol={{span: 4}} wrapperCol={{span: 18}}>
                          <Row type="flex" justify="start" style={{ width: '380' }} >
                                <Col span="11">
                                    <Select  {...getFieldProps('province')}  onChange={this.handleProvinceChange.bind(this)} placeholder="请选择省份">
                                        {this.props.province.list.map((item, key) => <Option value={item.id + ''} key={key}>{item.name}</Option>)}
                                    </Select>
                                </Col>
                               <Col span="1">
                                  <p className="ant-form-split">-</p>
                               </Col>
                               <Col span="11">
                                   <Select  {...getFieldProps('city')}   placeholder="请选择城市">
                                       {this.state.citys.map((item, key) => <Option value={item.id + ''} key={key}>{item.name}</Option>)}
                                   </Select>
                               </Col>
                          </Row>
                      </FormItem>
                  </Col>
              </Row>
              <Row type="flex" justify="start">
                  <Col span="24">
                      <FormItem label="用户姓名" labelCol={{span: 6}} wrapperCol={{span: 18}}>
                              <Input {...getFieldProps('renterName')}/>
                      </FormItem>
                      <FormItem label="用户手机" labelCol={{span: 6}} wrapperCol={{span: 18}}>
                              <Input {...getFieldProps('renterMobile')}/>
                      </FormItem>
                      <FormItem label="销售人员" labelCol={{span: 6}} wrapperCol={{span: 18}}>
                          <Input {...getFieldProps('staffName')}/>
                      </FormItem>
                  </Col>
              </Row>
              <Row>
                  <Col span="24" style={{ textAlign: 'right', paddingBottom: '8px' }}>
                      <Button type="primary" htmlType="submit">查询</Button>
                  </Col>
              </Row>
           </Form>
        </PanelBox>
      <div className="export-wrapper">
        <Button type="primary" htmlType="submit" icon="download" size="small" onClick={exportData.bind(this, 'rent/export', this.params)}>导出</Button>
      </div>
      <Table rowKey={record => record.id} columns={this.columns} dataSource={this.props.rent.list.list} pagination={this.pagination}/>
    </div>
    )
  }
}

RentList.propTypes = {
  rent: PropTypes.object
}

RentList.contextTypes = {
  router: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired
}

RentList = Form.create()(RentList)

function mapStateToProps(state) {
  const {rent, province}  = state
  return {
    rent,
    province
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getRentList: bindActionCreators(getRentList, dispatch),
    delRent: bindActionCreators(delRent, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RentList)
