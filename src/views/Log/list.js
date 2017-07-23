import React, { PropTypes } from 'react'
import { Table, Modal, notification,Form, Input, Row, Col, Button, DatePicker, Radio, Select } from 'antd'
import PanelBox from '../../components/PanelBox'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { getLogList } from '../../actions/log'
import moment from 'moment'

const confirm = Modal.confirm
const FormItem = Form.Item
const RadioGroup = Radio.Group
const Option = Select.Option

class LogList extends React.Component {

  constructor (props) {
    super(props)

    this.columns = [ {
      title: '日志ID',
      dataIndex: 'id',
      key: 'id'
    },{
        title: '日志内容',
        dataIndex: 'content',
        key: 'content'
      }, {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime'
      },{
      title: '操作人',
      dataIndex: 'staffName',
      key: 'staffName'
    }, {
      title: '日志类型',
      dataIndex: 'logTypeName',
      key: 'logTypeName'
    }]

      this.pagination = {
        showQuickJumper:true,
        size: 'small',
        total: 0,
        current:1,
        showTotal(total){
          return `共 ${total} 条`
        },
        onChange: (current) => {
          this.props.getLogList({...this.params,currentPage: current, pageSize:this.pagination.pageSize})
        }
      }

      this.params = {
        'startTime' : '',
        'endTime' : '',
        'logType' : 0
      }

      this.logTypes = [
        {id: 0, name:'全部'},
        {id: 2, name:'增加员工信息'},
        {id: 3, name:'增加公司信息'},
        {id: 4, name:'修改员工信息'},
        {id: 5, name:'修改公司信息'},
        {id: 6, name:'删除员工信息'},
        {id: 7, name:'增加维修工单'},
        {id: 8, name:'修改维修工单'},
        {id: 9, name:'增加缴费订单'},
      ]

  }

  componentWillMount(){
    this.props.getLogList({...this.params,currentPage: 1, pageSize:this.pagination.pageSize})
  }

  componentWillReceiveProps(nextProps) {
    this.pagination.total = nextProps.log.list.totalCount
    this.pagination.current = nextProps.log.list.currentPage
    this.pagination.pageSize = nextProps.log.list.pageSize
  }

  handleSubmit(e){
    e.preventDefault()
    this.setParams()
    this.props.getLogList(this.params)
  }

  setParams(){
    let data = this.props.form.getFieldsValue()
    this.params = {
      'startTime' : data.startTime ? moment(data.startTime).format('YYYY-MM-DD') : '',
      'endTime' : data.endTime ? moment(data.endTime).format('YYYY-MM-DD') : '',
      'logType' : data.logType
    }
  }

  render () {
    const { getFieldProps } = this.props.form
    return (
      <div>
        <PanelBox title="查询条件">
          <Form inline className="ant-advanced-search-form" onSubmit={this.handleSubmit.bind(this)}>
            <FormItem
              label="开始时间：">
              <DatePicker size="default" {...getFieldProps('startTime')}/>
            </FormItem>
            <FormItem
              label="结束时间：">
              <DatePicker size="default"  {...getFieldProps('endTime')}/>
            </FormItem>
            <FormItem
              label="日志类型：">
              <Select {...getFieldProps('logType',{initialValue:"0"})} style={{ width: 130 }}>
                {this.logTypes.map((item, key) => <Option value={item.id + ''} key={key}>{item.name}</Option>)}
              </Select>
            </FormItem>
            <Button type="primary" htmlType="submit">查询</Button>
           </Form>
        </PanelBox>
        <Table rowKey={record => record.id} columns={this.columns} dataSource={this.props.log.list.list} pagination={this.pagination}/>
      </div>
    )
  }
}

LogList.propTypes = {
  log: PropTypes.object
}

LogList.contextTypes = {
  router: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired
}

LogList = Form.create()(LogList)

function mapStateToProps(state) {
  const {log}  = state
  return {
    log: log
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getLogList: bindActionCreators(getLogList, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LogList)
