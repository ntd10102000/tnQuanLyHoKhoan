var pool_db = require("../config/crdb.config").pool_db;
// const db = require("../models");
// const config = require("../config/auth.config");
// const { verifySignUp } = require("../middlewares");
const fs = require("fs");

var shpwrite = require("shp-write");

exports.homeUser = (req, res) => {
  var duongOngNuoc = {};
  var loKhoan = {};
  var quanHuyen = {};
  var duongOngCapNuoc = {};
  pool_db.connect(function (err, client, done) {
    if (err) {
      return console.log("error:" + err);
    } else {
      client.query(
        `SELECT row_to_json(fc) FROM (SELECT 'FeatureCollection' As type, 
        array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type, 
        ST_AsGeoJSON(lg."geom")::json As geometry,
        row_to_json((lg.*)) As properties FROM duong_ong_thoat_nuoc As lg) As f)
         As fc;SELECT row_to_json(fc) FROM (SELECT 'FeatureCollection' As type, 
         array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type, 
         ST_AsGeoJSON(lg."geom")::json As geometry,
         row_to_json((lg.*)) As properties FROM hokhoan As lg) As f)
          As fc;SELECT row_to_json(fc) FROM (SELECT 'FeatureCollection' As type, 
          array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type, 
          ST_AsGeoJSON(lg."geom")::json As geometry,
          json_build_object('name_2',lg.name_2) As properties FROM quan_huyen As lg) As f)
           As fc;SELECT row_to_json(fc) FROM (SELECT 'FeatureCollection' As type, 
           array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type, 
           ST_AsGeoJSON(lg."geom")::json As geometry,
           row_to_json((lg.*)) As properties FROM duong_ong_cap_nuoc As lg) As f)
            As fc;SELECT row_to_json(fc) FROM (SELECT 'FeatureCollection' As type, 
            array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type, 
            ST_AsGeoJSON(lg."geom")::json As geometry,
            json_build_object('wid',lg.wid) As properties FROM tang_ham As lg) As f)
             As fc;SELECT row_to_json(fc) FROM (SELECT 'FeatureCollection' As type, 
             array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type, 
             ST_AsGeoJSON(lg."geom")::json As geometry,
             row_to_json((lg.*)) As properties FROM giao_thong_ngam As lg) As f)
              As fc;
              SELECT row_to_json(fc) FROM (SELECT 'FeatureCollection' As type, 
             array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type, 
             ST_AsGeoJSON(lg."geom")::json As geometry,
             row_to_json((lg.macongtrin, lg.soluongtan)) As properties FROM cockhoannhoi As lg) As f)
              As fc;`,
        function (err, result, row) {
          done();
          if (err) {
            res.end();
            return console.error("error running query", err);
          } else {
            duongOngNuoc = result[0].rows[0].row_to_json;
            loKhoan = result[1].rows[0].row_to_json;
            quanHuyen = result[2].rows[0].row_to_json;
            duongOngCapNuoc = result[3].rows[0].row_to_json;
            res.render("index", {
              results: {
                duongOngNuoc: duongOngNuoc,
                loKhoan: loKhoan,
                quanHuyen: quanHuyen,
                duongOngCapNuoc: duongOngCapNuoc,
                tangHam: result[4].rows[0].row_to_json,
                giaoThongNgam: result[5].rows[0].row_to_json,
                cocKhoanNhoi: result[6].rows[0].row_to_json,
              },
            });
          }
        }
      );
    }
  });
};

exports.mapBox = (req, res) => {
  var duongOngNuoc = {};
  var loKhoan = {};
  var quanHuyen = {};
  var duongOngCapNuoc = {};
  var cauHinhHoKhoan = {};

  pool_db.connect(function (err, client, done) {
    if (err) {
      return console.log("error:" + err);
    } else {
      client.query(
        `SELECT row_to_json(fc) FROM (SELECT 'FeatureCollection' As type, 
        array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type, 
        ST_AsGeoJSON(lg."geom")::json As geometry,
        row_to_json((lg.*)) As properties FROM duongongthoatnuoc As lg) As f)
         As fc;SELECT row_to_json(fc) FROM (SELECT 'FeatureCollection' As type, 
         array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type, 
         ST_AsGeoJSON(lg."geom")::json As geometry,
         row_to_json((lg.*)) As properties FROM hokhoan As lg) As f)
          As fc;SELECT row_to_json(fc) FROM (SELECT 'FeatureCollection' As type, 
          array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type, 
          ST_AsGeoJSON(lg."geom")::json As geometry,
          row_to_json((lg.*)) As properties FROM quan_huyen As lg) As f)
           As fc;SELECT row_to_json(fc) FROM (SELECT 'FeatureCollection' As type, 
           array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type, 
           ST_AsGeoJSON(lg."geom")::json As geometry,
           row_to_json((lg.*)) As properties FROM duongongcapnuoc As lg) As f)
            As fc;SELECT * FROM information_schema.columns WHERE table_name = 'hokhoan';SELECT row_to_json(fc) FROM (SELECT 'FeatureCollection' As type, 
            array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type, 
            ST_AsGeoJSON(lg."geom")::json As geometry,
            row_to_json((lg.*)) As properties FROM fc_duongdayvienthongthongtin As lg) As f)
             As fc;`,
        function (err, result, row) {
          done();
          if (err) {
            res.end();
            return console.error("error running query", err);
          } else {
            duongOngNuoc = result[0].rows[0].row_to_json;
            loKhoan = result[1].rows[0].row_to_json;
            quanHuyen = result[2].rows[0].row_to_json;
            duongOngCapNuoc = result[3].rows[0].row_to_json;
            cauHinhHoKhoan = result[4].rows;
            res.render("mapbox", {
              results: {
                duongOngNuoc: duongOngNuoc,
                loKhoan: loKhoan,
                quanHuyen: quanHuyen,
                duongOngCapNuoc: duongOngCapNuoc,
                cauHinhHoKhoan: cauHinhHoKhoan,
                duongGiayVienThongThongTin: result[5].rows[0].row_to_json,
              },
            });
          }
        }
      );
    }
  });
};

exports.searchHoKhoan = (req, res) => {
  pool_db.connect(function (err, client, done) {
    if (err) {
      return console.log("error:" + err);
    } else {
      client.query(
        `SELECT row_to_json(fc) FROM (SELECT 'FeatureCollection' As type, 
        array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type, 
        ST_AsGeoJSON(lg."geom")::json As geometry,
        row_to_json((lg.*)) As properties, lg.tenhokhoan as name, lg.tenhokhoan as id FROM hokhoan As lg) As f)
         As fc;
         SELECT row_to_json(fc) FROM (SELECT 'FeatureCollection' As type, 
        array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type, 
        ST_AsGeoJSON(lg."geom")::json As geometry,
        row_to_json((lg.*)) As properties, lg.maduongong as name, lg.maduongong as id FROM duongongcapnuoc As lg) As f)
         As fc;
         SELECT row_to_json(fc) FROM (SELECT 'FeatureCollection' As type, 
        array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type, 
        ST_AsGeoJSON(lg."geom")::json As geometry,
        row_to_json((lg.*)) As properties, lg.matuyentho as name, lg.matuyentho as id FROM duongongthoatnuoc As lg) As f)
         As fc
         `,
        function (err, result, row) {
          done();
          if (err) {
            res.end();
            return console.error("error running query", err);
          } else {
            var a = result[0].rows[0].row_to_json;
            var b = result[1].rows[0].row_to_json;
            var c = result[2].rows[0].row_to_json;
            a.features = a.features.concat(b.features, c.features);
            // console.log(a.features);
            res.json(a);
          }
        }
      );
    }
  });
};

exports.searchHoKhoanQ = (req, res) => {
  pool_db.connect(function (err, client, done) {
    if (err) {
      return console.log("error:" + err);
    } else {
      client.query(
        `select "tenhokhoan" as display_name, ST_AsGeoJSON(hokhoan."geom")::json as boundingbox from hokhoan where "tenhokhoan" ilike '%${req.query.q}%';
        select "maduongong" as display_name, ST_AsGeoJSON(duongongcapnuoc."geom")::json as boundingbox from duongongcapnuoc where "maduongong" ilike '%${req.query.q}%';
        select "matuyentho" as display_name, ST_AsGeoJSON(duongongthoatnuoc."geom")::json as boundingbox from duongongthoatnuoc where "matuyentho" ilike '%${req.query.q}%';
        `,
        function (err, result, row) {
          done();
          if (err) {
            res.end();
            return console.error("error running query", err);
          } else {
            res.json(result[0].rows.concat(result[1].rows, result[2].rows));
          }
        }
      );
    }
  });
};

exports.capNhatTaiSan = (req, res) => {
  pool_db.connect(function (err, client, done) {
    if (err) {
      return console.log("error:" + err);
    } else {
      client.query(
        `SELECT * FROM information_schema.columns WHERE table_name = 'hokhoan';`,
        function (err, result, row) {
          done();
          if (err) {
            res.end();
            return console.error("error running query", err);
          } else {
            console.log(
              `update hokhoan set "mahokhoan" = '${req.body.mahokhoan}', "tenhokhoan" = '${req.body.tenhokhoan}', "chieusauho" = ${req.body.chieusauho}, "caodomieng" = ${req.body.caodomieng}, "loaicautru" = '${req.body.loaicautru}',"quanhuyen" = '${req.body.quanhuyen}',"phuongxa" = '${req.body.phuongxa}',"bedaydatla" = '${req.body.bedaydatla}', "bedaylop1" = ${req.body.bedaylop1},"bedaylop2" = ${req.body.bedaylop2},"bedaylop3" = ${req.body.bedaylop3},"bedaylop4" = ${req.body.bedaylop4},"bedaylop5" = ${req.body.bedaylop5},"bedaylop6" = ${req.body.bedaylop6},"bedaylop7" = ${req.body.bedaylop7},"bedaylop8" = ${req.body.bedaylop8},"bedaylop9" = ${req.body.bedaylop9},"bedaylop10" = ${req.body.bedaylop10},"bedaylop11" = ${req.body.bedaylop11},"bedaylop12" = ${req.body.bedaylop12},"bedaylop13" = ${req.body.bedaylop13},"bedaylop14" = ${req.body.bedaylop15},"bedaylop16" = ${req.body.bedaylop16},"bedaylop17" = ${req.body.bedaylop17},"bedaylop18" = ${req.body.bedaylop18},"bedaylop19" = ${req.body.bedaylop19} where "gid" = ${req.body.gid}`
            );
            pool_db.connect(function (err, client, done) {
              if (err) {
                return console.log("error:" + err);
              } else {
                client.query(
                  `update hokhoan set "mahokhoan" = '${req.body.mahokhoan}', "tenhokhoan" = '${req.body.tenhokhoan}', "chieusauho" = ${req.body.chieusauho}, "caodomieng" = ${req.body.caodomieng}, "loaicautru" = '${req.body.loaicautru}',"quanhuyen" = '${req.body.quanhuyen}',"phuongxa" = '${req.body.phuongxa}', "bedaylop1" = ${req.body.bedaylop1},"bedaylop2" = ${req.body.bedaylop2},"bedaylop3" = ${req.body.bedaylop3},"bedaylop4" = ${req.body.bedaylop4},"bedaylop5" = ${req.body.bedaylop5},"bedaylop6" = ${req.body.bedaylop6},"bedaylop7" = ${req.body.bedaylop7},"bedaylop8" = ${req.body.bedaylop8},"bedaylop9" = ${req.body.bedaylop9},"bedaylop10" = ${req.body.bedaylop10},"bedaylop11" = ${req.body.bedaylop11},"bedaylop12" = ${req.body.bedaylop12},"bedaylop13" = ${req.body.bedaylop13},"bedaylop14" = ${req.body.bedaylop15},"bedaylop16" = ${req.body.bedaylop16},"bedaylop17" = ${req.body.bedaylop17},"bedaylop18" = ${req.body.bedaylop18},"bedaylop19" = ${req.body.bedaylop19} where "gid" = ${req.body.gid}`,
                  function (err, result, row) {
                    done();
                    if (err) {
                      res.end();
                      return console.error("error running query", err);
                    } else {
                      res.json(result.rows);
                    }
                  }
                );
              }
            });
          }
        }
      );
    }
  });
};

exports.queryDuLieu = (req, res) => {
  pool_db.connect(function (err, client, done) {
    if (err) {
      return console.log("error:" + err);
    } else {
      client.query(
        `SELECT row_to_json(fc) FROM (SELECT 'FeatureCollection' As type, 
        array_to_json(array_agg(f)) As features FROM (SELECT 'Feature' As type, 
        ST_AsGeoJSON(lg."geom")::json As geometry,
        row_to_json((lg.*)) As properties FROM ${req.params.tenDuLieu} As lg) As f)
         As fc;`,
        function (err, result, row) {
          done();
          if (err) {
            res.end();
            return console.error("error running query", err);
          } else {
            res.json(result.rows[0].row_to_json);
          }
        }
      );
    }
  });
};

exports.cauHinhDuLieu = (req, res) => {
  pool_db.connect(function (err, client, done) {
    if (err) {
      return console.log("error:" + err);
    } else {
      client.query(
        `SELECT * FROM information_schema.columns WHERE table_name = '${req.params.tenDuLieu}';`,
        function (err, result, row) {
          done();
          if (err) {
            res.end();
            return console.error("error running query", err);
          } else {
            let arrRes = result.rows.map((element) => {
              if (element.column_name == "gid") {
                element.alias = "gid";
              }
              if (element.column_name == "objectid") {
                element.alias = "objectid";
              }
              if (element.column_name == "mahokhoan") {
                element.alias = "Mã hố khoan";
              }
              if (element.column_name == "tenhokhoan") {
                element.alias = "Tên hố khoan";
              }
              if (element.column_name == "chieusauho") {
                element.alias = "Chiều sâu hố khoan";
              }
              if (element.column_name == "caodomieng") {
                element.alias = "Cao độ miệng hố khoan";
              }
              if (element.column_name == "loaicautru") {
                element.alias = "Loại cấu trúc nền";
              }
              if (element.column_name == "quanhuyen") {
                element.alias = "Quận Huyện";
              }
              if (element.column_name == "phuongxa") {
                element.alias = "Phường Xã";
              }
              if (element.column_name == "bedaydatla") {
                element.alias = "bedaydatla";
              }
              if (element.column_name == "bedaylop1") {
                element.alias = "Lớp 1";
              }
              if (element.column_name == "bedaylop2") {
                element.alias = "Lớp 2";
              }
              if (element.column_name == "bedaylop3") {
                element.alias = "Lớp 3";
              }
              if (element.column_name == "bedaylop4") {
                element.alias = "Lớp 4";
              }
              if (element.column_name == "bedaylop5") {
                element.alias = "Lớp 5";
              }
              if (element.column_name == "bedaylop6") {
                element.alias = "Lớp 6";
              }
              if (element.column_name == "bedaylop7") {
                element.alias = "Lớp 7";
              }
              if (element.column_name == "bedaylop8") {
                element.alias = "Lớp 8";
              }
              if (element.column_name == "bedaylop9") {
                element.alias = "Lớp 9";
              }
              if (element.column_name == "bedaylop10") {
                element.alias = "Lớp 10";
              }
              if (element.column_name == "bedaylop11") {
                element.alias = "Lớp 11";
              }
              if (element.column_name == "bedaylop12") {
                element.alias = "Lớp 12";
              }
              if (element.column_name == "bedaylop13") {
                element.alias = "Lớp 13";
              }
              if (element.column_name == "bedaylop14") {
                element.alias = "Lớp 14";
              }
              if (element.column_name == "bedaylop15") {
                element.alias = "Lớp 15";
              }
              if (element.column_name == "bedaylop16") {
                element.alias = "Lớp 16";
              }
              if (element.column_name == "bedaylop17") {
                element.alias = "Lớp 17";
              }
              if (element.column_name == "bedaylop18") {
                element.alias = "Lớp 18";
              }
              if (element.column_name == "bedaylop19") {
                element.alias = "Lớp 19";
              }
              if (element.column_name == "geom") {
                element.alias = "geom";
              }
              return element;
            });

            res.json(arrRes);
          }
        }
      );
    }
  });
};

exports.themMoiTaiSan = (req, res) => {
  console.log(req.body);
  console.log(
    `insert into hokhoan("mahokhoan", "tenhokhoan", "chieusauho", "caodomieng", "loaicautru", "quanhuyen", "phuongxa", "bedaydatla", "bedaylop1", "bedaylop2", "bedaylop3", "bedaylop4", "bedaylop5", "bedaylop6", "bedaylop7", "bedaylop8", "bedaylop9", "bedaylop10", "bedaylop11", "bedaylop12", "bedaylop13", "bedaylop14", "bedaylop15", "bedaylop16", "bedaylop17", "bedaylop18", "bedaylop19", "geom") values('${req.body.mahokhoan}','${req.body.tenhokhoan}',${req.body.chieusauho},${req.body.caodomieng},'${req.body.loaicautru}','${req.body.quanhuyen}','${req.body.phuongxa}',${req.body.bedaydatla},${req.body.bedaylop1},${req.body.bedaylop2},${req.body.bedaylop3},${req.body.bedaylop4},${req.body.bedaylop5},${req.body.bedaylop6},${req.body.bedaylop7},${req.body.bedaylop8},${req.body.bedaylop9},${req.body.bedaylop10},${req.body.bedaylop11},${req.body.bedaylop12},${req.body.bedaylop13},${req.body.bedaylop14},${req.body.bedaylop15},${req.body.bedaylop16},${req.body.bedaylop17},${req.body.bedaylop18},${req.body.bedaylop19},ST_SetSRID(ST_MakePoint(${req.body.long},${req.body.lat}),4326)))`
  );
  pool_db.connect(function (err, client, done) {
    if (err) {
      return console.log("error:" + err);
    } else {
      client.query(
        `insert into hokhoan("mahokhoan", "tenhokhoan", "chieusauho", "caodomieng", "loaicautru", "quanhuyen", "phuongxa", "bedaydatla", "bedaylop1", "bedaylop2", "bedaylop3", "bedaylop4", "bedaylop5", "bedaylop6", "bedaylop7", "bedaylop8", "bedaylop9", "bedaylop10", "bedaylop11", "bedaylop12", "bedaylop13", "bedaylop14", "bedaylop15", "bedaylop16", "bedaylop17", "bedaylop18", "bedaylop19", "geom") values('${req.body.mahokhoan}','${req.body.tenhokhoan}',${req.body.chieusauho},${req.body.caodomieng},'${req.body.loaicautru}','${req.body.quanhuyen}','${req.body.phuongxa}',${req.body.bedaydatla},${req.body.bedaylop1},${req.body.bedaylop2},${req.body.bedaylop3},${req.body.bedaylop4},${req.body.bedaylop5},${req.body.bedaylop6},${req.body.bedaylop7},${req.body.bedaylop8},${req.body.bedaylop9},${req.body.bedaylop10},${req.body.bedaylop11},${req.body.bedaylop12},${req.body.bedaylop13},${req.body.bedaylop14},${req.body.bedaylop15},${req.body.bedaylop16},${req.body.bedaylop17},${req.body.bedaylop18},${req.body.bedaylop19},ST_SetSRID(ST_MakePoint(${req.body.long},${req.body.lat}),4326)))`,
        function (err, result, row) {
          done();
          if (err) {
            res.end();
            return console.error("error running query", err);
          } else {
            res.json(result.rows);
          }
        }
      );
    }
  });
};

exports.taiDuLieuGJ = (req, res) => {
  res.download(`app/public/uploads/geojson/${req.params.tenDuLieu}.geojson`);
};

const { convert } = require("geojson2shp");

exports.taiDuLieuSHP = (req, res) => {
  const options = {
    layer: `${req.params.tenDuLieu}`,
    targetCrs: 4326,
  };
  const conshp = async () => {
    await convert(
      `app/public/uploads/geojson/${req.params.tenDuLieu}.geojson`,
      `app/public/uploads/geojson/${req.params.tenDuLieu}.zip`,
      options
    );
    await res.download(
      `app/public/uploads/geojson/${req.params.tenDuLieu}.zip`
    );
  };
  conshp();
};
