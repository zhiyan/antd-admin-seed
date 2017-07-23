import React, { PropTypes } from 'react'
import { Form, Input, Button, notification, Checkbox, Radio, Upload, Icon, Col } from 'antd'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { addEquip, getEquip, editEquip } from '../../actions/equip'

const FormItem = Form.Item
const CheckboxGroup = Checkbox.Group
const RadioButton = Radio.Button
const RadioGroup = Radio.Group
const InputGroup = Input.Group

class EquipAdd extends React.Component {

  constructor (props) {
    super(props)

    this.state = {
      components : []
    }
  }

  componentWillMount(){

    if(typeof this.props.routeParams.id !== 'undefined'){
      this.props.getEquip(this.props.routeParams.id, (res) => {
        if(res.ret){
          this.props.form.setFieldsValue(res.data)
          this.setState({
            'components' : res.data.components || []
          })
        }
      })
    }
  }

  componentWillReceiveProps(nextProps) {

  }

  addComponent(){
    const components = this.state.components
    this.setState({
      components: components.concat({})
    })
  }

  handleSubmit(e){
    e.preventDefault()
    this.props.form.validateFields((errors, values) => {
      let action = this.props.routeParams.id ? this.props.editEquip : this.props.addEquip

      if (!errors) {
        // const dataFile = document.getElementById('dataFile').files[0]
        const params = this.props.routeParams.id ? {...values, id:this.props.routeParams.id } : {...values}

        const notEmpty = (value='') => !((value+'').replace(/\s/g, '') === '')
        
        const isComponentValid = item => {
          return notEmpty(item.lifeDays) && notEmpty(item.cName) && notEmpty(item.eName) && notEmpty(item.showOrder)
        }

        if(this.state.components.length){
          params.components = this.state.components.filter((item, key) => isComponentValid(item))
          if(params.components.length !== this.state.components.length){
            notification.warning({
              message: '滤芯组件属性不能为空'
            })
            return false
          }
          params.components = JSON.stringify(params.components)
        }

        // if(dataFile){
        //   params.dataFile = dataFile
        // }
        
        action(params, (res)=>{
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

  changeComponent(value,key,name){
    const components = this.state.components 
    components[key][name] = value
    this.setState({
      components
    })
  }

  removeComponent(key){
    this.state.components.splice(key, 1)
    this.setState({
      components:this.state.components
    })
  }

  render () {
    const { getFieldProps } = this.props.form

    const equipNameProps = getFieldProps('equipName', {
      rules: [
        { required: true, message: '请输入设备名称' },
      ]
    })

    const dataFileProps = getFieldProps('dataFile', {
      rules: [
        { message: '请导入设备文件' },
      ]
    })

    const equipTypeProps = getFieldProps('equipType', {
      rules: [
        { required: true, message: '请输入设备型号' },
      ]
    })

    const productTypeProps = getFieldProps('productType', {
      initialValue: 1,
      rules: [
        { required: true, message: '不能为空', type:'number' },
      ]
    })

    const workModeProps = getFieldProps('workMode', {
      initialValue:1,
      rules: [
        { required: true, message: '请选择工作模式', type: 'integer' },
      ]
    })

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    }

    const inputStyle = {
      width:320
    }

    return (
      <Form horizontal onSubmit={this.handleSubmit.bind(this)} style={{width:850}}>
        <FormItem
          label="设备名称："
          hasFeedback
          {...formItemLayout}>
          <Input {...equipNameProps} style={inputStyle}/>
        </FormItem>

        <FormItem
          label="设备型号："
          {...formItemLayout}>
          <Input  {...equipTypeProps} style={inputStyle}/>
        </FormItem>

        <FormItem
          label="产品类型："
          {...formItemLayout}>
          <RadioGroup {...productTypeProps}>
            <RadioButton value={1}>按天购水</RadioButton>
            <RadioButton value={2}>按量购水</RadioButton>
          </RadioGroup>
        </FormItem>

        <FormItem
          label="工作模式："
          {...formItemLayout}>
          <RadioGroup {...workModeProps}>
            <RadioButton value={1}>售出模式</RadioButton>
            <RadioButton value={2}>租赁模式</RadioButton>
          </RadioGroup>
        </FormItem>

        <FormItem
          label="滤芯组件："
          {...formItemLayout}>
          {this.state.components.map((component, key) => <InputGroup key={key} style={{'marginBottom':'10px'}}>
            <Col span="5">
              <Input type="text" placeholder="英文简称" value={component.eName} onChange={event => this.changeComponent(event.target.value, key,'eName')}/>
            </Col>
            <Col span="5">
              <Input type="text" placeholder="中文简称" value={component.cName} onChange={event => this.changeComponent(event.target.value, key,'cName')}/>
            </Col>
            <Col span="6">
              <Input type="text" placeholder="滤芯寿命(天)" value={component.lifeDays} onChange={event => this.changeComponent(event.target.value, key,'lifeDays')}/>
            </Col>
            <Col span="6">
              <Input type="text" placeholder="客户端显示顺序" value={component.showOrder} onChange={event => this.changeComponent(event.target.value, key,'showOrder')}/>
            </Col>
            <Col span="2">
              <a href="javascript:void(0)" onClick={this.removeComponent.bind(this,key)}>删除</a>
            </Col>
          </InputGroup>)}
          <a href="javascript:void(0)" className="add-btn" onClick={this.addComponent.bind(this)}>+ 新增</a>
        </FormItem>

        <FormItem wrapperCol={{ span: 14, offset: 6 }} style={{ marginTop: 24 }}>
          <Button type="primary" htmlType="submit" style={inputStyle}>提交</Button>
        </FormItem>
      </Form>
    )
  }
}

EquipAdd.propTypes = {
  user: PropTypes.object
}

EquipAdd.contextTypes = {
  router: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired
}

EquipAdd = Form.create()(EquipAdd)

function mapStateToProps(state) {
  const {equip}  = state
  return {
    equip: equip
  }
}

function mapDispatchToProps(dispatch) {
  return {
    addEquip: bindActionCreators(addEquip, dispatch),
    getEquip: bindActionCreators(getEquip, dispatch),
    editEquip:bindActionCreators(editEquip, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EquipAdd)
