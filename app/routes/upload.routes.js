// const { authJwt } = require("../middleware");
const controller = require("../controllers/upload.controller");
const bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: false });

const guid12 = () => {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(25)
      .substring(1);
  }
  return s4() + s4() + s4();
};
var multer = require("multer");
var store = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "app/public/uploads/fileImport");
  },
  filename: function (req, file, cb) {
    cb(null, `${guid12()}${file.originalname}`);
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

  // post
  app.post(
    "/quanliTN/api/upLoad/upLoadFile",
    upload.array("fileImport", 2),
    controller.themMoiDuLieu
  );

  app.get("/quanliTN/api/upLoad/listDuLieu", controller.listDuLieu);

  app.get("/quanliTN/api/upLoad/viewDuLieu/:gid", controller.viewDuLieu);

  app.post("/quanliTN/api/upLoad/deleteDuLieu/:gid", controller.xoaDuLieu);

  app.post(
    "/quanliTN/api/upLoad/updateDuLieu/:gid",
    upload.array("fileImport", 2),
    controller.suaDuLieu
  );

  app.post(
    "/quanliTN/api/upLoad/addDuLieu",
    upload.array("fileImport", 2),
    controller.themMoiDuLieu
  );

  app.get("/quanliTN/api/searchData", controller.SearchData);
};
