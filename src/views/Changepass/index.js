import React, { PropTypes } from 'react'
import { Form, Input, Button, notification, Checkbox } from 'antd'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { updatePassword } from '../../actions/user'

const FormItem = Form.Item
const CheckboxGroup = Checkbox.Group

class UpdatePassword extends React.Component {

  constructor (props) {
    super(props)
  }

  componentWillMount(){
  }

  componentWillReceiveProps(nextProps) {
  }

  handleSubmit(e){
    e.preventDefault()
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        this.props.updatePassword(values.newpassword, values.oldpassword, (res)=>{
          if(res.ret){
            notification.success({
              message: '密码修改成功'
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

  checkPass2(rule, value, callback) {
    const { getFieldValue } = this.props.form;
    if (value && value !== getFieldValue('newpassword')) {
      callback('两次输入密码不一致！')
    } else {
      callback()
    }
  }

  render () {
    const { getFieldProps } = this.props.form

    const oldPasswordProps = getFieldProps('oldpassword', {
      rules: [
        { required: true, message: '请输入原密码' },
      ]
    })

    const newPasswordProps = getFieldProps('newpassword', {
      rules: [
        { required: true, message: '请输入新密码' },
      ]
    })

    const rePasswordProps = getFieldProps('rePassword', {
      rules: [{
        required: true,
        whitespace: true,
        message: '请再次输入密码',
      }, {
        validator: this.checkPass2.bind(this),
      }],
    });

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    }

    return (
      <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
        <FormItem
          label="原密码："
          {...formItemLayout}>
          <Input {...oldPasswordProps} type="password"
                  onContextMenu={this.noop} onPaste={this.noop} onCopy={this.noop} onCut={this.noop}
                  autoComplete="off"/>
        </FormItem>

        <FormItem
          label="新密码："
          hasFeedback
          {...formItemLayout}>
          <Input {...newPasswordProps} type="password"
                  onContextMenu={this.noop} onPaste={this.noop} onCopy={this.noop} onCut={this.noop}
                  autoComplete="off"/>
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="确认密码："
          hasFeedback>
          <Input {...rePasswordProps} type="password" autoComplete="off" placeholder="两次输入密码保持一致"
            onContextMenu={this.noop} onPaste={this.noop} onCopy={this.noop} onCut={this.noop} />
        </FormItem>

        <FormItem wrapperCol={{ span: 14, offset: 6 }} style={{ marginTop: 24 }}>
          <Button type="primary" htmlType="submit">提交</Button>
        </FormItem>
      </Form>
    )
  }
}

UpdatePassword.propTypes = {
  user: PropTypes.object
}

UpdatePassword.contextTypes = {
  router: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired
}

UpdatePassword = Form.create()(UpdatePassword)

function mapStateToProps(state) {
  const {user}  = state
  return {
    user: user
  }
}

function mapDispatchToProps(dispatch) {
  return {
    updatePassword: bindActionCreators(updatePassword, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdatePassword)
