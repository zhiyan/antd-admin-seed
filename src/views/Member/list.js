import React, { PropTypes } from 'react'
import { Table, Modal, notification, Button } from 'antd'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { getMemberList, delMember } from '../../actions/member'
import {exportData} from '../../utils'

const confirm = Modal.confirm

class MemberList extends React.Component {

  constructor (props) {
    super(props)

    this.columns = [{
        title: '公司账户',
        dataIndex: 'companyAccount',
        key: 'companyAccount'
      }, {
        title: '公司名称',
        dataIndex: 'companyName',
        key: 'companyName'
      }, {
      title: '公司领导',
      dataIndex: 'companyLeader',
      key: 'companyLeader'
    }, {
      title: '联系方式',
      dataIndex: 'companyContact',
      key: 'companyContact'
    },{
      title: '省份信息',
      dataIndex: 'provinceName',
      key: 'provinceName'
    }, {
        title: '城市信息',
        dataIndex: 'cityName',
        key: 'cityName'
    },  {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime'
    }, {
        title: '操作',
        key: 'operation',
        render: (text, record) => (
          <span>
            <a href="#" onClick={this.delHandler.bind(this, record.id)}>删除</a>
            <span className="ant-divider"></span>
            <Link to={'/member/edit/' + record.id}>修改</Link>
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
          this.props.getMemberList(current,this.pagination.pageSize)
        }
      }
  }

  componentWillMount(){
    this.props.getMemberList(1, this.pagination.pageSize)
  }

  componentWillReceiveProps(nextProps) {
    this.pagination.total = nextProps.member.list.totalCount
    this.pagination.current = nextProps.member.list.currentPage
    this.pagination.pageSize = nextProps.member.list.pageSize
  }

  delHandler(id){
    let that = this
    confirm({
      title: '您是否确认要删除这项内容',
      onOk() {
        return new Promise((resolve) => {
          that.props.delMember(id, function(res){
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

  render () {
    return (
      <div>
        <div className="export-wrapper">
          <Button type="primary" htmlType="submit" icon="download" size="small" onClick={exportData.bind(this, 'member/export', '')}>导出</Button>
        </div>
        <Table rowKey={record => record.id} columns={this.columns} dataSource={this.props.member.list.list} pagination={this.pagination}/>
      </div>
    )
  }
}

MemberList.propTypes = {
  member: PropTypes.object
}

MemberList.contextTypes = {
  router: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired
}

function mapStateToProps(state) {
  const {member}  = state
  return {
    member: member
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getMemberList: bindActionCreators(getMemberList, dispatch),
    delMember: bindActionCreators(delMember, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MemberList)
