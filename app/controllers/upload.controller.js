const db = require("../models");
var pool_db = require("../config/crdb.config").pool_db;
const shapefileToGeojson = require("shapefile-to-geojson");
const fs = require("fs");

const layLoaiDuLieuSHP = async (req) => {
  const geoJSON = await shapefileToGeojson.parseFiles(
    req.files[1].path.indexOf(".shp") != -1
      ? req.files[1].path
      : req.files[0].path,
    req.files[1].path.indexOf(".dbf") != -1
      ? req.files[1].path
      : req.files[0].path
  );
  console.log(JSON.stringify(geoJSON.features[0]));
  return geoJSON.features[0].geometry.type;
};

exports.themMoiDuLieu = async (req, res, next) => {
  // if (req.session.User) {
  // a();
  if (req.files.length > 0 && req.body.loaiFile == "0") {
    var loaiDuLieu = await layLoaiDuLieuSHP(req);
    await pool_db.connect(function (err, client, done) {
      if (err) {
        return console.log("error:" + err);
      } else {
        client.query(
          `insert into dulieunguoidung("tenDuLieu", "loaiDuLieu", "duongDanFileDuLieuSHP", "duongDanFileDuLieuDBF", "duongDanFileDuLieuExcel", "cheDoMacDinh", "loaiFile", "uId", "idDanhMuc", "colorStyle") values('${
            req.body.tenDuLieu
          }', '${loaiDuLieu}', ${
            req.body.loaiFile == "0"
              ? `${
                  req.files[1].path.indexOf(".shp") != -1
                    ? `'${req.files[1].path}'`
                    : `'${req.files[0].path}'`
                }, ${
                  req.files[1].path.indexOf(".dbf") != -1
                    ? `'${req.files[1].path}'`
                    : `'${req.files[0].path}'`
                }`
              : `'', ''`
          }, ${req.body.loaiFile == "0" ? `''` : `'${req.files[0].path}'`} ,${
            req.body.cheDoMacDinh == "true" ? 1 : 0
          }, ${req.body.loaiFile}, ${req.body.uId}, ${req.body.idDanhMuc}, '${
            req.body.colorStyle
          }')`,
          async function (err, result, row) {
            done();
            if (err) {
              res.end();
              return console.error("error running query", err);
            } else {
              const geoJSON = await shapefileToGeojson.parseFiles(
                req.files[1].path.indexOf(".shp") != -1
                  ? req.files[1].path
                  : req.files[0].path,
                req.files[1].path.indexOf(".dbf") != -1
                  ? req.files[1].path
                  : req.files[0].path
              );
              const ds = fs.createWriteStream(
                `app/public/uploads/geojson/${req.files[0].originalname
                  .replace(".shp", "")
                  .replace(".dbf", "")}.geojson`
              );
              ds.once("open", function () {
                ds.write(JSON.stringify(geoJSON));
                ds.end();
                res.json(result.rows);
              });
            }
          }
        );
      }
    });
  } // console.log(b);

  // } else {
  //   res.redirect("/login");
  // }
};

exports.kiemTraTaiKhoan = (req, res, next) => {
  if (req.session.User) {
    pool_db.connect(function (err, client, done) {
      if (err) {
        return console.log("error:" + err);
      } else {
        client.query(
          `select * from users where "userName" like '${req.query.userName}'`,
          function (err, result, row) {
            done();
            if (err) {
              res.end();
              return console.error("error running query", err);
            } else {
              // console.log(result.rows);
              res.json(result.rows);
            }
          }
        );
      }
    });
  } else {
    res.redirect("/login");
  }
};

const shpToGeojson = async (req) => {
  const geoJSON = await shapefileToGeojson.parseFiles(
    req.duongDanFileDuLieuSHP,
    req.duongDanFileDuLieuDBF
  );
  console.log(JSON.stringify(geoJSON.features[0].geometry.type));
  return geoJSON;
};

exports.danhSachDuLieu = (req, res, next) => {
  if (req.session.User) {
    // console.log(req.body);
    pool_db.connect(function (err, client, done) {
      if (err) {
        return console.log("error:" + err);
      } else {
        client.query(
          `select * from dulieunguoidung where "status" = 1 ${
            req.body.query.generalSearch
              ? `and "tenDuLieu" like '%${req.body.query.generalSearch}%'`
              : ""
          }`,
          function (err, result, row) {
            done();
            if (err) {
              res.end();
              return console.error("error running query", err);
            } else {
              var dsDuLieu = result.rows;
              pool_db.connect(function (err, client, done) {
                if (err) {
                  return console.log("error:" + err);
                } else {
                  client.query(
                    `select count(*) as countdulieu from dulieunguoidung where "status" = 1 ${
                      req.body.query.generalSearch
                        ? `and "tenDuLieu" like '%${req.body.query.generalSearch}%'`
                        : ""
                    }`,
                    function (err, result, row) {
                      done();
                      if (err) {
                        res.end();
                        return console.error("error running query", err);
                      } else {
                        var meta = {
                          page: 1,
                          pages: parseInt(result.rows[0].countdulieu) / 10,
                          perpage: 10,
                          total: parseInt(result.rows[0].countdulieu),
                          sort: "asc",
                          field: "gid",
                        };
                        res.json({
                          meta: meta,
                          data: dsDuLieu,
                        });
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
  } else {
    res.redirect("/login");
  }
};

exports.danhSachLopDuLieu = (req, res, next) => {
  if (req.session.User) {
    // console.log(req.body);
    pool_db.connect(function (err, client, done) {
      if (err) {
        return console.log("error:" + err);
      } else {
        client.query(
          `select * from dulieunguoidung where "status" = 1`,
          async function (err, result, row) {
            done();
            if (err) {
              res.end();
              return console.error("error running query", err);
            } else {
              await result.rows.forEach(async (element) => {
                element.geom = await shpToGeojson(element);
              });
              await setTimeout(() => {
                res.json(result.rows);
              }, 500);
            }
          }
        );
      }
    });
  } else {
    res.redirect("/login");
  }
};

exports.suaDuLieu = async (req, res, next) => {
  // if (req.session.User) {
  if (req.files.length > 0 && req.body.loaiFile == "0") {
    var loaiDuLieu = await layLoaiDuLieuSHP(req);
  }
  await pool_db.connect(function (err, client, done) {
    if (err) {
      return console.log("error:" + err);
    } else {
      console.log(req.body.cheDoMacDinh);
      console.log(
        `update dulieunguoidung set
        "idDanhMuc" = ${req.body.idDanhMuc},
         "tenDuLieu" = '${req.body.tenDuLieu ?? ``}', ${
          req.files.length > 0 && req.body.loaiFile == "0"
            ? ` "duongDanFileDuLieuSHP" = ${
                req.files[1].path.indexOf(".shp") != -1
                  ? `'${req.files[1].path}'`
                  : `'${req.files[0].path}'`
              }, "duongDanFileDuLieuDBF" = ${
                req.files[1].path.indexOf(".dbf") != -1
                  ? `'${req.files[1].path}'`
                  : `'${req.files[0].path}'`
              }, "loaiDuLieu" = '${loaiDuLieu}'`
            : ``
        } "cheDoMacDinh" = ${
          req.body.cheDoMacDinh == "true" ? 1 : 0
        }, "colorStyle" = '${req.body.colorStyle}' where "gid" = ${
          req.params.gid
        }`
      );
      client.query(
        `update dulieunguoidung set
        "idDanhMuc" = ${req.body.idDanhMuc},
         "tenDuLieu" = '${req.body.tenDuLieu ?? ``}', ${
          req.files.length > 0 && req.body.loaiFile == "0"
            ? ` "duongDanFileDuLieuSHP" = ${
                req.files[1].path.indexOf(".shp") != -1
                  ? `'${req.files[1].path}'`
                  : `'${req.files[0].path}'`
              }, "duongDanFileDuLieuDBF" = ${
                req.files[1].path.indexOf(".dbf") != -1
                  ? `'${req.files[1].path}'`
                  : `'${req.files[0].path}'`
              }, "loaiDuLieu" = '${loaiDuLieu}'`
            : ``
        }, "cheDoMacDinh" = ${
          req.body.cheDoMacDinh == "true" ? 1 : 0
        }, "colorStyle" = '${req.body.colorStyle}' where "gid" = ${
          req.params.gid
        }`,
        async function (err, result, row) {
          done();
          if (err) {
            res.end();
            return console.error("error running query", err);
          } else {
            if (req.files.length > 0 && req.body.loaiFile == "0") {
              const geoJSON = await shapefileToGeojson.parseFiles(
                req.files[1].path.indexOf(".shp") != -1
                  ? req.files[1].path
                  : req.files[0].path,
                req.files[1].path.indexOf(".dbf") != -1
                  ? req.files[1].path
                  : req.files[0].path
              );
              const ds = fs.createWriteStream(
                `app/public/uploads/geojson/${req.files[0].originalname
                  .replace(".shp", "")
                  .replace(".dbf", "")}.geojson`
              );
              ds.once("open", function () {
                ds.write(JSON.stringify(geoJSON));
                ds.end();
                res.json(result.rows);
              });
            } else {
              res.json(result.rows);
            }
          }
        }
      );
    }
  });
  // }
  // } else {
  //   res.redirect("/login");
  // }
};

exports.xoaDuLieu = (req, res, next) => {
  // if (req.session.User) {
  pool_db.connect(function (err, client, done) {
    if (err) {
      return console.log("error:" + err);
    } else {
      console.log(
        `update dulieunguoidung set "status" = 0 where "gid" = ${req.params.gid}`
      );
      client.query(
        `update dulieunguoidung set "status" = 0 where "gid" = ${req.params.gid}`,
        function (err, result, row) {
          done();
          if (err) {
            res.end();
            return console.error("error running query", err);
          } else {
            pool_db.connect(function (err, client, done) {
              if (err) {
                return console.log("error:" + err);
              } else {
                client.query(
                  `select * from dulieunguoidung where "status" = 1`,
                  async function (err, result, row) {
                    done();
                    if (err) {
                      res.end();
                      return console.error("error running query", err);
                    } else {
                      await setTimeout(() => {
                        res.json(result.rows[0]);
                      }, 500);
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
  // } else {
  //   res.redirect("/login");
  // }
};

exports.listDuLieu = (req, res) => {
  pool_db.connect(function (err, client, done) {
    if (err) {
      return console.error("error", err);
    }
    client.query(
      `select * from dulieunguoidung where "status" = 1`,
      function (err, result) {
        done();

        if (err) {
          res.end();
          return console.error("error running query", err);
        }
        res.json(result.rows);
      }
    );
  });
};

exports.viewDuLieu = (req, res) => {
  pool_db.connect(function (err, client, done) {
    if (err) {
      return console.error("error", err);
    }
    var gid = req.params.gid;
    client.query(
      `select * from dulieunguoidung where "gid" = ${gid}`,
      function (err, result) {
        done();

        if (err) {
          res.end();
          return console.error("error running query", err);
        }
        res.json(result.rows[0]);
      }
    );
  });
};

exports.SearchData = (req, res) => {
  let sqlFilter = `select * from dulieunguoidung where "tenDuLieu" like '%${req.query.tenDuLieu}%'`;
  pool_db.connect(function (err, client, done) {
    if (err) {
      return console.error("error", err);
    }
    client.query(sqlFilter, function (err, result) {
      done();

      if (err) {
        res.end();
        return console.error("error running query", err);
      }
      res.json(result.rows);
    });
  });
};

exports.themMoiDuLieu3D = async (req, res, next) => {
  await pool_db.connect(function (err, client, done) {
    if (err) {
      return console.log("error:" + err);
    } else {
      client.query(
        `insert into dulieu3d("ten", "duongdanfile", "iddanhmuc", "chedomacdinh", "ma") values('${req.body.ten}', '${req.file.path}', '${req.body.iddanhmuc}', ${
          req.body.chedomacdinh == "true" ? 1 : 0
        }, '${req.body.ma}')`,
        async function (err, result, row) {
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

exports.listDuLieu3D = (req, res) => {
  pool_db.connect(function (err, client, done) {
    if (err) {
      return console.error("error", err);
    }
    client.query(
      `select * from dulieu3d where "status" = 1`,
      function (err, result) {
        done();

        if (err) {
          res.end();
          return console.error("error running query", err);
        }
        res.json(result.rows);
      }
    );
  });
};

exports.SearchData3D = (req, res) => {
  let sqlFilter = `select * from dulieu3d where "ten" like '%${req.query.tenDuLieu}%'`;
  pool_db.connect(function (err, client, done) {
    if (err) {
      return console.error("error", err);
    }
    client.query(sqlFilter, function (err, result) {
      done();

      if (err) {
        res.end();
        return console.error("error running query", err);
      }
      res.json(result.rows);
    });
  });
};


exports.xoaDuLieu3D = (req, res, next) => {
  // if (req.session.User) {
  pool_db.connect(function (err, client, done) {
    if (err) {
      return console.log("error:" + err);
    } else {
      console.log(
        `update dulieunguoidung set "status" = 0 where "gid" = ${req.params.gid}`
      );
      client.query(
        `update dulieu3d set "status" = 0 where "id" = ${req.params.gid}`,
        function (err, result, row) {
          done();
          if (err) {
            res.end();
            return console.error("error running query", err);
          } else {
            pool_db.connect(function (err, client, done) {
              if (err) {
                return console.log("error:" + err);
              } else {
                client.query(
                  `select * from dulieu3d where "status" = 1`,
                  async function (err, result, row) {
                    done();
                    if (err) {
                      res.end();
                      return console.error("error running query", err);
                    } else {
                      await setTimeout(() => {
                        res.json(result.rows[0]);
                      }, 500);
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
  // } else {
  //   res.redirect("/login");
  // }
};

exports.viewDuLieu3D = (req, res) => {
  pool_db.connect(function (err, client, done) {
    if (err) {
      return console.error("error", err);
    }
    var gid = req.params.gid;
    client.query(
      `select * from dulieu3d where "id" = ${gid}`,
      function (err, result) {
        done();

        if (err) {
          res.end();
          return console.error("error running query", err);
        }
        res.json(result.rows[0]);
      }
    );
  });
};

exports.suaDuLieu3D = async (req, res, next) => {
  await pool_db.connect(function (err, client, done) {
    if (err) {
      return console.log("error:" + err);
    } else {
      client.query(
        `update dulieu3d set ten = '${req.body.ten}', iddanhmuc = '${req.body.iddanhmuc}', chedomacdinh = 
        insert into dulieu3d("ten", "duongdanfile", "iddanhmuc", "chedomacdinh", "ma") values('${req.body.ten}', '${req.file.path}', '${req.body.iddanhmuc}', ${
          req.body.chedomacdinh == "true" ? 1 : 0
        }, '${req.body.ma}')`,
        async function (err, result, row) {
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
