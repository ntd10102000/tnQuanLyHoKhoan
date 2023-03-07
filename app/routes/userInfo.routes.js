// const { authJwt } = require("../middleware");
const controller = require("../controllers/userInfo.controller");
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });
  //Tour
  app.get("/review/api/info/listbookTour", controller.ListBookTour);

  app.post("/review/api/info/bookTour", controller.BookTour);

  app.delete(
    "/review/api/info/deleteBookingTour/:id",
    controller.DeleteBookingTour
  );

  app.get(
    "/review/api/info/PersonalBookingTour/:idUser",
    controller.PersonalBookingTour
  );

  //Hotel
  app.get("/review/api/info/listbookHotel", controller.ListBookHotel);

  app.post("/review/api/info/bookHotel", controller.BookHotel);

  app.delete(
    "/review/api/info/deleteBookingHotel/:id",
    controller.DeleteBookingHotel
  );

  app.get(
    "/review/api/info/PersonalBookingHotel/:idUser",
    controller.PersonalBookingHotel
  );

  //Check Status Tour

  app.post(
    "/review/api/info/SetStatusBookTourFromAccuracyToHappenning/:id",
    controller.SetStatusBookTourFromAccuracyToHappenning
  );

  app.post(
    "/review/api/info/SetStatusBookTourFromHappenningToComplete/:id",
    controller.SetStatusBookTourFromHappenningToComplete
  );

  app.post(
    "/review/api/info/SetStatusBookTourToCancelled/:id",
    controller.SetStatusBookTourToCancelled
  );

  //Check Status Hotel

  app.post(
    "/review/api/info/SetStatusBookHotelFromAccuracyToHappenning/:id",
    controller.SetStatusBookHotelFromAccuracyToHappenning
  );

  app.post(
    "/review/api/info/SetStatusBookHotelFromHappenningToComplete/:id",
    controller.SetStatusBookHotelFromHappenningToComplete
  );

  app.post(
    "/review/api/info/SetStatusBookHotelToCancelled/:id",
    controller.SetStatusBookHotelToCancelled
  );

  // Tính tổng doanh thu
  app.get("/review/api/info/getAmount/:status", controller.GetAmount);

  app.get("/review/api/info/getRevenue/:status", controller.GetRevenue);

  app.get("/review/api/info/totalAmount", controller.TotalAmount);

  app.get("/review/api/info/getAmountPost", controller.GetAmountPost);

  app.get("/review/api/info/getAmountLocation", controller.GetAmountLocation);

  app.get("/review/api/info/getAmountCategory", controller.GetAmountCategory);

  // User
  app.get("/quanliTN/api/listUser", controller.ListUser);

  app.get("/quanliTN/api/detailUser/:id", controller.DetailUser);

  app.post("/quanliTN/api/addUser", controller.AddUser);

  app.post("/quanliTN/api/updateUser/:id", controller.UpdateUser);

  app.post("/quanliTN/api/deleteUser/:id", controller.DeleteUser);

  app.get("/quanliTN/api/listRole", controller.ListRole);

  app.post("/quanliTN/api/updateRole/:id", controller.UpdateRole);

  app.get("/quanliTN/api/searchUser", controller.SearchUser);

  /// login register
  // app.post(
  //   "/quanliTN/api/auth/signup",
  //   [
  //     verifySignUp.checkDuplicateUsernameOrEmail,
  //     verifySignUp.checkRolesExisted
  //   ],
  //   controller.signup
  // );

  app.post("/quanliTN/api/auth/signin", controller.signin);
};
