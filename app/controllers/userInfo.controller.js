const db = require("../models");
// const UserInfo = db.userInfoTour;
// const config = require("../config/auth.config");
// const { isUser } = require("../middleware/authJwt");
var pool_db = require("../config/crdb.config").pool_db;
const md5 = require("md5");

//Tour
exports.ListBookTour = (req, res) => {
  pool_db.connect(function (err, client, done) {
    if (err) {
      return console.error("error", err);
    }
    client.query(`select * from book_tour_info`, function (err, result) {
      done();

      if (err) {
        res.end();
        return console.error("error running query", err);
      }
      res.json(result.rows);
    });
  });
};

exports.BookTour = async (req, res) => {
  console.log(`insert into book_tour_info("fullname", "phonenumber", "cmt", "email" , "address",
    "nametour", "start",  "imgURL" , "priceTour","note", "createdAt" , "idTour" , "idUser" , "status") values
                ('${req.body.fullname}', '${req.body.phonenumber}' ,'${req.body.cmt}',
                '${req.body.email}', '${req.body.address}','${req.body.nametour}', '${req.body.start}',
                 '${req.body.imgURL}', ${req.body.priceTour} ,'${req.body.note}',
                '${req.body.createdAt}', ${req.body.idTour} , ${req.body.idUser} , 1 )`);
  pool_db.connect(function (err, client, done) {
    if (err) {
      return console.error("error", err);
    }
    client.query(
      `insert into book_tour_info("fullname", "phonenumber", "cmt", "email" , "address",
            "nametour", "start",  "imgURL" , "priceTour","note", "createdAt" , "idTour" , "idUser" , "status") values
                        ('${req.body.fullname}', '${req.body.phonenumber}' ,'${req.body.cmt}',
                        '${req.body.email}', '${req.body.address}','${req.body.nametour}', '${req.body.start}',
                         '${req.body.imgURL}', ${req.body.priceTour} ,'${req.body.note}',
                        '${req.body.createdAt}', ${req.body.idTour} , ${req.body.idUser} , 1)`,
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

  // await UserInfo.create({
  //  id:req.body.id,
  //  fullname:req.body.fullname,
  //  cmt:req.body.cmt,
  //  phonenumber:req.body.phonenumber,
  //  address:req.body.address,
  //  email:req.body.email,
  //  idTour:req.body.idTour,
  //  nametour:req.body.nametour,
  //  priceTour:req.body.priceTour,
  //  start:req.body.start,
  //  idUser:req.body.idUser,
  //  note:req.body.note,
  //  imgURL:req.body.imgURL,
  //  createdAt:req.body.createdAt,

  // })
  //   .then(() => {
  //     res.status(200).json({message:"tHành CôNG"});
  //   })
  //   .catch(err => {
  //     res.status(500).send({ message: err.message });
  //   });
};

exports.DeleteBookingTour = (req, res) => {
  pool_db.connect(function (err, client, done) {
    if (err) {
      return console.error("error", err);
    }
    client.query(
      `delete from book_tour_info where "id" = ${req.params.id}`,
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

exports.PersonalBookingTour = (req, res) => {
  pool_db.connect(function (err, client, done) {
    if (err) {
      return console.error("error", err);
    }
    var idUser = req.params.idUser;
    client.query(
      `SELECT * FROM book_tour_info  WHERE book_tour_info."idUser" = ${idUser}`,
      function (err, result) {
        done();

        if (err) {
          res.end();
          return console.error("error running query", err);
        }
        return res.json(result.rows);
      }
    );
  });
};

//Hotel
exports.ListBookHotel = (req, res) => {
  pool_db.connect(function (err, client, done) {
    if (err) {
      return console.error("error", err);
    }
    client.query(`select * from book_hotel_info`, function (err, result) {
      done();

      if (err) {
        res.end();
        return console.error("error running query", err);
      }
      res.json(result.rows);
    });
  });
};

// exports.BookHotel = (req, res) => {
//     console.log(`insert into book_hotel_info("fullname","cmt","phonenumber","email", "address", "note", "hotelName", "price", "idUser", "imgURL", "createdAt", "status", "start") values
//     ('${req.body.fullname}', '${req.body.cmt}','${req.body.phonenumber}','${req.body.email}','${req.body.address}','${req.body.note}','${req.body.hotelName}',
//      '${req.body.price}','${req.body.idUser}', '${req.body.imgURL}', '${req.body.createdAt}' ,  ${req.body.status}, '${req.body.start}')`);
//     pool_db.connect(function (err, client, done) {
//         if (err) {
//             return console.error('error', err);
//         }
//         client.query(`select * from book_hotel_info where "phonenumber" like '${req.body.phonenumber}'`, function (err, result) {
//             done();

//             if (err) {
//                 res.end();
//                 return console.error('error running query', err);
//             }
//             else {
//                 if (result.rows.length <= 0) {
//                     console.log('sdt bi trung sddsadasdsa', result.rows)

//                     pool_db.connect(function (err, client, done) {
//                         if (err) {
//                             return console.error('error', err);
//                         }
//                         client.query(`insert into book_hotel_info("fullname","cmt","phonenumber","email", "address", "note", "hotelName", "price", "idUser", "imgURL", "createdAt", "status", "start") values
//                         ('${req.body.fullname}', '${req.body.cmt}','${req.body.phonenumber}','${req.body.email}','${req.body.address}','${req.body.note}','${req.body.hotelName}',
//                          '${req.body.price}','${req.body.idUser}', '${req.body.imgURL}', '${req.body.createdAt}' ,  ${req.body.status}, '${req.body.start}')`, function (err, result) {
//                             done();

//                             if (err) {
//                                 res.end();
//                                 return console.error('error running query', err);
//                             }
//                             res.json(result.rows);
//                         });
//                     });
//                 } else {
//                     console.log('sdt bi trung')
//                 }

//             }
//         });
//     });
// };

exports.BookHotel = (req, res) => {
  console.log(`insert into book_hotel_info("fullname","cmt","phonenumber","email", "address", "note", "hotelName", "price", "idUser", "imgURL", "createdAt", "status", "start") values
    ('${req.body.fullname}', '${req.body.cmt}','${req.body.phonenumber}','${req.body.email}','${req.body.address}','${req.body.note}','${req.body.hotelName}',
     '${req.body.price}','${req.body.idUser}', '${req.body.imgURL}', '${req.body.createdAt}' ,  1, '${req.body.start}')`);
  pool_db.connect(function (err, client, done) {
    if (err) {
      return console.error("error", err);
    }

    pool_db.connect(function (err, client, done) {
      if (err) {
        return console.error("error", err);
      }
      client.query(
        `insert into book_hotel_info("fullname","cmt","phonenumber","email", "address", "note", "hotelName", "price", "idUser", "imgURL", "createdAt", "status", "start") values
                        ('${req.body.fullname}', '${req.body.cmt}','${req.body.phonenumber}','${req.body.email}','${req.body.address}','${req.body.note}','${req.body.hotelName}',
                         '${req.body.price}','${req.body.idUser}', '${req.body.imgURL}', '${req.body.createdAt}' ,  1, '${req.body.start}')`,
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
  });
};

exports.DeleteBookingHotel = (req, res) => {
  pool_db.connect(function (err, client, done) {
    if (err) {
      return console.error("error", err);
    }
    client.query(
      `delete from book_hotel_info where "id" = ${req.params.id}`,
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

// exports.BookTourUser = (req, res) => {
//     pool_db.connect(function (err, client, done) {
//         if (err) {
//             return console.error('error', err);
//         }
//         client.query(`select * from book_tour`, function (err, result) {
//             done();

//             if (err) {
//                 res.end();
//                 return console.error('error running query', err);
//             }
//             res.json(result.rows);
//         });
//     });

// };

exports.PersonalBookingHotel = (req, res) => {
  pool_db.connect(function (err, client, done) {
    if (err) {
      return console.error("error", err);
    }
    var idUser = req.params.idUser;

    client.query(
      `SELECT * FROM book_hotel_info WHERE book_hotel_info."idUser" = ${idUser}`,
      function (err, result) {
        done();

        if (err) {
          res.end();
          return console.error("error running query", err);
        }

        return res.json(result.rows);
      }
    );
  });
};

// checkStatusTour

exports.SetStatusBookTourFromAccuracyToHappenning = (req, res) => {
  pool_db.connect(function (err, client, done) {
    if (err) {
      return console.error("error", err);
    }
    var id = req.params.id;
    client.query(
      `update book_tour_info set "status" = 2  where "id" = ${req.params.id}`,
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

exports.SetStatusBookTourFromHappenningToComplete = (req, res) => {
  pool_db.connect(function (err, client, done) {
    if (err) {
      return console.error("error", err);
    }
    var id = req.params.id;
    client.query(
      `update book_tour_info set "status" = 3  where "id" = ${req.params.id}`,
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

exports.SetStatusBookTourToCancelled = (req, res) => {
  pool_db.connect(function (err, client, done) {
    if (err) {
      return console.error("error", err);
    }
    var id = req.params.id;
    client.query(
      `update book_tour_info set "status" = 4  where "id" = ${req.params.id}`,
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

// checkStatusHotel

exports.SetStatusBookHotelFromAccuracyToHappenning = (req, res) => {
  pool_db.connect(function (err, client, done) {
    if (err) {
      return console.error("error", err);
    }
    var id = req.params.id;
    client.query(
      `update book_hotel_info set "status" = 2  where "id" = ${req.params.id}`,
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

exports.SetStatusBookHotelFromHappenningToComplete = (req, res) => {
  pool_db.connect(function (err, client, done) {
    if (err) {
      return console.error("error", err);
    }
    var id = req.params.id;
    client.query(
      `update book_hotel_info set "status" = 3  where "id" = ${req.params.id}`,
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

exports.SetStatusBookHotelToCancelled = (req, res) => {
  pool_db.connect(function (err, client, done) {
    if (err) {
      return console.error("error", err);
    }
    var id = req.params.id;
    client.query(
      `update book_hotel_info set "status" = 4  where "id" = ${req.params.id}`,
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
// Tính tổng doanh thu
exports.GetAmount = (req, res) => {
  pool_db.connect(function (err, client, done) {
    if (err) {
      return console.error("error", err);
    }
    var status = req.params.status;
    client.query(
      `select sum(book_tour_info."priceTour" ) as revenue, count(book_tour_info."priceTour" ) as count 
        FROM book_tour_info where status = ${req.params.status}`,
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

exports.GetRevenue = (req, res) => {
  pool_db.connect(function (err, client, done) {
    if (err) {
      return console.error("error", err);
    }
    var status = req.params.status;
    client.query(
      `select sum(book_tour_info."priceTour" ) as revenue FROM book_tour_info where status = ${req.params.status}`,
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

exports.GetRevenue = (req, res) => {
  pool_db.connect(function (err, client, done) {
    if (err) {
      return console.error("error", err);
    }
    var status = req.params.status;
    client.query(
      `select sum(book_tour_info."priceTour" ) as revenue FROM book_tour_info where status = ${req.params.status}`,
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

exports.TotalAmount = (req, res) => {
  pool_db.connect(function (err, client, done) {
    if (err) {
      return console.error("error", err);
    }
    client.query(
      `select  count(book_tour_info."id" ) as totalAmount FROM book_tour_info`,
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

exports.GetAmountPost = (req, res) => {
  pool_db.connect(function (err, client, done) {
    if (err) {
      return console.error("error", err);
    }
    var status = req.params.status;
    client.query(
      `select  count(posts."id" ) as count FROM posts`,
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

exports.GetAmountLocation = (req, res) => {
  pool_db.connect(function (err, client, done) {
    if (err) {
      return console.error("error", err);
    }
    var status = req.params.status;
    client.query(
      `select  count(location."id" ) as count FROM location`,
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

exports.GetAmountCategory = (req, res) => {
  pool_db.connect(function (err, client, done) {
    if (err) {
      return console.error("error", err);
    }
    var status = req.params.status;
    client.query(
      `select  count(category_tour."id" ) as count FROM category_tour`,
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

exports.ListUser = (req, res) => {
  pool_db.connect(function (err, client, done) {
    if (err) {
      return console.error("error", err);
    }
    client.query(`select * from users`, function (err, result) {
      done();

      if (err) {
        res.end();
        return console.error("error running query", err);
      }
      res.json(result.rows);
    });
  });
};

exports.DetailUser = (req, res) => {
  pool_db.connect(function (err, client, done) {
    if (err) {
      return console.error("error", err);
    }
    var id = req.params.id;
    client.query(
      `SELECT * FROM users  WHERE users."id" = ${id}`,
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

exports.AddUser = (req, res) => {
  pool_db.connect(function (err, client, done) {
    if (err) {
      return console.error("error", err);
    }
    client.query(
      `insert into users("userName", "lastName", "firstName",  "email","password","roleId") values
            ('${req.body.userName}', '${req.body.lastName}', '${
        req.body.firstName
      }', '${req.body.email}', '${md5(req.body.password)}','${req.body.roleId}'
           )`,
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

exports.UpdateUser = (req, res) => {
  console.log(`update users set 
    "userName" = '${req.body.userName}',
    "lastName" = '${req.body.lastName}', 
    "firstName" ='${req.body.firstName}', 
    "roleId" = '${req.body.roleId}',
    "email" = '${req.body.email}'
    WHERE "id" = ${req.params.id}`);
  pool_db.connect(function (err, client, done) {
    if (err) {
      return console.error("error", err);
    }
    var id = req.params.id;
    client.query(
      `update users set 
        "userName" = '${req.body.userName}',
        "lastName" = '${req.body.lastName}', 
        "firstName" ='${req.body.firstName}', 
        "roleId" = '${req.body.roleId}',
        "email" = '${req.body.email}'
        WHERE "id" = ${req.params.id}`,
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

exports.DeleteUser = (req, res) => {
  pool_db.connect(function (err, client, done) {
    if (err) {
      return console.error("error", err);
    }
    var id = req.params.id;
    client.query(
      `DELETE  FROM users  WHERE users."id" = ${id}`,
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

exports.ListRole = (req, res) => {
  pool_db.connect(function (err, client, done) {
    if (err) {
      return console.error("error", err);
    }
    client.query(`select * from role`, function (err, result) {
      done();

      if (err) {
        res.end();
        return console.error("error running query", err);
      }
      res.json(result.rows);
    });
  });
};

exports.UpdateRole = (req, res) => {
  console.log(
    `update users set "roleId" = '${req.body.roleId}' where "id" = ${req.params.id}`
  );
  pool_db.connect(function (err, client, done) {
    if (err) {
      return console.error("error", err);
    }
    var id = req.params.id;
    client.query(
      `update users set 
            "roleId" = '${req.body.roleId}'
            WHERE "id" = ${req.params.id}`,
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

exports.SearchUser = (req, res) => {
  let sqlFilter = `select * from users where "userName" like '%${req.query.userName}%'`;
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

//login
exports.signin = (req, res, next) => {
  pool_db.connect(function (err, client, done) {
    if (err) {
      return console.log("error:" + err);
    } else {
      client.query(
        `select * from users where "userName" like '${
          req.body.userName
        }' and "password" like '${md5(req.body.password)}'`,
        function (err, result, row) {
          done();
          if (err) {
            res.end();
            return console.error("error running query", err);
          } else {
            if (result.rows.length > 0) {
              delete result.rows[0].password;
              req.session.User = result.rows[0];
              res.json(result.rows[0]);
            } else {
              res.json({ message: "Tài khoản mật khẩu không đúng" });
            }
          }
        }
      );
    }
  });
};

// select sum(book_tour_info."priceTour" ) as reveneMonth, count(book_tour_info."priceTour" ) as countMonth
// FROM book_tour_info
// WHERE "createdAt" BETWEEN '00:00:00 PM, 9/1/2022' AND '23:59:59 PM, 9/12/2022' group by status
