import React, { PropTypes } from 'react'
import { Form, Input, Button, notification, Checkbox, Select } from 'antd'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { addRent, getRent, editRent } from '../../actions/rent'
import { getDistrict } from '../../actions/province'

const FormItem = Form.Item
const CheckboxGroup = Checkbox.Group
const Option = Select.Option

class RentAdd extends React.Component {

  constructor (props) {
    super(props)

    this.state = {
      citys : [],
      districts : []
    }
  }

  componentWillMount(){

    if(typeof this.props.routeParams.id !== 'undefined'){
      this.props.getRent(this.props.routeParams.id, (res) => {
        if(res.ret){
          if(res.data.province && res.data.city){
            res.data.province += ''
            res.data.city += ''
            res.data.district += ''

            this.handleProvinceChange(res.data.province)
            this.handleDistrict(res.data.city)
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
      let action = this.props.routeParams.id ? this.props.editRent : this.props.addRent

      const data = this.props.routeParams.id ? {...values, id:this.props.routeParams.id} : {...values}

      data.province = +data.province
      data.city = +data.city
      data.district = +data.district

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

  handleProvinceChange(provinceId){
    const data = this.props.province.list.filter(item => item.id === +provinceId)
    this.props.form.setFieldsValue({'province' : provinceId})
    this.props.form.setFieldsValue({'city' : undefined})
    this.setState({
      citys: data[0].citys
    })
  }

  handleDistrict(cityCode){
    let code = +cityCode
    this.props.getDistrict(code, (res) => {
      if(res.ret && res.data){
        this.setState({
          districts: res.data
        })
      }
    })
  }

  handleCityChange(cityCode){
    let code = +cityCode
    this.props.getDistrict(code, (res) => {
      if(res.ret && res.data){
        this.setState({
          districts: res.data
        })
        this.props.form.setFieldsValue({'city' :  cityCode})
        this.props.form.setFieldsValue({'district' : undefined})
      }
    })
  }

  render () {
    const { getFieldProps } = this.props.form

    const eidProps = getFieldProps('eid', {
      rules: [
        { required: true, message: '设备号' },
      ]
    })

    const equipNameProps = getFieldProps('equipName', {
      rules: [
        { required: true, message: '请输入设备名称' },
      ]
    })

    const remarkProps = getFieldProps('remark', {
      rules: [
        { message: '请输入备注' },
      ]
    })

    const provinceProps = getFieldProps('province', {
      rules: [
        { required: true, message: '请选择省份信息' },
      ]
    })

    const cityProps = getFieldProps('city', {
      rules: [
        { required: true, message: '请选择城市信息' },
      ]
    })

    const districtProps = getFieldProps('district', {
      rules: [
        { required: true, message: '请选择区县信息' },
      ]
    })

    const renterAddressProps = getFieldProps('renterAddress', {
      rules: [
        { required: true, message: '请输入用户地址' },
      ]
    })

    const renterMobileProps = getFieldProps('renterMobile', {
      rules: [
        { required: true, message: '请输入用户手机号' },
      ]
    })

    const renterNameProps = getFieldProps('renterName', {
      rules: [
        { required: true, message: '请输入用户姓名' },
      ]
    })

    const staffNameProps = getFieldProps('staffName', {
      rules: [
        { required: true, message: '请输入销售人员' },
      ]
    })

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    }

    return (
      <Form horizontal onSubmit={this.handleSubmit.bind(this)}>
        <FormItem
          label="设备号："
          hasFeedback
          {...formItemLayout}>
          <Input {...eidProps}/>
        </FormItem>

        <FormItem
          label="设备名称："
          {...formItemLayout}>
          <Input  {...equipNameProps}/>
        </FormItem>

        <FormItem
          label="省份："
          {...formItemLayout}>
          <Select  {...provinceProps} style={{ width: 190 }} onChange={this.handleProvinceChange.bind(this)} placeholder="请选择省份">
            {this.props.province.list.map((item, key) => <Option value={item.id + ''} key={key}>{item.name}</Option>)}
          </Select>
        </FormItem>

        <FormItem
          label="城市："
          {...formItemLayout}>
          <Select {...cityProps} style={{ width: 190 }} onChange={this.handleCityChange.bind(this)} placeholder="请选择城市">
            {this.state.citys.map((item, key) => <Option value={item.id + ''} key={key}>{item.name}</Option>)}
          </Select>
        </FormItem>

        <FormItem
            label="区县："
            {...formItemLayout}>
          <Select {...districtProps} style={{ width: 190 }} placeholder="请选择城市">
            {this.state.districts.map((item, key) => <Option value={item.code + ''} key={key}>{item.districtName}</Option>)}
          </Select>
        </FormItem>

        <FormItem
          label="用户地址："
          {...formItemLayout}>
          <Input  {...renterAddressProps}/>
        </FormItem>

        <FormItem
          label="用户手机号："
          {...formItemLayout}>
          <Input  {...renterMobileProps}/>
        </FormItem>

        <FormItem
          label="用户姓名："
          {...formItemLayout}>
          <Input  {...renterNameProps}/>
        </FormItem>

        <FormItem
          label="销售人员："
          {...formItemLayout}>
          <Input  {...staffNameProps}/>
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

RentAdd.propTypes = {
  user: PropTypes.object
}

RentAdd.contextTypes = {
  router: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired
}

RentAdd = Form.create()(RentAdd)

function mapStateToProps(state) {
  const {user, province}  = state
  return {
    user,
    province
  }
}

function mapDispatchToProps(dispatch) {
  return {
    addRent: bindActionCreators(addRent, dispatch),
    getRent: bindActionCreators(getRent, dispatch),
    editRent:bindActionCreators(editRent, dispatch),
    getDistrict : bindActionCreators(getDistrict, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RentAdd)
