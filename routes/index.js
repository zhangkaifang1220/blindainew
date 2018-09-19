var express = require('express');
var router = express.Router();
var pool = require('../pool');

/* GET home page. */
router.get('/getImg', function(req, res, next) {
    let sql = "select * from bld_carousel";
    // let sql = "select iid,pid,num,nth,rate,install,month from bld_product where pid=(select product_id from bld_index )";


    pool.query(sql,(err,result) => {
        if(err){ throw err;}
        res.send({code:1, images: result})
    })

});
router.get('/text',(req,res)=>{
    //let sql = "select * from bld_index";
    let sql = " SELECT  iid,pid,product_class,num,nth,rate,install,month,restmoney  FROM bld_index LEFT  OUTER  JOIN  bld_product  ON  product_id=pid";
    pool.query(sql,(err,result) => {
        if(err) throw err;

        res.send({code:1, text: result})
    })
});




module.exports = router;
