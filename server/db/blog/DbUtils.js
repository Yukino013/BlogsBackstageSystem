//引入了 sqlite3 模块，并且使用 verbose() 方法来获取详细的日志信息。
const sqlite3 = require('sqlite3').verbose();
//引入了 Node.js 的 path 模块，用于处理文件路径
const path = require('path');
//引入雪花算法，用于生成全局唯一ID
const Genid = require('../../utils/SnowFlake');
//创建了一个 SQLite 数据库连接实例 db，连接到名为 blog.sqlite3 的 SQLite 数据库文件。__dirname 表示当前模块的目录路径。
var db = new sqlite3.Database(path.join(__dirname, 'blog.sqlite3'));
//创建了一个全局唯一ID生成器实例 genid，可能是使用 SnowFlake 算法生成的。传递了一个配置对象，其中设置了 WorkerId 为1，用来区分不同的生成器实例。
const genid = new Genid({WorkerId:1})

//创建了一个空对象，用于存储异步方法。
db.async = {}

//过将数据库操作包装在 Promise 中，可以更容易地进行异步操作的管理和错误处理
//这种封装还可以使代码更易读和模块化
//因为调用者不需要处理原始的回调函数
//而是可以直接使用 Promise 的语法进行链式调用


//用于执行查询语句，并返回查询结果。这个方法接受两个参数 sql 和 params
db.async.all = (sql,params) =>{
    return new Promise((resolve,reject)=>{
        db.all(sql,params,(err,rows)=>{
           resolve({err,rows})
        })
    })
}
//于执行除查询以外的其他类型的 SQL 语句，比如插入、更新或删除操作
db.async.run = (sql,params) =>{
    return new Promise((resolve,reject)=>{
        db.run(sql,params,(err,rows)=>{
            resolve({err,rows})
        })
    })
}

//导出了一个对象，包含了 db 和 genid，使得其他模块可以引入并使用这两个对象。
module.exports ={db,genid}
