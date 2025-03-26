import { Router } from "express";
import {
  createVendor,
  loginVendor,
  getPendingVendorForm,
  getAcceptedVendorForm,
  getRejectedVendorForm,
  approveVendorForm,
  rejectVendorForm,
  getAllVendors,
  totalVendor,
} from "../controllers/vendor.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const router = Router();

// testing routes
router.route("/").post((req, res) => {
  return res.status(200).json(new ApiResponse(200, "working"));
});

// Route for creating a membership


router.route("/addvendor").post(
  upload.fields([
    { name: "signature", maxCount: 1 },
    { name: "logo", maxCount: 1 } // Add this line to handle logo uploads
    ]),
  createVendor
);

router.route("/login").post(loginVendor);
//vendor router

//get lsits for vendor
router.route("/getPendingVendorForm").get(getPendingVendorForm);
router.route("/getAcceptedVendorForm").get(getAcceptedVendorForm);
router.route("/getRejectedVendorForm").get(getRejectedVendorForm);
router.route("/getAllVendors").get(getAllVendors);

//approve or reject vendor
router.route("/approveVendorForm/:id").post(approveVendorForm);
router.route("/rejectVendorForm/:id").post(rejectVendorForm);

//get count
router.route("/getVendorcount").get(totalVendor);

export default router;
