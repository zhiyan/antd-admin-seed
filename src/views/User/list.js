import React, { PropTypes } from 'react'
import { Table, Modal, notification } from 'antd'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { getUserList, delUser } from '../../actions/user'

const confirm = Modal.confirm

class UserList extends React.Component {

  constructor (props) {
    super(props)

    this.columns = [{
        title: '用户ID',
        dataIndex: 'id',
        key: 'id'
      }, {
        title: '账户',
        dataIndex: 'account',
        key: 'account'
      },  {
        title: '真实姓名',
        dataIndex: 'realName',
        key: 'realName'
      }, {
        title: '操作',
        key: 'operation',
        width:120,
        render: (text, record) => (
          <span>
            <a href="#" onClick={this.delHandler.bind(this, record.id)}>删除</a>
            <span className="ant-divider"></span>
            <Link to={'/system/user/edit/' + record.id}>修改</Link>
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
          this.props.getUserList(current,this.pagination.pageSize)
        }
      }
  }

  componentWillMount(){
    this.props.getUserList(1, this.pagination.pageSize)
  }

  componentWillReceiveProps(nextProps) {
    this.pagination.total = nextProps.user.list.totalCount
    this.pagination.current = nextProps.user.list.currentPage
    this.pagination.pageSize = nextProps.user.list.pageSize
  }

  delHandler(id){
    let that = this
    confirm({
      title: '您是否确认要删除这项内容',
      onOk() {
        return new Promise((resolve) => {
          that.props.delUser(id, function(res){
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
    <Table rowKey={record => record.id} columns={this.columns} dataSource={this.props.user.list.list} pagination={this.pagination}/>
    )
  }
}

UserList.propTypes = {
  user: PropTypes.object
}

UserList.contextTypes = {
  router: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired
}

function mapStateToProps(state) {
  const {user}  = state
  return {
    user: user
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getUserList: bindActionCreators(getUserList, dispatch),
    delUser: bindActionCreators(delUser, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserList)
