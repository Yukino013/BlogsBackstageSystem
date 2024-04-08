const express = require('express');
//通过express.Router()创建了一个新的路由器实例
const router = express.Router();
//导入uuid
const {v4: uuidv4} = require('uuid');
//导入了db和genid对象
const {db,genid} = require('../db/blog/DbUtils');


router.post("/login",async (req,res)=>{
  let {account,password} = req.body;//获取账号和密码
  let {err,rows} = await db.async.all("select * from `admin` where `account` = ? and `password` = ?",[account,password]);

  if(err==null && rows.length>0){
   let login_token = uuidv4();//生成登录令牌，用于后续的登录验证。
   let update_token_sql = "update `admin` set `token` = ? where `id` = ?";//更新登录令牌的SQL语句
   await db.async.run(update_token_sql,[login_token,rows[0].id]);//执行更新登录令牌的SQL语句，更新数据库中的令牌信息。

   let admin_info = rows[0];//获取管理员信息，包括id、account、token等。
   admin_info.token = login_token;//将最新的登录令牌赋值给admin_info对象。
   admin_info.password = "";//删除密码信息，确保不返回给客户端。

   res.send({
      code:200,//状态码，表示成功。
      msg:"登录成功",//登录成功的提示信息。
      data:admin_info//登录成功后返回的管理员信息。
   })
  } else {
   res.send({//如果登录失败，返回相应的状态码和提示信息。
      code:500,//状态码，表示失败。
      msg:"账号或密码错误",//登录失败的提示信息。
   })
  }
})

//通过module.exports将路由器实例导出，以便在其他文件中可以引入和使用该路由器。
module.exports = router;