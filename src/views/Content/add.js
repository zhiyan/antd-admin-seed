import React, { PropTypes } from 'react'
import { Form, Input, Button, notification, Upload, Icon, InputNumber, Select } from 'antd'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { addContent, getContent, editContent } from '../../actions/content'

const FormItem = Form.Item
const Option = Select.Option

class ContentAdd extends React.Component {

  editorObj: null

  // 封面图地址
  imgUrl: ''

  constructor (props) {
    super(props)
  }

  componentWillMount(){
    if(typeof this.props.routeParams.id !== 'undefined'){
      this.props.getContent(this.props.routeParams.id, (res) => {
        if(res.ret){
          this.props.form.setFieldsValue(res.data)
          this.imgUrl = res.data.imgUrl
        }else{
            notification.error({
              message: res.errmsg
            })
          }
      })
    }
  }

  componentDidMount(){
    this.editorObj = CKEDITOR.replace('content', {
      // filebrowserBrowseUrl: '/api/browser',
      filebrowserUploadUrl: '/api/content/image'
    })
  }

  componentWillReceiveProps(nextProps) {
    // console.log(nextProps)
  }

  handleSubmit(e){
    e.preventDefault()
    this.props.form.validateFields((errors, values) => {
      let action = this.props.routeParams.id ? this.props.editContent : this.props.addContent
      let params = {...values, content: this.editorObj.getData(), synopsis:this.editorObj.document.getBody().getText().substring(0,100),imgUrl: this.imgUrl}

      params.province = +params.province

      if (!errors) {
        action(this.props.routeParams.id ? {...params, uid:this.props.routeParams.id} : params, (res)=>{
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

  /**
   * 上传封面图
   */
  handleUpload(info){
    if(info.file && info.file.status === 'done' && info.file.response.ret){
      this.imgUrl = info.file.response.data.url
    }
  }

  noop(){
    return false
  }

  render () {
    const { getFieldProps } = this.props.form

    const titleProps = getFieldProps('title', {
      rules: [
        { required: true, message: '请输入标题' },
      ]
    })

    const upperLimitProps = getFieldProps('upperLimit')

    const contentProps = getFieldProps('content')

    const provinceProps = getFieldProps('province')

    const coverProps = {
      action: '/api/content/image',
      onChange: this.handleUpload.bind(this),
      listType: 'picture',
      name: 'upload'
    }

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    }

    return (
      <Form horizontal onSubmit={this.handleSubmit.bind(this)} style={{width:800}}>
        <FormItem
          label="标题："
          hasFeedback
          {...formItemLayout}>
          <Input {...titleProps}/>
        </FormItem>

        <FormItem
          label="使用耗材百分比："
          {...formItemLayout}>
          <InputNumber {...upperLimitProps} min={0} max={100}/>
        </FormItem>

        <FormItem
          label="省份："
          {...formItemLayout}>
          <Select placeholder="请选择城市" {...provinceProps} style={{ width: 190 }}>
            {this.props.province.list.map((item, key) => <Option value={item.id + ''} key={key}>{item.name}</Option>)}
          </Select>
        </FormItem>

        <FormItem
          label="封面图"
          {...formItemLayout}
          help=""
        >
          <Upload {...coverProps}>
            <Button type="ghost">
              <Icon type="upload" /> 点击上传
            </Button>
          </Upload>
        </FormItem>

        <FormItem
          label="内容："
          {...formItemLayout}>
          <Input type="textarea" rows={4} {...contentProps}/>
        </FormItem>

        <FormItem wrapperCol={{ span: 14, offset: 6 }} style={{ marginTop: 24 }}>
          <Button type="primary" htmlType="submit">提交</Button>
        </FormItem>
      </Form>
    )
  }
}

ContentAdd.propTypes = {
}

ContentAdd.contextTypes = {
  router: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired
}

ContentAdd = Form.create()(ContentAdd)

function mapStateToProps(state) {
  const {province} = state
  return {
    province
  }
}

function mapDispatchToProps(dispatch) {
  return {
    addContent: bindActionCreators(addContent, dispatch),
    getContent: bindActionCreators(getContent, dispatch),
    editContent:bindActionCreators(editContent, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ContentAdd)
