<script>
export default {
  name: 'EleCommonForm',
  props: {
    // 是否更新表单内容标志，用于触发更新表单的formModel
    isResetFormFlag: {
      type: Boolean,
      default: false
    },
    // 表单配置,文档见wiki
    formOption: {
      type: Object,
      default: _ => ({})
    },
    // 是否可编辑
    isDisabled: {
      type: Boolean,
      default: false
    },
    inline: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      formModel: {},
      defaultStyle: 'width: 300px',
      dialogImgVisible: false,
      viewImg: ''
    }
  },
  computed: {
    formName () {
      return this.formOption.name || 'oa-form'
    },
    // 是否是表单组
    isGroup () {
      return this.formOption.groups && this.formOption.groups.length > 0
    }
  },
  watch: {
    isResetFormFlag () {
      this.formModelProcess()
    }
  },
  mounted () {
    this.formModelProcess()
  },
  methods: {
    // 表单Form节点数据处理
    formModelProcess () {
      let formObj = {}
      if (!this.formOption.data) {
        return
      }
      this.getFormItems().forEach((e) => {
        let nameVal = e.name
        if (!nameVal) {
          console.error('[oa form warn]: 存在未配置name或者name为空的表单项')
          return
        }
        // render 类型不添加属性,使用外部属性
        if (e.type === 'render') {
          return
        }
        formObj[nameVal] = this.checkValue(this.formOption.data[nameVal]) ? this.formOption.data[nameVal] : this.getItemDefaultValue(e)
      })
      this.formModel = Object.assign({}, formObj)
    },
    // 值为空判断
    checkValue (val) {
      return val || val === 0
    },
    getFormItems () {
      if (this.isGroup) {
        let groupItems = []
        this.formOption.groups.forEach(group => {
          groupItems = groupItems.concat(group.items || [])
        })
        return groupItems
      }
      return this.formOption.items || []
    },
    // 默认值
    getItemDefaultValue (item) {
      return item.value ? item.value : item.type === 'checkbox' ? [] : ''
    },
    // 生成列表
    generateList (itemObj) {
      let itemEle = []
      for (let index = 0; index < itemObj.dataList.length; index++) {
        const item = itemObj.dataList[index]
        switch (itemObj.type) {
          // 下拉菜单
          case 'select':
            itemEle.push(<el-option key={ item.index } label={ item.text } value={ item.index }></el-option>)
            break
          // 多选框
          case 'checkbox':
            itemEle.push(<el-checkbox label={ item.index }>{ item.text }</el-checkbox>)
            break
          // 单选框
          case 'radio':
            itemEle.push(<el-radio label={ item.index }>{ item.text }</el-radio>)
            break
        }
      }
      return itemEle
    },
    // 生成下拉菜单
    generateSelect (item) {
      return <el-select v-model={ this.formModel[item.name] } style={ item.style || this.defaultStyle }>{ this.generateList(item) }</el-select>
    },
    // 生成多选框
    generateCheckbox (item) {
      return <el-checkbox-group v-model={ this.formModel[item.name] }>{ this.generateList(item) }</el-checkbox-group>
    },
    // 生成单选
    generateRadio (item) {
      return <div class="oa-form-item">
        <el-radio-group v-model={ this.formModel[item.name] }>{ this.generateList(item) }</el-radio-group>
        { this.generateShowImg(item) }
      </div>
    },
    // 生成输入框
    generateInput (item) {
      let ele = []
      // 提示位置：默认右侧，bottom表示提示位置在输入框底部
      if (item.tipsType === 'bottom') {
        ele.push(<p class="title-tips item-tips-bottom">{ item.tips }</p>)
      } else {
        ele.push(<label class="title-tips">{ item.tips }</label>)
      }
      return <div class="oa-form-item">
        <el-input v-model={ this.formModel[item.name] } type={ item.type } disabled={ item.disabled } autosize={ item.autosize } style={ item.style || this.defaultStyle }></el-input>
        { this.generateShowImg(item) }
        { ele }
      </div>
    },
    // 生成位置预览
    generateShowImg (item) {
      return item.viewImg ? <span class="show-img" on-click={ () => { this.viewImg = item.viewImg; this.dialogImgVisible = true }}>位置预览</span> : ''
    },
    // 分组
    generateGroup () {
      let groupsEle = []
      this.formOption.groups.forEach(group => {
        groupsEle.push(<section class="section">
          <h4 class="section-title">{ group.title }<span class="title-tips">{ group.tips }</span></h4>
          { this.generateFormItems(group.items) }
        </section>)
      })
      return groupsEle
    },
    // 生成表单项
    generateFormItems (items = []) {
      let ele = []
      items.forEach((item) => {
        let itemEle = ''
        switch (item.type) {
          // 外部自定义
          case 'render':
            itemEle = item.render()
            break
          // 下拉菜单
          case 'select':
            itemEle = this.generateSelect(item)
            break
          // 多选框
          case 'checkbox':
            itemEle = this.generateCheckbox(item)
            break
          // 单选框
          case 'radio':
            itemEle = this.generateRadio(item)
            break
          // 输入框
          default:
            itemEle = this.generateInput(item)
            break
        }
        ele.push(<el-form-item label={ item.label } prop={ item.name } label-width={ item.labelWidth } >{ itemEle }</el-form-item>)
      })
      return ele
    },
    // 按钮列表
    generateBtnList () {
      if (!this.formOption.btnList || this.formOption.btnList.length === 0) {
        console.error('[oa form warn]: 未配置表单按钮')
        return
      }
      let btnListEle = []
      this.formOption.btnList.forEach((btn) => {
        btnListEle.push(<el-button type={ btn.type } on-click={ () => { btn.onClick(this.$refs[this.formName], this.formModel) } }>{ btn.text }</el-button>)
      })
      return btnListEle
    }
  },
  render (h) {
    let ele = []
    // 表单内容
    if (this.isGroup) {
      ele = this.generateGroup()
    } else {
      ele = this.generateFormItems(this.formOption.items)
    }
    return (
      <div class="oa-form-container">
        <el-form ref={ this.formName } model={ this.formModel } rules={ this.formOption.rules } inline={ this.inline } disabled={ this.isDisabled } label-width={ this.formOption.labelWidth || '150px'}>
          { ele }
          <el-form-item label-width={ this.isGroup ? '0' : this.formOption.labelWidth}>
            { this.generateBtnList() }
            <label class="title-tips">{ this.formOption.btnTips || '' }</label>
          </el-form-item>
        </el-form>
        <el-dialog title="配置位置预览图" visible={ this.dialogImgVisible } {...{on: {'update:visible': (val) => { this.dialogImgVisible = val }}}} width="700px">
          <div class="center">
            <img src={ this.viewImg } class="max-width-100"></img>
          </div>
        </el-dialog>
      </div>
    )
  }
}
</script>

<style lang="less" scoped>
.oa-form-container {
  .section {
    background: #fff;
    padding: 15px 20px;
    margin: 20px auto;
    border: 1px solid #eee;
    border-radius: 4px;
  }
  .section-title {
    padding-bottom: 15px;
    margin-bottom: 15px;
    border-bottom: 1px solid #eee;
  }
  .title-tips {
    font-size: 14px;
    font-weight: 500;
    line-height: 28px;
    vertical-align: middle;
    color: #999;
    margin-left: 20px;
  }
  .oa-form-item {
    .item-tips-bottom {
       margin-top: 5px;
       margin-left: 0px;
    }
    .show-img {
      cursor: pointer;
      color: #409EFF;
      margin-left: 10px;
    }
  }
  .center {
    text-align: center;
  }
  .max-width-100 {
    max-width: 100%
  }
}
</style>
