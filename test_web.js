var fs = require("fs");
var path = require("path");
var iconv = require('iconv-lite');

fs.readdir("D:\\debug", function (err, files) {
    files.forEach((x) => {
        if (x.endsWith("txt")) {
            fs.readFile(path.join("D:\\debug", x), function (err, data) {
                var line = iconv.decode(data, "GB2312").split("\n");
                line = line.filter((x) => {
                    return x.indexOf("pan.baidu.com") != -1;
                }).map((x) => {
                    var link = x.split("：")[1].split(" ")[0];
                    var sec = x.split("：")[2];
                    console.log(link + " " + sec);
                    return { link: link, sec: sec }
                });
                //console.log(JSON.stringify(line));
            });
        }
    });
});