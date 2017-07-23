import React, { PropTypes } from 'react'
import { Form, Input, Button, notification, Checkbox, Select } from 'antd'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { addUpkeep, getUpkeep, editUpkeep } from '../../actions/upkeep'
import { getDistrict } from '../../actions/province'

const FormItem = Form.Item
const CheckboxGroup = Checkbox.Group
const Option = Select.Option

class UpkeepAdd extends React.Component {

  constructor (props) {
    super(props)

    this.state = {
      citys : [],
      districts : []
    }
  }

  componentWillMount(){

    if(typeof this.props.routeParams.id !== 'undefined'){
      this.props.getUpkeep(this.props.routeParams.id, (res) => {
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
      let action = this.props.routeParams.id ? this.props.editUpkeep : this.props.addUpkeep

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
    this.props.form.setFieldsValue({'district' : undefined})
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

    const addressProps = getFieldProps('address', {
      rules: [
        { required: true, message: '请输入地址信息' },
      ]
    })

    const contentProps = getFieldProps('content', {
      rules: [
        { required: true, message: '请输入维修内容' },
      ]
    })

    const eidProps = getFieldProps('eid', {
      rules: [
        { required: true, message: '请输入设备ID' },
      ]
    })

    const remarkProps = getFieldProps('remark', {
      rules: [
        { message: '请输入备注' },
      ]
    })

    const mobileProps = getFieldProps('mobile', {
      rules: [
        { required: true, message: '请输入报修电话' },
      ]
    })

    const servicemanProps = getFieldProps('serviceman')

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    }

    return (
      <Form horizontal onSubmit={this.handleSubmit.bind(this)}>


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
          label="地址信息："
          hasFeedback
          {...formItemLayout}>
          <Input {...addressProps}/>
        </FormItem>

        <FormItem
          label="维修内容："
          {...formItemLayout}>
          <Input  {...contentProps}/>
        </FormItem>

        <FormItem
          label="设备ID："
          {...formItemLayout}>
          <Input  {...eidProps}/>
        </FormItem>

        <FormItem
          label="报修电话："
          {...formItemLayout}>
          <Input  {...mobileProps}/>
        </FormItem>

        <FormItem
          label="备注："
          {...formItemLayout}>
          <Input  {...remarkProps}/>
        </FormItem>

        <FormItem
          label="维修人员："
          {...formItemLayout}>
          <Input  {...servicemanProps}/>
        </FormItem>

        <FormItem wrapperCol={{ span: 14, offset: 6 }} style={{ marginTop: 24 }}>
          <Button type="primary" htmlType="submit">提交</Button>
        </FormItem>
      </Form>
    )
  }
}

UpkeepAdd.propTypes = {
  user: PropTypes.object
}

UpkeepAdd.contextTypes = {
  router: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired
}

UpkeepAdd = Form.create()(UpkeepAdd)

function mapStateToProps(state) {
  const {user, province}  = state
  return {
    user,
    province
  }
}

function mapDispatchToProps(dispatch) {
  return {
    addUpkeep: bindActionCreators(addUpkeep, dispatch),
    getUpkeep: bindActionCreators(getUpkeep, dispatch),
    editUpkeep:bindActionCreators(editUpkeep, dispatch),
    getDistrict : bindActionCreators(getDistrict, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UpkeepAdd)
