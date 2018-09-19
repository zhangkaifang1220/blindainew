var express = require('express');/////引进express 框架
var router = express.Router();    ///引入路由
var pool = require("../pool");      ///导入mysql 的数据连接池

router.get('/', (req,res) => {
    let pid = req.query.pid;

    let sql = " SELECT * FROM bld_product where pid= ? ";
    pool.query(sql, [pid], (err, result) => {
        if (err) throw err;

        res.send(result);
    })
});
router.get('/:product_class',function(req,res){
    let product_class = req.params.product_class || 'ririsheng'; // 条件
    let condition = req.query.condition || 'rate'; //排序

    let level = req.query.level || 'desc';

    let pno = parseInt(req.query.pno) || 1;///第几页
    let pageSize = 5;//一页有几行
    let offset = (pno-1) * pageSize;
    let output = {};   //最终输出对象
    output.pno = pno;
    output.pageSize = 5;
    let progress = 0;  //sql执行进度
    //sql:
    let sqlNum = "SELECT count(pid) as c FROM bld_product where product_class= ? ";
    pool.query(sqlNum,[product_class],(err,result)=>{
        if(err)throw err;
        let c = result[0].c;

        output.pageCount =  Math.ceil(c/pageSize);//保存总页数
        progress+=50;                   //进度条+50
        if(progress===100){              //进度条==100
            res.send(output);             //发送
        }
    });
    var sql = `select pid,product_class,num,nth,rate,install,month,money,restmoney,progress from bld_product where product_class= ?  order by ${condition} ${level} limit ?, ?`;
    pool.query(sql,[product_class,offset,pageSize],(err,result)=>{
        if(err) throw err;
        output.data = result;
        progress+=50;                   //进度条+50
        if(progress===100){              //进度条==100
            res.send(output);             //发送
        }

    });
});
module.exports = router;//////未添加这个,输出 router需要一个函数却给了一个对象  的错误
