import React, { PropTypes } from 'react'
import { Form, Input, Button, notification, Checkbox, InputNumber, Radio, Select } from 'antd'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { addProduct, getProduct, editProduct } from '../../actions/product'
import { getEquipList } from '../../actions/equip'

const FormItem = Form.Item
const CheckboxGroup = Checkbox.Group
const RadioButton = Radio.Button
const RadioGroup = Radio.Group
const Option = Select.Option

class ProductAdd extends React.Component {

  constructor (props) {
    super(props)

    this.state = {
      productType: 0
    }
  }

  componentWillMount(){
    if(typeof this.props.routeParams.id !== 'undefined'){
      this.props.getProduct(this.props.routeParams.id, (res) => {
        if(res.ret){
          res.data.price = res.data.price + ''
          res.data.category = res.data.category + ''
          this.props.form.setFieldsValue(res.data)
        }
      })
    }

    this.props.getEquipList(1,500)
  }

  componentWillReceiveProps(nextProps) {
    if(typeof this.props.routeParams.id !== 'undefined'&& nextProps.equip.list.list && nextProps.equip.list.list.length && nextProps.equip.list.list !== this.props.equip.list.list ){
      setTimeout(() => {
        this.changeCategoryHandler(this.props.form.getFieldValue('category'))
      }, 500)
    }
  }

  handleSubmit(e){
    e.preventDefault()
    this.props.form.validateFields((errors, values) => {
      let action = this.props.routeParams.id ? this.props.editProduct : this.props.addProduct
      const data = this.props.routeParams.id ? {...values, product:this.props.routeParams.id} : {...values}

      if(data.category){
        data.category = +data.category
      }
      if (!errors) {
        action(data, (res)=>{
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

  changeCategoryHandler(category){
    const productType = this.props.equip.list.list.filter(item => item.id === +category)[0].productType
    this.setState({
      productType: productType
    })
    let productUnit = this.props.form.getFieldValue('productUnit')
    if(productType === 1 && productUnit > 3 ){
      productUnit = 1
    }
    if(productType === 2 && productUnit !== 4){
      productUnit = 4
    }
    this.props.form.setFieldsValue({productUnit,category})
  }

  render () {
    const { getFieldProps, getFieldValue} = this.props.form

    const goodValueProps = getFieldProps('goodValue', {
      initialValue:0,
      rules: [
        { required: true, message: '数值不能为空', type: 'integer' },
      ]
    })

    const priceProps = getFieldProps('price', {
      rules: [
        { required: true, message: '请输入价格' },
      ]
    })

    const productUnitProps = getFieldProps('productUnit', {
      initialValue: 1,
      rules: [
        { required: true, message: '不能为空', type:'number' },
      ]
    })

    const categoryProps = getFieldProps('category', {
      rules: [
        { required: true, message: '请选择设备品牌' },
      ]
    })

    const textProps = getFieldProps('text', {
      rules: [
        { required: true, message: '产品名称' },
      ]
    })

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    }

    return (
      <Form horizontal onSubmit={this.handleSubmit.bind(this)}>

        <FormItem
          label="设备品牌"
          {...formItemLayout}>
          <Select {...categoryProps} placeholder="请选择设备品牌" style={{ width: 190 }} onChange={this.changeCategoryHandler.bind(this)}>
            {this.props.equip.list.list && this.props.equip.list.list.map((item, key) => <Option value={item.id + ''} key={key}>{item.equipName}</Option>)}
          </Select>
        </FormItem>

        <FormItem
          label="产品名称："
          {...formItemLayout}>
          <Input  {...textProps}/>
        </FormItem>

        <FormItem
          label="购买到的数值："
          hasFeedback
          {...formItemLayout}>
          <InputNumber min={0} {...goodValueProps}/>
        </FormItem>

        <FormItem
          label="价格："
          {...formItemLayout}>
          <Input type="number"  {...priceProps}/>
        </FormItem>

        <FormItem
          label="单位："
          {...formItemLayout}>
          <RadioGroup {...productUnitProps}>
            <RadioButton value={1} disabled={this.state.productType === 2 || this.state.productType === 0}>日</RadioButton>
            <RadioButton value={2} disabled={this.state.productType === 2 || this.state.productType === 0}>月</RadioButton>
            <RadioButton value={3} disabled={this.state.productType === 2 || this.state.productType === 0}>年</RadioButton>
            <RadioButton value={4}  disabled={this.state.productType === 1 || this.state.productType === 0}>升</RadioButton>
          </RadioGroup>
        </FormItem>

        <FormItem wrapperCol={{ span: 14, offset: 6 }} style={{ marginTop: 24 }}>
          <Button type="primary" htmlType="submit">提交</Button>
        </FormItem>
      </Form>
    )
  }
}

ProductAdd.propTypes = {
  user: PropTypes.object
}

ProductAdd.contextTypes = {
  router: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired
}

ProductAdd = Form.create()(ProductAdd)

function mapStateToProps(state) {
  const {user, equip}  = state
  return {
    user,
    equip
  }
}

function mapDispatchToProps(dispatch) {
  return {
    addProduct: bindActionCreators(addProduct, dispatch),
    getProduct: bindActionCreators(getProduct, dispatch),
    editProduct:bindActionCreators(editProduct, dispatch),
    getEquipList:bindActionCreators(getEquipList, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductAdd)
