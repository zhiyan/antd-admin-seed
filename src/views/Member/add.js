import React, { PropTypes } from 'react'
import { Form, Input, Button, notification, Checkbox, Select } from 'antd'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { addMember, getMember, editMember } from '../../actions/member'
import { getDistrict } from '../../actions/province'

const FormItem = Form.Item
const CheckboxGroup = Checkbox.Group
const Option = Select.Option

class MemberAdd extends React.Component {

  constructor (props) {
    super(props)

    this.state = {
      citys : [],
      districts : []
    }
  }

  componentWillMount(){
    if(typeof this.props.routeParams.id !== 'undefined'){
      this.props.getMember(this.props.routeParams.id, (res) => {
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
      let action = this.props.routeParams.id ? this.props.editMember : this.props.addMember

      if (!errors) {
        const data = this.props.routeParams.id ? {...values,roles: this.roles, id:this.props.routeParams.id} : {...values, roles: this.roles}

        data.province = +data.province
        data.city = +data.city
        data.district = +data.district

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

  noop(){
    return false
  }

  roles:[]

  changeRoles(value){
    this.roles = value
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

    const companyAccountProps = getFieldProps('companyAccount', {
      rules: [
        { required: true, message: '请输入账户名称' },
      ]
    })

    const companyAddressProps = getFieldProps('companyAddress', {
      rules: [
        { required: true, message: '请输入公司地址' },
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

    const companyContactProps = getFieldProps('companyContact', {
      rules: [
        { required: true, message: '请输入公司联系方式' },
      ]
    })

    const companyLeaderProps = getFieldProps('companyLeader', {
      rules: [
        { required: true, message: '请输入公司负责人' },
      ]
    })

    const companyNameProps = getFieldProps('companyName', {
      rules: [
        { required: true, message: '请输入公司名称' },
      ]
    })

    const companyPasswordProps = getFieldProps('companyPassword', {
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
          label="账户名称："
          hasFeedback
          {...formItemLayout}>
          <Input {...companyAccountProps}/>
        </FormItem>

        <FormItem
          label="公司地址："
          {...formItemLayout}>
          <Input {...companyAddressProps}/>
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
          <Select {...districtProps} style={{ width: 190 }} placeholder="请选择区县">
            {this.state.districts.map((item, key) => <Option value={item.code + ''} key={key}>{item.districtName}</Option>)}
          </Select>
        </FormItem>

        <FormItem
          label="公司联系方式："
          {...formItemLayout}>
          <Input  {...companyContactProps}/>
        </FormItem>

        <FormItem
          label="公司负责人："
          {...formItemLayout}>
          <Input  {...companyLeaderProps}/>
        </FormItem>

        <FormItem
          label="公司名称："
          {...formItemLayout}>
          <Input  {...companyNameProps}/>
        </FormItem>

        <FormItem
          label="权限："
          {...formItemLayout}>
          <CheckboxGroup options={this.props.user.roles}  onChange={this.changeRoles.bind(this)}/>
        </FormItem>

        <FormItem
          label="密码："
          {...formItemLayout}>
          <Input {...companyPasswordProps} type="password"
                  onContextMenu={this.noop} onPaste={this.noop} onCopy={this.noop} onCut={this.noop}
                  autoComplete="off"/>
        </FormItem>

        <FormItem wrapperCol={{ span: 14, offset: 6 }} style={{ marginTop: 24 }}>
          <Button type="primary" htmlType="submit">提交</Button>
        </FormItem>
      </Form>
    )
  }
}

MemberAdd.propTypes = {
  user: PropTypes.object
}

MemberAdd.contextTypes = {
  router: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired
}

MemberAdd = Form.create()(MemberAdd)

function mapStateToProps(state) {
  const {user, province}  = state
  return {
    user,
    province
  }
}

function mapDispatchToProps(dispatch) {
  return {
    addMember: bindActionCreators(addMember, dispatch),
    getMember: bindActionCreators(getMember, dispatch),
    editMember:bindActionCreators(editMember, dispatch),
    getDistrict : bindActionCreators(getDistrict, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MemberAdd)
