import fs from "fs";
import http from "https";

const downloadFileAsync = (uri, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    http.get(uri, (res) => {
      if (res.statusCode !== 200) {
        reject(response.statusCode);
        return;
      }
      res.on("end", () => {
        console.log("download end");
      });
      file
        .on("finish", () => {
          console.log("finish write file");
          file.close(resolve);
        })
        .on("error", (err) => {
          fs.unlink(dest);
          reject(err.message);
        });
      res.pipe(file);
    });
  });
};

export const getScreen = (youthUrl, chapter) => {
  var src = youthUrl.replace("/index.html", "/images/end.jpg");
  console.log(`截图地址:\n${src}\n`);
  downloadFileAsync(src, `output/${chapter}.jpg`)
    .then((res) => {
      console.log(`\n截图获取成功，已保存在 ./output/${chapter}.jpg\n`);
    })
    .catch((err) => {
      console.log("\n截图获取失败，请重试！\n");
    });
};
// getScreen(
//   "https://h5.cyol.com/special/daxuexi/cus4hz1kx1/m.html",
//   "2022年第8期"
// );
