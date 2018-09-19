let express = require('express');
let router = express.Router();
const pool = require('../pool');

//用户注册
router.post('/register',(req,res)=>{
    let phone = req.body.phone;
    let upwd = req.body.upwd;
    console.log(phone,upwd);
    let sql = " INSERT INTO bld_user (phone,upwd) VALUES ( ?,?)";
    pool.query(sql,[phone,upwd],(err,result)=>{
        console.log(result);
        if(err) throw err;
        if( result.affectedRows>0){///不要纠结重复注册的问题,js会异步判断是否重复注册,重复无法注册
            //////注册失败时,affectedRows为undefined,因为phone有唯一性限制,mysql 会报错,
            //如果mysql无判定时,可以直接判断affectedRows是否大于0
            res.send( {code:1,msg:"注册成功"});

        }else{
            res.send({code:-1,msg:"注册失败"});
        }
    });
});

///用户登录
router.post('/login',function(req,res){

    let phone = req.body.phone;
    let upwd = req.body.upwd;
   let sql;
  //  if(phone.length===11){
     sql = "SELECT count(uid) as c FROM bld_user WHERE phone= ? AND upwd= ? ";///And写错,5个小时
//}else {
   //   sql = "SELECT count(uid) as c FROM bld_user WHERE uname= ? AND upwd= ? ";
  //  }
    pool.query(sql,[phone,upwd],(err,result)=>{
        console.log(result);
        if(err) throw err;
       // res.send(result);////不能发送字符串,只能了送对象
      //  console.log(result);
        if(result[0].c){
            res.send({code: 1,msg:'登录成功!'});
        }else{
            res.send({code: -1,msg:'登录失败!'});
        }
    });
});

///删除用户
router.get("/delete",(req,res)=>{
    //1:参数 uid
    let uid = parseInt(req.query.uid);
    //2:创建sql
    let sql = "DELETE FROM bld_user WHERE uid = ?";
    pool.query(sql,[uid],(err,result)=>{
        if(err)throw err;
        if(result.affectedRows>0){
            res.send({code:1,msg:"删除成功"});
        }else{
            res.send({code:-1,msg:"删除失败"});
        }
    })
});
// 删除用户id
router.get('/delete/:uid',(req,res)=>{
    let uid = parseInt(req.params.uid);
    //res.send('用户参数是:'+ uid);
    let sql = 'DELETE FROM bld_user WHERE uid = ? ';
    pool.query(sql,[uid],(err,result) => {
        if(err) throw err;
        if(result.affectedRows > 0){
            res.send( {code : 1,msg :'删除成功!'} );
        }else{
            res.send( {code : -1,msg :'删除失败!'} );
        }
    });
});

/// 更新用户密码
router.get("/userupdate",(req,res)=>{
    //1:参数uid upwd
    let uid =  parseInt(req.query.uid);
    let upwd = req.query.upwd;
    //2:sql
    let sql = " UPDATE bld_user SET upwd = ? WHERE uid = ?";

    //3:{code:1,msg:"更新成功"}
    pool.query(sql,[upwd,uid],(err,result)=>{
        if(err) throw err;
        if(result.affectedRows>0){
            res.send({code:1,msg:"更新成功"});
        }else{
            res.send({code:-1,msg:"更新失败"});
        }
    })
});
// userupdate ?uid=1&upwd=123 更新用户密码
///查找手机号是否重复
router.post("/phone",(req,res)=>{
    let phone = req.body.phone;

    let sql = "SELECT count(uid) as c FROM bld_user WHERE phone = ?";
    pool.query(sql,[phone],(err,result)=>{
        if(err)throw err;
        if(result[0].c){
            res.send({code: 1,msg:'手机号已注册'});
        }else{
            res.send({code: -1,msg:'可以注册'});
        }
    });
});

///查找用户信息
router.get("/userfind",(req,res)=>{
    let phone = parseInt(req.query.phone);
    let sql = "SELECT * FROM bld_user WHERE phone = ?";
    pool.query(sql,[phone],(err,result)=>{
        if(err)throw err;
        var obj = result[0];
        res.send({code:1,msg:obj});
    });
});

// 获取用户的可用金额
router.get('/getasset_can',(req,res)=>{
    let phone = req.query.phone;

    let sql = "SELECT asset_can,uid FROM bld_user WHERE phone = ?"
    pool.query(sql,[phone],(err,result)=>{
        if(err) throw err;
      res.send({code:1,asset_can: result[0].asset_can,uid:result[0].uid})
    })
});

// 更改 用户的可用金额与总金额
router.post('/assetcan',(req,res)=>{
    let asset_can = (req.body.asset_can) ;
    let asset_all = req.body.asset_all;
    if(asset_can<0||asset_all<0){
        res.send({code:-1,msg: '网络错误,请稍后重试!'})
    }
    let uid = (req.body.uid);
    let sql = 'UPDATE bld_user SET asset_can = ? ,asset_all =  ? WHERE uid = ?';
    pool.query(sql,[asset_can,asset_all,uid],(err,result)=>{
        if(err) throw err;
        if(result.affectedRows>0){
            res.send({code: 1,msg: '恭喜您,充值成功!'});
        }else{
            res.send({code: -1,msg: '网络错误,请稍后重试!'});
        }
    })
});
/// 用户开始购买
router.post('/buy',(req,res)=>{
    let phone = req.body.phone;
    let money = parseInt(req.body.money);

    let sql ="SELECT asset_can,asset_product FROM bld_user WHERE phone = ?"
    pool.query(sql,[phone],(err,result)=>{
    let asset_can = result[0].asset_can - money;
    let asset_product = result[0].asset_product + money;
    console.log( result[0].asset_can,asset_can,money);
    console.log(asset_product,money,result[0].asset_product);
    let sqlupdate = " UPDATE bld_user SET asset_can = ? ,asset_product =? WHERE phone = ?"
        pool.query(sqlupdate,[asset_can,asset_product,phone],(err,result)=>{
            if(err) throw err;
            if(result.affectedRows>0){
                res.send({code:1,msg:"购买成功"});
            }else{
                res.send({code:-1,msg:"购买失败"});
            }
        })
    })
});



//9:GET /userlist   ?pno=3&pageSize=10 分页
// 分页显示用户名,暂时用不上
router.get("/userlist",(req,res)=>{
    //参数
    let pno = parseInt(req.query.pno);///第几页
    let pageSize = parseInt(req.query.pageSize);//一页有几行
    let output = {};   //最终输出对象
    output.pno = pno;
    output.pageSize = pageSize;
    let progress = 0;  //sql执行进度
    //sql:
    let sql = "SELECT count(uid) as c FROM bld_user";
    pool.query(sql,(err,result)=>{
        if(err)throw err;
        let c = result[0].c;

        output.pageCount =  Math.ceil(c/pageSize);//保存总页数
        progress+=50;                   //进度条+50
        if(progress===100){              //进度条==100
            res.send(output);             //发送
        }
    });
    //sql:
    let sql2 = " SELECT uid,uname,phone,email  FROM bld_user LIMIT ?,?";
    let offset = (pno-1)*pageSize;
    pool.query(sql2,[offset,pageSize],(err,result)=>{
        if(err)throw err;
        output.data = result;     //当前页内容
        progress+=50;             //进度条
        if(progress===100){        //进度结束
            res.send(output);        //发送
        }
    });
});




module.exports = router;
