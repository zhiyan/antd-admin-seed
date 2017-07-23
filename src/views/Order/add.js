import React, { PropTypes } from 'react'
import { Form, Input, Button, notification, Checkbox, Select, InputNumber, Radio, Modal } from 'antd'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { addOrder, getOrder } from '../../actions/order'

const FormItem = Form.Item
const CheckboxGroup = Checkbox.Group
const Option = Select.Option
const RadioButton = Radio.Button
const RadioGroup = Radio.Group
const confirm = Modal.confirm

class OrderAdd extends React.Component {

  constructor (props) {
    super(props)

    this.state = {
      citys : []
    }
  }

  componentWillMount(){

    if(typeof this.props.routeParams.eid !== 'undefined'){
      this.props.form.setFieldsValue({
        'eid': this.props.routeParams.eid
      })
    }

    if(typeof this.props.routeParams.id !== 'undefined'){
      this.props.getOrder(this.props.routeParams.id, (res) => {
        if(res.ret){
          if(res.data.province && res.data.city){
            res.data.province += ''
            res.data.city += ''
            this.handleProvinceChange(res.data.province)
          }else{
            delete res.data.province
            delete res.data.city
          }
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
      let action = this.props.addOrder

      if (!errors) {
        confirm({
          title: '请确认数据正确，添加后无法修改， 添加完成后会实时给用户充值！',
          onOk() {
            return new Promise((resolve) => {
              action({...values}, function(res){
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
    })
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
    const { getFieldProps } = this.props.form

    const amountProps = getFieldProps('amount', {
      initialValue:0,
      rules: [
        { required: true, message: '请输入缴费金额', type: 'number' },
      ]
    })

    const eidProps = getFieldProps('eid', {
      rules: [
        { required: true, message: '请输入设备eid' },
      ]
    })

    const goodValueProps = getFieldProps('goodValue', {
      initialValue:0,
      rules: [
        { required: true, message: '请输入充值数值', type: 'integer' },
      ]
    })

    const productTypeProps = getFieldProps('productType', {
      initialValue: 1,
      rules: [
        { required: true, message: '请选择产品类型', type: 'number' },
      ]
    })

    const remarkProps = getFieldProps('remark', {
      rules: [
        { required: true, message: '请输入备注'},
      ]
    })

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    }

    return (
      <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
        <FormItem
          label="缴费金额："
          hasFeedback
          {...formItemLayout}>
          <InputNumber  {...amountProps} min={1} step={0.01} />
        </FormItem>

        <FormItem
          label="设备eid："
          {...formItemLayout}>
          <Input  {...eidProps}/>
        </FormItem>

        <FormItem
          label="充值数值："
          hasFeedback
          {...formItemLayout}>
          <InputNumber {...goodValueProps} min={0} />
        </FormItem>

         <FormItem
          label="产品类型："
          {...formItemLayout}>
          <RadioGroup {...productTypeProps}>
            <RadioButton value={1}>按天</RadioButton>
            <RadioButton value={2}>按量</RadioButton>
          </RadioGroup>
        </FormItem>

        <FormItem
          label="备注："
          {...formItemLayout}>
          <Input  {...remarkProps}/>
        </FormItem>

        <FormItem wrapperCol={{ span: 14, offset: 6 }} style={{ marginTop: 24 }}>
          <Button type="primary" htmlType="submit">提交</Button>
        </FormItem>
      </Form>
    )
  }
}

OrderAdd.propTypes = {
  user: PropTypes.object
}

OrderAdd.contextTypes = {
  router: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired
}

OrderAdd = Form.create()(OrderAdd)

function mapStateToProps(state) {
  const {user}  = state
  return {
    user
  }
}

function mapDispatchToProps(dispatch) {
  return {
    addOrder: bindActionCreators(addOrder, dispatch),
    getOrder: bindActionCreators(getOrder, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderAdd)
