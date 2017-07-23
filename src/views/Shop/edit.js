import React, { PropTypes } from 'react'
import { Form, Input, Button, notification, Modal } from 'antd'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { offlineShop, getShop, editShop, addShop } from '../../actions/shop'

const FormItem = Form.Item
const confirm = Modal.confirm

class ShopEdit extends React.Component {

  constructor (props) {
    super(props)

    this.id = ''
  }

  componentWillMount(){

    if(!this.id){
      this.props.getShop(this.id, (res) => {
        if(res.ret){
          this.id = res.data.id
          this.props.form.setFieldsValue(res.data)
        }
      })
    }
  }

  goSuccess(){
    this.context.router.replace('/shop/success')
  }

  handleSubmit(e){
    e.preventDefault()
    this.props.form.validateFields((errors, values) => {
      let action = this.id ? this.props.editShop : this.props.addShop

      if (!errors) {
        action(this.id ? {...values,id:this.id} : values, (res)=>{
          if(res.ret){
            notification.success({
              message: '操作成功'
            })
            this.goSuccess()
          }else{
            notification.error({
              message: res.errmsg
            })
          }
        })
      }
    })
  }

  offlineHandler(){
    let that = this
    confirm({
      title: '您是否确认要下线该商店？',
      onOk() {
        return new Promise((resolve) => {
          that.props.offlineShop(that.id, function(res){
            if(res.ret){
              notification.success({
                message: '操作成功'
              })
              that.props.form.setFieldsValue({'shopAccount':'','shopUrl':''})
              that.id = ''
              that.goSuccess()
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
    const { getFieldProps } = this.props.form

    const shopAccountProps = getFieldProps('shopAccount', {
      rules: [
        { required: true, message: '请输入商店名称' },
      ]
    })

    const shopUrlProps = getFieldProps('shopUrl', {
      rules: [
        { required: true, message: '请输入商店url地址' },
      ]
    })

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    }

    return (
      <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
        <FormItem
          label="商店名称："
          hasFeedback
          {...formItemLayout}>
          <Input {...shopAccountProps}/>
        </FormItem>

        <FormItem
          label="商店地址："
          hasFeedback
          {...formItemLayout}>
          <Input  {...shopUrlProps}/>
        </FormItem>

        <FormItem wrapperCol={{ span: 14, offset: 6 }} style={{ marginTop: 24 }}>
          <Button type="primary" htmlType="submit" style={{marginBottom:12}}>提交</Button>
          <Button onClick={this.offlineHandler.bind(this)}>商店下线</Button>
        </FormItem>
      </Form>
    )
  }
}

ShopEdit.propTypes = {
  // shop: PropTypes.object
}

ShopEdit.contextTypes = {
  router: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired
}

ShopEdit = Form.create()(ShopEdit)

function mapStateToProps(state) {
  return {
  }
}

function mapDispatchToProps(dispatch) {
  return {
    addShop: bindActionCreators(addShop, dispatch),
    getShop: bindActionCreators(getShop, dispatch),
    editShop:bindActionCreators(editShop, dispatch),
    offlineShop:bindActionCreators(offlineShop, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShopEdit)
