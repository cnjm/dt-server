export default () => ({
  http: {
    port: process.env.SERVER_PORT || 3000,
    bsUrl: process.env.BS_URL || "",
  },
  dataBase: {
    dbType: process.env.DB_TYPE || "mysql",
    dbHost: process.env.DB_HOST || "localhost",
    dbPort: parseInt(process.env.DB_PORT, 10) || 3306,
    dbUser: process.env.DB_USER || "root",
    dbPwd: process.env.DB_PWD || "root",
    dbDb: process.env.DB_DB,
    dbSyn: process.env.DB_SYN || true,
  },
  redis: {
    namespace: process.env.RD_NAME_SPACE || "default",
    port: parseInt(process.env.RD_PORT, 10) || 3306,
    db: parseInt(process.env.RD_DB, 10) || 0,
    host: process.env.RD_HOST || "127.0.0.1",
    password: process.env.RD_PWD || "",
  },
  jwt: {
    secret: process.env.SECRET || "123456",
    expiresIn: process.env.EXPIRES_IN || "168h",
  },
  qiniu: {
    accessKey: process.env.QINIU_ACCESS_KEY || "",
    secretKey: process.env.QINIU_SECRET_KEY || "",
    bucketName: process.env.QINIU_BUCKET_NAME || "bucket-name",
  },
  weapp: {
    appid: process.env.WEAPP_APPID || "",
    appSecret: process.env.WEAPP_APPSECRET || "",
  },
  dingtalk: {
    agentId: "2610752130",
    appKey: "dinge6n14malqgnyyiya",
    appSecret:
      "T89lngYWoAzp_mz2tVHkRBTWgPe29QQBXlJVDy8HcG8QI4PGGlj_Kv_Xn2nVGG4f",
    robotCode: "dinge6n14malqgnyyiya",
    coolAppCode: "COOLAPP-1-1023346CF28F213EF72C0004",
    messageCardTemplateId001: "dde980a2-fb8a-446e-9b72-70c45317b076",
    topCardTemplateId001: "e03f3551-f3b4-4a0d-8183-981ee70b1b41",
    openConversationId: "cidhuU5+oKfbiLZQhF1XIhGvA==",
  },
});
