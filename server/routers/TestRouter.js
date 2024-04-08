const express = require('express');
//通过express.Router()创建了一个新的路由器实例
const router = express.Router();
//导入了db和genid对象
const {db,genid} = require('../db/blog/DbUtils');

//路由器定义了一个GET请求处理程序，当收到"/test"路径的GET请求时执行。
//在这个处理程序中：通过db.all方法执行了一个SQL查询，从名为"admin"的表中检索所有数据。查询结果通过回调函数的rows参数返回。
router.get('/test', async(req, res) => {
   let out = await db.async.all('select * from `admin`',[]);
   // db.all('select * from `admin`', [], (err, rows) => {
   //  console.log(rows);
   // })
   res.send({
    id:genid.NextId(), // 生成一个全局唯一的ID
    out //相当于out:out
   })
})
//通过module.exports将路由器实例导出，以便在其他文件中可以引入和使用该路由器。
module.exports = router;