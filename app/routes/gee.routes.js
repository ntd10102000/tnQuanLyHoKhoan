const { authJwt } = require("../middlewares");
const controller = require("../controllers/gee.controller");
var pool_db = require("../config/crdb.config").pool_db;
var multer = require("multer");
var store = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "app/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
var upload = multer({ storage: store });

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });

  app.get("/", controller.homeUser);
  app.get("/2D", controller.mapBox);
  app.post("/api/capNhatTaiSan", controller.capNhatTaiSan);
  app.get("/search/:search", controller.searchHoKhoan);
  app.get("/api/queryDuLieu/:tenDuLieu", controller.queryDuLieu);
  app.get("/api/cauHinhDuLieu/:tenDuLieu", controller.cauHinhDuLieu);
  app.post("/api/themMoiTaiSan", controller.themMoiTaiSan);
  app.get("/api/searchHoKhoan/:search", controller.searchHoKhoan);
  app.get("/searchQ", controller.searchHoKhoanQ);
  app.get("/dlgj/:tenDuLieu", controller.taiDuLieuGJ);
  app.get("/dlshp/:tenDuLieu", controller.taiDuLieuSHP);
  app.get("/api/cauHinhTaiSan", controller.cauHinhTaiSan);
  app.get("/dl3d/:tenDuLieu", controller.taiDuLieu3D);

};
