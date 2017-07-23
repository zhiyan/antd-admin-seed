import React, { PropTypes } from 'react'
import { Table, Modal, notification, Radio, Form, Input, Row, Col, Button } from 'antd'
import PanelBox from '../../components/PanelBox'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { getUpkeepList, assignUpkeep, alterUpkeep } from '../../actions/upkeep'
import {exportData} from '../../utils'

const confirm = Modal.confirm
const FormItem = Form.Item
const RadioGroup = Radio.Group

class UpkeepList extends React.Component {

  constructor (props) {
    super(props)

    this.repairStatus = [
      '',
      '新工单',
      '已分配',
      '维修完成',
      '已失效'
    ]

    this.columns = [{
        title: '工单号',
        dataIndex: 'id',
        key: 'id'
      }, {
        title: '报修手机',
        dataIndex: 'mobile',
        key: 'mobile'
      }, {
        title: '设备ID',
        dataIndex: 'eid',
        key: 'eid'
      }, {
        title: '反馈问题',
        dataIndex: 'content',
        key: 'content'
      },  {
        title: '用户住址',
        dataIndex: 'address',
        key: 'address'
      }, {
        title: '工单状态',
        key: 'repairStatus',
        render: (text, record) => this.repairStatus[record.repairStatus]
    },{
        title: '维修人员',
        dataIndex: 'serviceman',
        key: 'serviceman'
      }, {
        title: '工单备注',
        dataIndex: 'remark',
        key: 'remark'
      }, {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime'
    },{
        title: '操作',
        key: 'operation',
        render: (text, record) => (
          <span>
            <Link to={'/upkeep/edit/' + record.id}>修改</Link>

            {record.repairStatus === 2 ? <span><span className="ant-divider"></span><a href="#" onClick={this.setStatus.bind(this, record.id, 3)}>维修完成</a></span> : ''}

            {record.repairStatus < 3 ? <span><span className="ant-divider"></span><a href="#" onClick={this.setStatus.bind(this, record.id, 4)}>失效</a></span> : ''}
            
            <span className="ant-divider"></span>
            <a href="#" onClick={this.showModal.bind(this, record.id, record.serviceman)}>分配</a>
            <Modal title="分配工单"
              visible={this.state.visible}
              onOk={this.dispatch.bind(this)}
              confirmLoading={this.state.confirmLoading}
              onCancel={this.handleCancel.bind(this)}
            >
              <Input placeholder="姓名" onChange={this.updateServiceman.bind(this)}/>
            </Modal>
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
          this.props.getUpkeepList({...this.params, pageSize: this.pagination.pageSize, currentPage: current})
        }
      }

      this.params = {
        'repairStatus' : -1,
        'serviceman' : ''
      }

      this.state = {
        visible: false
      }

  }

  showModal(id, serviceman) {
    this.setState({
      'visible' : true,
      'recordId' : id,
      'serviceman' : serviceman
    })
  }

  setStatus(id, repairStatus){
    this.props.alterUpkeep(id, repairStatus, res => {
      if(res.ret){
        notification.success({
          message: '操作成功'
        })
      }else{
        notification.error({
          message: res.errmsg
        })
      }
    })
  }

  handleCancel() {
    this.setState({
      'visible' : false
    })
  }

  updateServiceman(e){
    this.setState({
      serviceman: e.target.value,
    })
  }

  componentWillMount(){
    this.props.getUpkeepList({...this.params, pageSize: this.pagination.pageSize, currentPage: 1})
  }

  componentWillReceiveProps(nextProps) {
    this.pagination.total = nextProps.upkeep.list.totalCount
    this.pagination.current = nextProps.upkeep.list.currentPage
    this.pagination.pageSize = nextProps.upkeep.list.pageSize
  }

  dispatch(){
    let that = this
    this.setState({
      confirmLoading: true,
    })
    new Promise((resolve) => {
      that.props.assignUpkeep(this.state.recordId, this.state.serviceman, function(res){
        if(res.ret){
          notification.success({
            message: '操作成功'
          })
          that.setState({
            visible: false,
            confirmLoading: false,
            serviceman : ''
          })
        }else{
          notification.error({
            message: res.errmsg
          })
        }
        resolve()
      })
    })
  }

  handleSubmit(e){
    e.preventDefault()
    this.setParams()
    this.props.getUpkeepList(this.params)
  }

  setParams(){
    this.params = {...this.props.form.getFieldsValue(), pageSize:this.pagination.pageSize, currentPage:1}
  }

  render () {
    const { getFieldProps } = this.props.form
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 14 },
    }
    return (
      <div>
        <PanelBox title="查询条件">
          <Form inline className="ant-advanced-search-form" onSubmit={this.handleSubmit.bind(this)}>
              <FormItem
                label="工单状态">
                <RadioGroup  {...getFieldProps('repairStatus', {'initialValue':0})}>
                  <Radio key="a" value={0}>全部</Radio>
                  <Radio key="b" value={1}>新工单</Radio>
                  <Radio key="c" value={2}>已分配</Radio>
                  <Radio key="d" value={3}>维修完成</Radio>
                  <Radio key="e" value={4}>已失效工单</Radio>
                </RadioGroup>
              </FormItem>
              <FormItem
                label="维修人员">
                <Input {...getFieldProps('serviceman')}/>
              </FormItem>
              <Button type="primary" htmlType="submit">查询</Button>
           </Form>
        </PanelBox>
        <div className="export-wrapper">
        <Button type="primary" htmlType="submit" icon="download" size="small" onClick={exportData.bind(this, 'consumer/export', this.params)}>导出</Button>
      </div>
        <Table rowKey={record => record.id} columns={this.columns} dataSource={this.props.upkeep.list.list} pagination={this.pagination}/>
      </div>
    )
  }
}

UpkeepList.propTypes = {
  upkeep: PropTypes.object
}

UpkeepList.contextTypes = {
  router: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired
}

UpkeepList = Form.create()(UpkeepList)

function mapStateToProps(state) {
  const {upkeep}  = state
  return {
    upkeep: upkeep
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getUpkeepList: bindActionCreators(getUpkeepList, dispatch),
    assignUpkeep: bindActionCreators(assignUpkeep, dispatch),
    alterUpkeep: bindActionCreators(alterUpkeep, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UpkeepList)
