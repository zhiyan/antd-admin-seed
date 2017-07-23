import React, { PropTypes } from 'react'
import { Table, Modal, notification, Form, Icon, Button, Upload } from 'antd'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { getEquipList } from '../../actions/equip'
import {exportData} from '../../utils'

const confirm = Modal.confirm
const FormItem = Form.Item

class EquipList extends React.Component {
  constructor (props) {

    super(props)

    this.columns = [{
        title: '设备名称',
        dataIndex: 'equipName',
        key: 'equipName',
        width:320
      }, {
        title: '设备型号',
        dataIndex: 'equipType',
        key: 'equipType'
      }, {
        title: '工作模式',
        key: 'workMode',
        render(text, record){
          return record.workMode === 1 ? '卖出' : '租赁'
        }
      }/*, {
        title: '滤芯材料',
        key: 'components',
        render: (text, record) => (
          <div>
            {record.components.map((item, key) => 
              <p key={key}>
                {item.cName}
              </p>)
            }
          </div>
        )
      }*/, {
      title: '定价类型',
      key: 'productType',
      render(text, record){
        if(record.productType === 0)
           return '设备卖出'
        else
           return record.productType === 1 ? '按天定价' : '按量定价'
      }
    },{
        title: '导入',
        key: 'export',
        render: (text, record) => (
          <span>
            <Upload {...props} name="dataFile" action={'/api/equip/class/import'} data={{id: record.id}} onChange={this.uploadFileHandler}>
              <a href="javascript:void(0)" style={{color:'#686868', fontSize:12}}><Icon type="upload" />&nbsp;设备导入</a>
            </Upload>
          </span>
        )
      }, {
        title: '操作',
        key: 'operation',
        render: (text, record) => (
          <span>
            <Link to={'/equip/edit/' + record.id}>修改</Link>
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
          this.props.getEquipList(current,this.pagination.pageSize)
        }
      }
  }

  componentWillMount(){
    this.props.getEquipList(1, this.pagination.pageSize)
  }

  componentWillReceiveProps(nextProps) {
    this.pagination.total = nextProps.equip.list.totalCount
    this.pagination.current = nextProps.equip.list.currentPage
    this.pagination.pageSize = nextProps.equip.list.pageSize
  }

  uploadFileHandler(info){
    if (info.file.status === 'done') {
      if(info.file.response.ret){
        notification.success({message: '上传成功'})
      }else{
        notification.error({message: info.file.response.errmsg})
      }
    } else if (info.file.status === 'error') {
      notification.error({message: '上传出错'})
    }
  }

  render () {
    const { getFieldProps } = this.props.form
    return (
      <div>
         <div className="export-wrapper">
        <Button type="primary" htmlType="submit" icon="download" size="small" onClick={exportData.bind(this, 'equip/class/export', '')}>导出</Button>
      </div>
        <Table rowKey={record => record.id} columns={this.columns} dataSource={this.props.equip.list.list} pagination={this.pagination}/>
      </div>
    )
  }
}

EquipList.propTypes = {
  equip: PropTypes.object
}

EquipList.contextTypes = {
  router: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired
}

EquipList = Form.create()(EquipList)

function mapStateToProps(state) {
  const {equip}  = state
  return {
    equip: equip
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getEquipList: bindActionCreators(getEquipList, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EquipList)
