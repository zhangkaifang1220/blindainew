var express = require('express');/////引进express 框架
var router = express.Router();    ///引入路由
var pool = require("../pool");      ///导入mysql 的数据连接池

router.get('/',function(req,res){

    let pid = req.query.pid;
  //数据库的问题;请求名称不一样
    let pro_sql = "SELECT * FROM bld_product where pid= ? ";
    pool.query(pro_sql,[pid],(err,result)=>{
        if(err)throw err;
            res.send({code: 1,data:result});
    });
});
router.post('/updatebuy', function (req, res) {
    let pid = req.body.pid;
    let update_restmoney= req.body.update_restmoney;
    let update_progress = req.body.update_progress;
    console.log(update_restmoney);
    let updata_sql = "update bld_product set restmoney=?,progress=? where pid= ?"

        pool.query(updata_sql, [update_restmoney, update_progress, pid], (err, result) => {

            if (err) throw err;
            if(result.affectedRows>0){
                res.send({code:1,msg:"购买成功"});
                }else{
                res.send({code:-1,msg:"购买失败"});
                }
        })
    //}
});
module.exports = router;//////未添加这个,输出 router需要一个函数却给了一个对象  的错误
