const express = require('express');
//通过express.Router()创建了一个新的路由器实例
const router = express.Router();
//导入了db和genid对象
const {db,genid} = require('../db/blog/DbUtils');


//列表接口
router.get('/list', async (req, res) => {//定义一个POST请求的路由处理函数，用于处理添加的请求。
    const search_sql = "select * from `category`";//定义查询的SQL语句。
    let {err,rows} = await db.async.all(search_sql,[]);//执行查询的SQL语句。

    if(err == null) {
        res.send({//如果成功，返回相应的状态码和提示信息。
            code:200,//状态码，表示成功。
            msg:"查询成功",//查询成功的提示信息。
            rows//查询结果
        })
    }else {//如果失败，返回相应的状态码和提示信息。
        res.send({//如果查询失败，返回相应的状态码和提示信息。
            code:500,//状态码，表示失败。
            msg:"查询失败"
        })
    }
})


router.get('/_token/deleteCategory',async(req,res)=>{
    let {categoryId} = req.query;//从请求的query中获取categoryId参数。
    let delete_sql = "delete from `blog` where `category_id` = ?";//定义删除的SQL语句。
    let {err,rows} = await db.async.all(delete_sql,[categoryId]);//执行删除的SQL语句。
    if(err == null) {
        res.send({
            code:200,
            msg:"删除成功",//如果成功，返回相应的状态码和提示信息。 
        })
    }else{
        res.send({
            code:500,//如果失败，返回相应的状态码和提示信息。
            msg:"删除失败",
            err
        })
    }
})


//添加接口
router.post('/_token/add', async (req, res) => {//定义一个POST请求的路由处理函数，用于处理添加的请求。
    let {name} = req.body;//从请求的body中获取name参数。
    const insert_sql = "insert into `category`(`id`,`name`) VALUES (?,?)";//定义插入的SQL语句。
    let {err,rows} = await db.async.run(insert_sql,[genid.NextId(),name]);//执行插入的SQL语句，将id和name参数插入到数据库中。

    if(err == null) {
        res.send({//如果插入成功，返回相应的状态码和提示信息。
            code:200,//状态码，表示成功。
            msg:"添加成功",//添加成功的提示信息。
        })
    }else {//如果插入失败，返回相应的状态码和提示信息。
        res.send({//如果插入失败，返回相应的状态码和提示信息。
            code:500,//状态码，表示失败。
            msg:"添加失败"
        })
    }
})



//修改接口
router.put('/_token/update', async (req, res) => {//定义一个POST请求的路由处理函数，用于处理添加的请求。
    let {id,name} = req.body;//从请求的body中获取name参数。
    const update_sql = "update `category` set `name` = ? where `id` = ?";//定义更新的SQL语句。
    let {err,rows} = await db.async.run(update_sql,[name,id]);//执行更新的SQL语句。

    if(err == null) {
        res.send({//如果成功，返回相应的状态码和提示信息。
            code:200,//状态码，表示成功。
            msg:"修改成功",//修改成功的提示信息。
        })
    }else {//如果失败，返回相应的状态码和提示信息。
        res.send({//如果修改失败，返回相应的状态码和提示信息。
            code:500,//状态码，表示失败。
            msg:"修改失败"
        })
    }
})


//删除接口
router.delete('/_token/delete', async (req, res) => {//定义一个POST请求的路由处理函数，用于处理添加的请求。
    let id = req.query.id;//
    const delete_sql = "delete from `category` where `id` = ?";//定义删除的SQL语句。
    let {err,rows} = await db.async.run(delete_sql,[id]);//执行删除的SQL语句。

    if(err == null) {
        res.send({//如果成功，返回相应的状态码和提示信息。
            code:200,//状态码，表示成功。
            msg:"删除成功",//删除成功的提示信息。
        })
    }else {//如果失败，返回相应的状态码和提示信息。
        res.send({//如果删除失败，返回相应的状态码和提示信息。
            code:500,//状态码，表示失败。
            msg:"删除失败"
        })
    }
})
//通过module.exports将路由器实例导出，以便在其他文件中可以引入和使用该路由器。
module.exports = router;


