const tinify = require("tinify");
tinify.key = "HFRK2YxQpmWBFykTQYlDFZvQS2X6QKnt";

var fs = require("fs")
var path = require("path")

//读取bigImage/assets下已压缩图片的hash值
//sha1.json中有一个数组，所有的压缩后的图片的hash值都会保存在里面，避免重复压缩
fs.readFile("sha1.json",function (err,jsonData) {
    if (err){
        return console.error(err);
    }
    var dataJson = jsonData.toString();
    var dataJson = JSON.parse(dataJson);
    console.log("dataStr.data--"+dataJson.data)

    //遍历bigImage/assets下所有文件
    var root = path.join(__dirname,"assets")
    readDirSync(root);

    function readDirSync(path) {
        var pa = fs.readdirSync(path);
        pa.forEach(function (ele, index) {
            var info = fs.statSync(path + "\\" + ele)
            if (info.isDirectory()) {
                console.log("文件夹: " + ele)
                var writePath = path.replace("bigImage","").replace("\\\\","\\").replace("/","\\") + "\\" + ele;
                if (fs.existsSync(writePath)){
                    console.log("目标文件夹已存在，开始遍历文件--"+writePath);
                    readDirSync(path + "\\" + ele);
                }else {
                    console.log("目标文件夹不存在，创建目标文件夹--"+writePath);
                    fs.mkdirSync(writePath);
                    readDirSync(path + "\\" + ele);
                }

            } else {
                console.log("文件处理: " + path + "\\" + ele)
                //判断正常assets目录下文件夹是否存在
                var writePath = path.replace("bigImage","").replace("\\\\","\\").replace("/","\\");
                //压缩图片并记录图片hash值。
                tinifyPng(path + "\\" + ele,writePath + "\\" + ele,dataJson);
            }
        })
    }

    //将修改后的配置写入文件前需要先转成json字符串格式
    var jsonstr = JSON.stringify(dataJson);
    console.log("jsonstr--"+jsonstr)
    //将修改后的内容写入文件
    fs.writeFile('sha1.json', jsonstr, function(err) {
        if (err) {
            console.error(err);
        } else {
            console.log('----------修改成功-------------');
        }
    })

//压缩图片
    function tinifyPng(sourePath,toPath,dataJson){
        var hashdata = createFileHash256Sync(sourePath);
        if (dataJson.data.indexOf(hashdata) > -1){//已经压缩过的就不再压缩
            console.log('----------文件已经压缩，不再重复压缩-------------');
        }else {
            //压缩文件，写入hash值表
            console.log('开始压缩文件---源路径：'+sourePath+";目标路径："+toPath);
            const source = tinify.fromFile(sourePath);
            source.toFile(toPath)

            dataJson.data.push(hashdata)
        }
    }
//获取文件哈希值
    function createFileHash256Sync(sourePath) {
        const crypto = require('crypto');
        const fs = require('fs');

        //读取一个Buffer
        const buffer = fs.readFileSync(sourePath);
        const fsHash = crypto.createHash('sha256');

        fsHash.update(buffer);
        const md5 = fsHash.digest('hex');
        return md5
    }
})






