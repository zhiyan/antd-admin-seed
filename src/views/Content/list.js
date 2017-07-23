import React, { PropTypes } from 'react'
import { Table, Modal, notification,Button } from 'antd'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { getContentList, delContent } from '../../actions/content'
import {exportData} from '../../utils'

const confirm = Modal.confirm

class ContentList extends React.Component {

  constructor (props) {
    super(props)

    this.columns = [{
        title: '资讯ID',
        dataIndex: 'id',
        key: 'id'
      },  {
        title: '资讯标题',
        dataIndex: 'title',
        key: 'title'
      }, {
        title: '内容摘要',
        dataIndex: 'synopsis',
        key: 'synopsis'
      }, {
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
            <Link to={'/content/edit/' + record.id}>修改</Link>
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
          this.props.getContentList(current,this.pagination.pageSize)
        }
      }
  }

  componentWillMount(){
    this.props.getContentList(1,this.pagination.pageSize)
  }

  componentWillReceiveProps(nextProps) {
    this.pagination.total = nextProps.content.list.totalCount
    this.pagination.current = nextProps.content.list.currentPage
    this.pagination.pageSize = nextProps.content.list.pageSize
  }

  delHandler(id){
    let that = this
    confirm({
      title: '您是否确认要删除这项内容',
      onOk() {
        return new Promise((resolve) => {
          that.props.delContent(id, function(res){
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
    <Table rowKey={record => record.id} columns={this.columns} dataSource={this.props.content.list.list} pagination={this.pagination}/>
    )
  }
}

ContentList.propTypes = {
  content: PropTypes.object
}

ContentList.contextTypes = {
  router: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired
}

function mapStateToProps(state) {
  const {content}  = state
  return {
    content: content
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getContentList: bindActionCreators(getContentList, dispatch),
    delContent: bindActionCreators(delContent, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ContentList)
