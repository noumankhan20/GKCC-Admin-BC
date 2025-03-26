import { Router } from "express";
import { ApiResponse } from "../utils/ApiResponse.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  addadvertsponsor,
  editadvertsponsor,
  deleteadvert,
  viewadvert,
} from "../controllers/advert.controller.js";

const router = Router();

// Test Route to ensure the API is working
router.route("/").get((req, res) => {
  return res.status(200).json(new ApiResponse(200, "Advert API is working"));
});

// Route to add a new advert sponsor
// router.route("/addadvert").post(
//   upload.fields([
//     {
//       name: "advertimage",
//       maxCount: 1,
//     },
//   ]),
//   addadvertsponsor
// );

// Route to edit an existing advert sponsor
// router.route("/editadvert/:id").put(
//   upload.fields([
//     {
//       name: "advertimage", // Optional file for update
//       maxCount: 1,
//     },
//   ]),
//   editadvertsponsor
// );

// Route to delete an advert sponsor
router.route("/deleteadvert/:id").delete(deleteadvert);

// Route to view all adverts or a specific advert by ID
router.route("/viewadvert").get(viewadvert);

export default router;
