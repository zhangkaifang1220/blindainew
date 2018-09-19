var express = require('express');
var router = express.Router();
var pool = require('../pool');

/* GET home page. */
router.get('/product', function(req, res) {
    let uid = req.query.uid;
    let pid = req.query.pid;
    let touru=parseFloat(req.query.money);
    //console.log(uid,pid,touru, typeof touru);
    var p1 = function(){
        return new Promise(function (resovle,reject) {
            let sql = "select count(baid) as c,asset_touru from bld_asset_product where user_id = ? AND product_id = ?";
            pool.query(sql,[uid,pid],(err,result)=>{
                if(err) throw err;
             //   console.log(result);
              //  console.log(result[0].asset_touru);
                resovle(result);

            });
        })
    };
        p1().then(function (result) {
            let sqlInner = null;
          //  console.log('p1.then',res);
            if(result[0].c>0){
              //  console.log(result[0].asset_touru,typeof result[0].asset_touru);
                touru+= parseFloat(result[0].asset_touru);
               // console.log(touru,'p1.then');
                sqlInner  = "UPDATE  bld_asset_product SET asset_touru = ?  WHERE user_id= ? AND product_id= ?"

            }else{
                sqlInner = "insert into bld_asset_product (asset_touru,user_id,product_id) values (?,?,?)";
            }
          //  console.log(sqlInner);
            pool.query(sqlInner,[touru,uid,pid],(err,result)=>{
                if(err) throw err;
                if(result.affectedRows>0){
                    res.send({code: 1,msg: '操作成功'});
                }else{
                    res.send({code: -1,msg: '网络错误,请稍后重试!'});
                }
            })
        })


});
// 查询商品信息
router.get('/find',function (req,res){
    let uid = req.query.uid;
    let sql = "select * from bld_asset_product inner join bld_product on product_id=pid where user_id= ? ";

    pool.query(sql,[uid],(err,result)=>{
        if(err) throw err;
        res.send({code:1,data: result});
    })
}
);

module.exports = router;
