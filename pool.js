const mysql = require('mysql');////导入第三方包,mysql ,以require 的方式导入
let pool = mysql.createPool({/////创建线程连接池,更加高效,可以自动关闭连接
    host:SAE_MYSQL_HOST_M, //连接的主机地址
    user:SAE_MYSQL_USER,        //数据库的用户名
    password: SAE_MYSQL_PASS,
    database:SAE_MYSQL_DB,
    port:SAE_MYSQL_PORT,
    connectionLimit: 5

});
module.exports = pool;///更改模块导出对象,为pool连接池