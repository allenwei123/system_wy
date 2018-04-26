import Vue from 'vue';
import { Message } from 'element-ui';

Vue.directive('input_validate', {
  // 当被绑定的元素插入到 DOM 中时……
  update: function (el,binding,vnode) {
    let result = true;
    if (binding.modifiers['num']) {//检验数字
      if (binding.value !== '' && !/^[1-9]\d*$|^0$|^0\.\d{1,2}$|^[1-9]\d*\.\d{1,2}$/.test(binding.value)) {
        result = false;
        Message.warning('请输入合法数字');
      }
    }
    if (binding.modifiers['phone']) {//检验手机号码
      if (!/^[0-9]\d$/.test(binding.value) || binding.value.length > 11) {
        result = false;
      }
    }
    if (result) {
      el.childNodes[1].style.borderColor = ''
    }  else {
      el.childNodes[1].style.borderColor = 'red'
    }
  }
})
