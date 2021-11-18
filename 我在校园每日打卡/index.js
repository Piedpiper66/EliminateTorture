const request = require('request');
const fs = require('fs');

const { userInfo, statusInfo } = require('./UserBasic');
const sessionPath = './user_session.json';
const commonHeaders = {
   "Accept-Encoding": "gzip, deflate, br",
   "Connection": "keep-alive",
   "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36 MicroMessenger/7.0.9.501 NetType/WIFI MiniProgramEnv/Windows WindowsWechat",
   "Accept-Language": "en-us,en",
   "Accept": "application/json, text/plain, */*",
}

let retryCount = 0;

// 若文件未创建, 则先创建
if (!fs.existsSync(sessionPath)) {
   setSession('');
}

// 转义地理位置信息
function encodeQs(healthObj) {
   const encoded = Object.create(null);

   for (const [key, value] of Object.entries(healthObj)) {
      encoded[key] = encodeURIComponent(value);
   }

   return encoded;
}

// 计算 Content-Length 的值
function getQsLen(obj) {
   const str = JSON.stringify(encodeQs(obj));
   return str.length;
}

// 重设 session
function setSession(jwsession) {
   fs.writeFileSync(sessionPath, JSON.stringify({ jwsession }))
}

// 获取 session
function getSession() {

   const key = 'jwsession';

   const sessionStr = fs.readFileSync(sessionPath, { encoding: 'utf-8' });

   const parsed = JSON.parse(sessionStr);

   return parsed[key];
}


async function auto() {
   
   try {

      const _session = getSession() || await login();

      const url = "https://student.wozaixiaoyuan.com/health/save.json";

      const headers = Object.assign(commonHeaders, {
         "Content-Type": "application/x-www-form-urlencoded",
         "Content-Length": getQsLen(statusInfo),
         "Host": "student.wozaixiaoyuan.com",
         "JWSESSION": _session
      });

      request.post(
         url,
         { headers, qs: encodeQs(statusInfo) },
         async (err, response, body) => {
            if (err) {
               console.error('clockIn error: ', err);
               return false;
            } else {
               const result = JSON.parse(body);
               switch (result.code) {
                  case -10:
                     console.log('jwsession 无效，将尝试使用账号信息重新登录');
                     if (retryCount <= 4) {
                        await login();
                        retryCount++;
                        auto();
                     }
                     break;
                  case 0:
                     console.log('打卡成功'); break;
                  case 1:
                     console.log('打卡失败, 今日打卡已结束'); break;
                  default:
                     console.log('打卡失败'); break;
               }
            }
         }
      )
   } catch (error) {
      console.log('clockIn error: ', error);
   }
}

function login() {
   return new Promise((resolve, reject) => {

      const headers = Object.assign(commonHeaders, {
         "Content-Type": "application/json;charset=UTF-8",
         "Content-Length": getQsLen(userInfo),
         "Host": "gw.wozaixiaoyuan.com",
      });

      const loginUrl = "https://gw.wozaixiaoyuan.com/basicinfo/mobile/login/username";

      request.post(
         loginUrl,
         { headers, qs: { ...userInfo } },
         (err, response, body) => {
            if (err) {

               reject(err);

            } else {

               const { jwsession } = response.headers;

               const { code, message } = JSON.parse(body);

               if (code === 0) {
                  console.log('登录成功');
                  setSession(jwsession);
                  resolve(jwsession);
               } else {
                  console.log(`登陆失败, reason: ${ message }`);
                  reject(message);
               }
            }
         }
      )

   })
}

exports.clockIn = auto;
