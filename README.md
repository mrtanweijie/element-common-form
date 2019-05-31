### 介绍
element-ui 通用表单组件

### 使用文档

**1、使用方法**

```
<common-form :form-option="formOption" :is-reset-form-flag="isResetFormFlag"></common-form>
```
接收的props:

**isResetFormFlag**：是否更新表单内容标志，用于触发更新表单的**formModel**

**formOption**：表单配置，下有详细配置说明

**isDisabled**：表单是否可编辑

**2、单一表单组配置**

```
{
  name: 'channel-form',
  data: {},
  items: [
    {
      label: '类型',
      name: 'type',
      type: 'select',
      dataList: [{
        index: 1,
        text: '相机'
      }, {
        index: 6,
        text: '其他'
      }]
    }
  ],
  rules: {
    name: [{ required: true, message: '请输入产品名称', trigger: 'blur' }]
  },
  btnList: [{
    text: '保存，下一步',
    type: 'primary',
    onClick: this.commitForm
  }]
}
 
```

**3、多表单组配置**

```
formOption: {
 name: 'channel-form',
 data: {},
 groups: [{
   title: '',// 组标题
   tips: ''// 组提示
   items: [] // 组表单项，和单一组配置一致
 }]
}
```
**4、配置文档**

| 节点 | 描述 | 类型 |是否必须|备注|
| ------------- |:-------------:| -----:| -----:| -----:|
| name| 表单名 | String|否|默认名 oa-form|
| data| 表单数据 | Object|否|用于编辑场景异步请求的表单填充数据|
| groups| 表单组 | Array|否|groups 和 items 不应该同时存在，groups 中包含了items，如果groups为空取外部的items渲染，groups不为空仅渲染groups组内容|
| items| 表单项 | Array|否|支持的type类型：输入框：input、textarea;多选框：checkbox;单选框：radio;下拉菜单：select|
| rules| 表单校验规则 | Object|否|节点名需要与items配置的name一一对应|
| btnList| 按钮列表 | Array|否|会在回调函数包含表单的数据及表单引用|



### License
MIT
