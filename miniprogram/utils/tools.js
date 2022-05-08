// 生成指定长度的随机数数组
export const randomArray = (length)=> {
  var arr = [];
  for (var i = 0; i < length; i++) {
    arr.push(Math.floor(Math.random() * 1000));
  }
  return arr;
 }