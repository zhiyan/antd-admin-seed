import React, { PropTypes } from 'react'
import { Form, Input, Button, notification, Checkbox } from 'antd'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { addUser, getUser, editUser } from '../../actions/user'

const FormItem = Form.Item
const CheckboxGroup = Checkbox.Group

class UserAdd extends React.Component {

  constructor (props) {
    super(props)
  }

  componentWillMount(){
    if(typeof this.props.routeParams.id !== 'undefined'){
      this.props.getUser(this.props.routeParams.id, (res) => {
        if(res.ret){
          this.props.form.setFieldsValue(res.data)
        }
      })
    }
  }

  componentWillReceiveProps(nextProps) {
  }

  handleSubmit(e){
    e.preventDefault()
    this.props.form.validateFields((errors, values) => {
      let action = this.props.routeParams.id ? this.props.editUser : this.props.addUser

      if (!errors) {
        action(this.props.routeParams.id ? {...values,roles: this.roles, id:this.props.routeParams.id} : {...values, roles:this.roles}, (res)=>{
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
    })
  }

  noop(){
    return false
  }

  roles:[]

  changeRoles(value){
    this.roles = value
  }

  render () {
    const { getFieldProps } = this.props.form

    const accountProps = getFieldProps('account', {
      rules: [
        { required: true, message: '请输入账户名' },
      ]
    })

    const realnameProps = getFieldProps('realName', {
      rules: [
        { required: true, message: '请输入昵称' },
      ]
    })

    const passwordProps = getFieldProps('password', {
      rules: [
        { required: true, message: '请输入密码' },
      ]
    })

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    }

    return (
      <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
        <FormItem
          label="账户名："
          hasFeedback
          {...formItemLayout}>
          <Input {...accountProps}/>
        </FormItem>

        <FormItem
          label="真实姓名："
          {...formItemLayout}>
          <Input  {...realnameProps}/>
        </FormItem>

        <FormItem
          label="密码："
          {...formItemLayout}>
          <Input {...passwordProps} type="password"
                  onContextMenu={this.noop} onPaste={this.noop} onCopy={this.noop} onCut={this.noop}
                  autoComplete="off"/>
        </FormItem>

        <FormItem
          label="权限："
          {...formItemLayout}>
          <CheckboxGroup options={this.props.user.roles} onChange={this.changeRoles.bind(this)}/>
        </FormItem>

        <FormItem wrapperCol={{ span: 14, offset: 6 }} style={{ marginTop: 24 }}>
          <Button type="primary" htmlType="submit">提交</Button>
        </FormItem>
      </Form>
    )
  }
}

UserAdd.propTypes = {
  user: PropTypes.object
}

UserAdd.contextTypes = {
  router: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired
}

UserAdd = Form.create()(UserAdd)

function mapStateToProps(state) {
  const {user}  = state
  return {
    user: user
  }
}

function mapDispatchToProps(dispatch) {
  return {
    addUser: bindActionCreators(addUser, dispatch),
    getUser: bindActionCreators(getUser, dispatch),
    editUser:bindActionCreators(editUser, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserAdd)
