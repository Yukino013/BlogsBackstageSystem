const express = require('express');
const router = express.Router();
const fs = require('fs'); // 引入fs模块用于文件操作。
const { db, genid } = require('../db/blog/DbUtils'); // 引入db和genid对象。

router.post("/rich_editor_upload",async(req, res)=>{
    if(!req.files){
        res.send({
            "error":1, //只要不等于0就行
            "message":"失败"
        })
        return;
    }

    let files = req.files;  // 获取上传的文件。
    let ret_files = [];  // 用于存储上传成功的文件信息。

    for(let file of files){
        let file_ext = file.originalname.substring(file.originalname.lastIndexOf(".") + 1); // 获取文件扩展名（文件名字后缀）。

        let file_name = genid.NextId() + "." + file_ext;  // 生成文件名。
        //由于该方法属于fs模块，使用前需要引入fs模块（var fs= require(“fs”) ）
        //修改名字+移动文件
        fs.renameSync(
            process.cwd()+"/public/upload/temp/"+ file.filename,
            process.cwd()+"/public/upload/" + file_name
        );  // 重命名文件。
        ret_files.push("/upload/" + file_name)
    }


    res.send({
        "errno":0, //值是数字，不能是字符串
        "data":{
            "url":ret_files[0], // 返回上传成功的文件路径。
        }
    })
})


//通过module.exports将路由器实例导出，以便在其他文件中可以引入和使用该路由器。
module.exports = router;