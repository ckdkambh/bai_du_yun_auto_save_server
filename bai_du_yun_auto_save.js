var fs = require("fs");
var path = require("path");
var iconv = require('iconv-lite');
var http = require('http');

var link_list = [];

var files = fs.readdirSync("D:\\debug");
files.forEach((x) => {
    if (x.endsWith("txt")) {
        var data = fs.readFileSync(path.join("D:\\debug", x));
        var line = iconv.decode(data, "GB2312").split("\n");
        line = line.filter((x) => {
            return x.indexOf("pan.baidu.com") != -1;
        }).map((x) => {
            var link = x.split("：")[1].split(" ")[0];
            var sec = x.split("：")[2];
            return { link: link, sec: sec }
        });
        link_list.push(line[0]);
    }
});

//0 -- 获取连接
//1 -- 获取密码
//2 -- 执行保存
//3 -- 初始状态
//4 -- 查询
var start_link_no = 0;
var current_link_no = start_link_no;
var step = 3;
var server = http.createServer(function (request, response) {
    console.log(request.method + ': ' + request.url);
    var fileName = request.url.split("/")[1];

    if (current_link_no > link_list.length){
        response.writeHead(200);
        response.end('5');
    }

    if (fileName === "4") {
        response.writeHead(200);
        response.end(step.toString());
    } else if (fileName === "0" || fileName === "3") {
        response.writeHead(200);
        response.end(link_list[current_link_no]['link']);
        step = 1;
    } else if (fileName === "1") {
        response.writeHead(200);
        response.end(link_list[current_link_no]['sec']);
        step = 2;
    } else if (fileName === "2") {
        response.writeHead(200);
        response.end('');
        current_link_no++;
        console.log('recive %d cfm, start next, total num = %d', current_link_no, link_list.length);
        step = 0;
    } else if (fileName === "jquery-3.1.1.js") {
        console.log(fileName);
        fs.stat(fileName, function (err, stats) {
            if (!err && stats.isFile()) {
                console.log('200' + request.url);
                response.writeHead(200);
                fs.createReadStream(fileName).pipe(response);
            } else {
                console.log('404 ' + request.url);
                response.writeHead(200);
                response.end('-_-!');
            }
        });
    }

    console.log('current step ' + step);
});

// 让服务器监听8080端口:
server.listen(8070);

function getIPAdress() {
    var interfaces = require('os').networkInterfaces();
    for (var devName in interfaces) {
        var iface = interfaces[devName];
        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
}

console.log('Server is running at http://' + getIPAdress() + ':8070/');