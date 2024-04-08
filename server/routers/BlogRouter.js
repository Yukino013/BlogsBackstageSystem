const express = require('express');
//通过express.Router()创建了一个新的路由器实例
const router = express.Router();
//导入了db和genid对象
const {db,genid} = require('../db/blog/DbUtils');


//查询博文
router.get('/search', async(req, res) => { //定义一个GET请求的路由处理函数，用于查询博文。

    // keyword 关键字
    // categoryId 分类编号
    // 分页:
    // page ：页码
    // pagesize ： 分页大小
    let {keyword,categoryId,page,pageSize}  = req.query

    page = page == null ? 1:page;
    pageSize = pageSize == null ? 10:pageSize; // 默认每页10条数据。
    categoryId = categoryId == null ? 0:categoryId; // 默认查询所有分类。
    keyword = keyword == null ? "":keyword; // 默认查询所有关键字。

    let params = []
    let whereSqls =  [] 
    if (categoryId != 0){
        whereSqls.push(" `category_id` = ? ")
        params.push(categoryId) // 添加分类编号到参数数组。
    }
    if(keyword != ""){
        whereSqls.push(" (`title` LIKE ? OR `content` LIKE ?) ")
        params.push("%" + keyword + "%") // 添加关键字到参数数组。
        params.push("%" + keyword + "%") // 添加关键字到参数数组。
    }
    let whereSqlStr = ""
    if(whereSqls.length > 0){
        whereSqlStr = " WHERE " + whereSqls.join(" AND ") // 生成WHERE子句。
    }
 
    //查分页数据
    let searchSql =  " SELECT `id`,`category_id`,`create_time`,`title`,substr(`content`,0,50) AS `content` FROM `blog` " + whereSqlStr + " ORDER BY `create_time` DESC LIMIT ?,? " // 生成查询SQL语句。
    let searchSqlParams = params.concat([(page-1)*pageSize,pageSize]) // 添加分页参数到参数数组。


    //查询数据总数
    let searchCountSql = " SELECT COUNT(*) AS count FROM `blog` " + whereSqlStr // 生成查询总数SQL语句。
    let searchCountParams = params // 添加查询总数参数到参数数组。

    //分页数据
    let searchResult = await db.async.all(searchSql,searchSqlParams) // 执行查询SQL语句。
    let countResult = await db.async.all(searchCountSql,searchCountParams) // 执行查询总数SQL语句。

    console.log(searchSql,countResult);

    if(searchResult.err == null && countResult.err == null){
        res.send({
            code: 200, // 状态码。
            msg:"查询成功",
            data:{
                keyword,
                categoryId,
                page,
                pageSize,
                rows:searchResult.rows, // 查询结果。
                count:countResult.rows[0].count, // 总数。
            }
        })
    } 
    else{
        res.send({
            code:500,
            msg:"查询失败"
        }) // 查询失败。
    }
})




//查询某条博文(按id)
router.get('/detail', async(req, res) => {
  let {id}  = req.query; //从请求参数中获取id。
  let search_sql = "SELECT * FROM `blog` WHERE `id` = ?" // 生成查询SQL语句。
  let {err,rows} = await db.async.all(search_sql,[id]) // 执行查询SQL语句。 
  if(err == null) {
    res.send({//如果成功，返回相应的状态码和提示信息。
        code:200,//状态码，表示成功。
        msg:"获取成功",
        rows
    })
}else {//如果失败，返回相应的状态码和提示信息。
    res.send({
        code:500,//状态码，表示失败。
        msg:"获取失败",
        err
    })
}
})


//查询某条博文（按标题title）
router.get('/checkDuplicateTitle', async(req, res) => {
    let {title}  = req.query; //从请求参数中获取id。
    let search_sql = "SELECT * FROM `blog` WHERE `title` = ?" // 生成查询SQL语句。
    let {err,rows} = await db.async.all(search_sql,[title]) // 执行查询SQL语句。 
    if(rows.length!=0) {
      res.send({//如果成功，返回相应的状态码和提示信息。
          code:200,//状态码，表示成功。
          msg:"查询标题成功",
          rows
      })
  }else {//如果失败，返回相应的状态码和提示信息。
      res.send({
          code:500,//状态码，表示失败。
          msg:"查询标题失败",
          err
      })
  }
  })

//添加博文
router.post('/_token/add', async(req, res) => {
    let {title,categoryId,content} = req.body; //从请求体中获取title、category、content字段值。
    let id = genid.NextId();
    let create_time = new Date().getTime(); //获取当前时间戳。

    const insert_sql = "INSERT INTO `blog`(`id`,`title`,`category_id`,`content`,`create_time`) VALUES (?,?,?,?,?)"
    let params = [id,title,categoryId,content,create_time]; //将id、title、category、content、createTime作为参数。

    let {err,rows} = await db.async.run(insert_sql,params); //执行插入操作。

    if(err == null) {
        res.send({//如果成功，返回相应的状态码和提示信息。
            code:200,//状态码，表示成功。
            msg:"添加成功",
        })
    }else {//如果失败，返回相应的状态码和提示信息。
        res.send({
            code:500,//状态码，表示失败。
            msg:"添加失败",
            err
        })
    }
})


//修改博文
router.put('/_token/update', async(req, res) => {
    let {id,title,categoryId,content} = req.body; //从请求体中获取title、category、content字段值。
    let create_time = new Date().getTime(); //获取当前时间戳。

    const update_sql = "UPDATE `blog` SET `title` = ?,`content` = ?,`category_id` = ? WHERE `id` = ?";
    let params = [title,content,categoryId,id]; //将id、title、category、content、createTime作为参数。

    let {err,rows} = await db.async.run(update_sql,params); //执行插入操作。

    if(err == null) {
        res.send({//如果成功，返回相应的状态码和提示信息。
            code:200,//状态码，表示成功。
            msg:"修改成功",
        })
    }else {//如果失败，返回相应的状态码和提示信息。
        res.send({
            code:500,//状态码，表示失败。
            msg:"修改失败",
            err,
        })
        console.log(err);
    }
})


//删除博文
router.delete('/_token/delete', async (req, res) => {//定义一个POST请求的路由处理函数，用于处理添加的请求。
    let id = req.query.id;//
    const delete_sql = "DELETE FROM `blog` WHERE `id` = ?";//定义删除的SQL语句。
    let {err,rows} = await db.async.run(delete_sql,[id]);//执行删除的SQL语句。

    if(err == null) {
        res.send({//如果成功，返回相应的状态码和提示信息。
            code:200,//状态码，表示成功。
            msg:"删除成功",//删除成功的提示信息。
            delete_sql
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