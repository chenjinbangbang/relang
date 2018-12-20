// components/prompt/prompt.js
Component({
  options: {
    //multipleSlots: true, //在组件定义时的选项中启用多slot支持
  },

  /**
   * 组件的属性列表
   */
  properties: {
    imgType: {
      type: String,
      value: ''
    },
    title: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    title: '蓝色天空'
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
