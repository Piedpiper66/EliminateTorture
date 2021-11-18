module.exports = {
   // "我在校园"账号密码
   userInfo: {
      username: '',
      password: ''
   },
   /**
    *    地理位置信息可通过 'https://api.map.baidu.com/lbsapi/getpoint/index.html' 获取
    *    (区 和 街道可以不填)
   */
   statusInfo: {
      answers: '["0","36.5","36.5","36.5"]',
      latitude: '',  /* 纬度 */
      longitude: '', /* 经度 */
      country: '中国',   /* 国家 */
      city: '',   /* 市 */
      district: '', /* 区 */
      province: '', /* 省 */
      township: '', /* 街道 */
      street: '', /* 路 */
      areacode: '' /* 邮政编码 */
   }
}