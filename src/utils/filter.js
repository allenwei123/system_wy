import Vue from 'vue';
import time from './time';

Vue.filter('time', (value, format) => {
  if (!value) return '';
  let _format = format || 'yyyy-MM-dd';//'yyyy-MM-dd HH:mm:ss'
  let date = new Date();
  date.setTime(value);
  return time.dateFormat(date, _format);
})

Vue.filter('sex',  (value) => {
    if (!value) return ''
    let newValue = '';
    switch(value) {
      case 0:
        newValue = '未知';
        break;
      case 1:
        newValue = '男';
        break;
      case 2:
        newValue = '女';
        break;
    }
    return newValue;
  })

Vue.filter('week',  (value) => {
  if (!value) return '';
  let week = new Date(value).getDay();
  switch (week){
    case 0 :
      week = '星期天';
      break;
    case 1 :
      week = '星期一';
      break;
    case 2 :
      week = '星期二';
      break;
    case 3 :
      week = '星期三';
      break;
    case 4 :
      week = '星期四';
      break;
    case 5 :
      week = '星期五';
      break;
    case 6 :
      week = '星期六';
      break;
  }
  return week;
})

Vue.filter('dateDiff',(value)=>{
  if (!Array.isArray(value)) return false;
  let dateStart = value[0], dateEnd =  value[1];
  let dateDiff = dateEnd - dateStart, dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000));//计算出相差天数
  let leave1= dateDiff % (24*3600*1000),//计算天数后剩余的毫秒数
      hours=Math.floor(leave1/(3600*1000));//计算出小时数
  //计算相差分钟数
  let leave2=leave1%(3600*1000),//计算小时数后剩余的毫秒数
      minutes=Math.floor(leave2/(60*1000));//计算相差分钟数
  //计算相差秒数
  let leave3=leave2%(60*1000),//计算分钟数后剩余的毫秒数
      seconds=Math.round(leave3/1000);
  return `${hours}:${minutes}:${seconds}`
})

Vue.filter('minutesDiff',(value)=>{
  if (!Array.isArray(value)) return '';
  return parseInt((value[1] - value[0])/60000);
})
