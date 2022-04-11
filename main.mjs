import fetch from "node-fetch";
import { laravel_session } from "./config.mjs";
import { getScreen } from "./screen.mjs";

const baseUrl =
  "\u0068\u0074\u0074\u0070\u0073\u003a\u002f\u002f\u0073\u0065\u0072\u0076\u0069\u0063\u0065\u002e\u006a\u0069\u0061\u006e\u0067\u0073\u0075\u0067\u0071\u0074\u002e\u006f\u0072\u0067";
const youth_cookie = `laravel_session=${laravel_session}`;

const headers = {
  accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
  "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
  "cache-control": "max-age=0",
  "x-requested-with": "com.tencent.mm",
  Host: "\u0073\u0065\u0072\u0076\u0069\u0063\u0065\u002e\u006a\u0069\u0061\u006e\u0067\u0073\u0075\u0067\u0071\u0074\u002e\u006f\u0072\u0067",
  Origin:
    "\u0068\u0074\u0074\u0070\u0073\u003a\u002f\u002f\u0073\u0065\u0072\u0076\u0069\u0063\u0065\u002e\u006a\u0069\u0061\u006e\u0067\u0073\u0075\u0067\u0071\u0074\u002e\u006f\u0072\u0067",
  Cookie: youth_cookie,
  "User-Agent":
    "Mozilla/5.0 (Linux; Android 12; Mi 12 Build/SKQ1.211006.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/100.0.4896.58 Mobile Safari/537.36 MMWEBID/8357 MicroMessenger/8.0.20.2100(0x28001439) Process/toolsmp WeChat/arm64 Weixin NetType/WIFI Language/zh_CN ABI/arm64",
};

let chapter = "";

fetch(
  `${baseUrl}\u002f\u0079\u006f\u0075\u0074\u0068\u002f\u006c\u0065\u0073\u0073\u006f\u006e\u002f\u0063\u006f\u006e\u0066\u0069\u0072\u006d`,
  {
    headers,
    body: null,
    method: "GET",
  }
)
  .then((res) => {
    return res.text();
  })
  .then((res) => {
    // 爬取课程信息
    console.log(
      /<title>.*<\/title>/.exec(res)[0] + /<span>.*<\/span>/.exec(res)[0]
    );
    chapter = /<span>.*<\/span>/.exec(res)[0].split("<span>")[1].split("<")[0];
    console.log("\n");
    console.log(/<p><span>当前课程：<\/span>.*<\/p>/.exec(res)[0]);
    console.log(/<p><span>您的姓名：<\/span>.*<\/p>/.exec(res)[0]);
    console.log(/<p><span>用户编号：<\/span>.*<\/p>/.exec(res)[0]);
    console.log("\n");
    const token = /var token = ".*";/.exec(res)[0].split('"')[1];
    const lesson_id = parseInt(/'lesson_id':.../.exec(res)[0].split(":")[1]);
    console.log(`token:         ${token}`);
    console.log(`lesson_id:     ${lesson_id}`);
    console.log("\n");
    return fetch(
      `${baseUrl}\u002f\u0079\u006f\u0075\u0074\u0068\u002f\u006c\u0065\u0073\u0073\u006f\u006e\u002f\u0063\u006f\u006e\u0066\u0069\u0072\u006d`,
      {
        headers: {
          ...headers,
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "Content-Length": 61,
        },
        body: `_token=${token}&lesson_id=${lesson_id}`,
        method: "POST",
      }
    );
  })
  .then((res) => {
    return res.json();
  })
  .then((res) => {
    // 输出结果
    console.log("后端返回值:");
    console.log(res);
    return res;
  })
  .then((res) => {
    // 截屏
    if (res.status === 1) {
      console.log("\n正在获取截屏......\n");
      getScreen(res.data.url, chapter);
    } else {
      console.error("\n爬取失败\n");
    }
  });
