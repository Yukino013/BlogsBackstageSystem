
// 引入了Express框架和multer中间件，以及初始化一个Express应用程序，并指定了端口号为8080。
const express = require("express")
const multer = require("multer")
const path = require("path")
const app = express();
const {db} = require("./db/blog/DbUtils")
const port = 8080

// 这段代码设置了跨域请求的头部信息，允许任意来源的请求，并支持GET、PUT、POST、DELETE和OPTIONS方法，同时也允许任意的请求头。如果收到OPTIONS请求，会直接返回200状态码。
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*") // 允许跨域访问的域名，* 表示任意域名
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS") // 允许跨域的请求方式，这里允许 GET、PUT、POST、DELETE、OPTIONS 方法
    res.header("Access-Control-Allow-Headers", "*") // 允许跨域访问的请求头，这里允许 Content-Type、Authorization、X-Requested-With 请求头
    if(req.method == 'OPTIONS')
    res.sendStatus(200); // 处理 OPTIONS 请求，返回 200 状态码
    else next();
});
//这段代码使用了express中间件，用于解析JSON格式的请求体。
app.use(express.json())

//这里使用multer中间件来处理文件上传，将文件上传到指定的目录（这里是"./public/upload/temp"）。
const update = multer({ 
    dest: "./public/upload/temp"
 })
app.use(update.any())

//指定静态资源路径
app.use(express.static(path.join(__dirname, 'public')))


const ADMIN_TOKEN_PATH = "/_token"
app.all("*",async(req,res,next) =>{
    if(req.path.indexOf(ADMIN_TOKEN_PATH)> -1){
        let {token} = req.headers;
        let admin_token_sql = "SELECT * FROM `admin` WHERE `token` = ?"
        let adminResult = await db.async.all(admin_token_sql,[token])
        if(adminResult.err != null || adminResult.rows.length == 0 ){
            res.send({
                code:403,
                msg:"请先登录"
            })
            return
     }else {
        next()
     }
    }else{
        next()
    }
})

//这里设置了一个路由，当请求的路径是/test时，会交给"./routers/TestRouter"处理。
app.use("/test",require("./routers/TestRouter"))
app.use("/admin",require("./routers/AdminRouter"))
app.use("/category",require("./routers/CategoryRouter"))
app.use("/blog",require("./routers/BlogRouter"))
app.use("/upload",require("./routers/UploadRouter"))

//当请求根路径时，返回"Hello World!"。
app.get("/", (req, res) => {
    res.send("Hello World!");
})

//最后，启动了服务器监听指定的端口（这里是8080），并在控制台打印启动成功的消息。
app.listen(port, () => {
    console.log(`启动成功 at http://localhost:${port}`);
})