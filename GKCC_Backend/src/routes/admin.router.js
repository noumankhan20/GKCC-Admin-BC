import { Router } from "express";
import {
  registerAdmin,
  getPendingList,
  getAcceptedList,
  getRejectedList,
  approveForm,
  rejectForm,
  loginAdmin,
  getSAAcceptedList,
  getSARejectedList,
  getSAPendingList,
  checkstatus,
  uploadBulks,
  downloadExcel
} from "../controllers/admin.controller.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { adminAuthMiddleware } from "../middlewares/adminauth.middleware.js";
import multer from 'multer';


const router = Router();
// Use memory storage to access the file buffer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // Limit file size to 10MB
});

// Route to test if the API is working
router.route("/").post((req, res) => {
  return res.status(200).json(new ApiResponse(200, "admin working"));
});

router.get("/protected-route", adminAuthMiddleware, (req, res) => {
  res.status(200).json({
    message: "This is a protected route",
    admin: req.admin, // Display the authenticated admin's information
  });
});


// Route for creating a membership


router.route("/AddAdmin").post(registerAdmin);
router.route("/login").post(loginAdmin)

//getlists
router.route("/getpendinglist").get(adminAuthMiddleware, getPendingList);
// http://localhost:5000/api/admin/getpendinglist
router.route("/getrejectedlist").get(adminAuthMiddleware,getRejectedList);
// http://localhost:5000/api/admin/getrejectedlists
router.route("/getacceptedlists").get(adminAuthMiddleware,getAcceptedList);
// http://localhost:5000/api/admin/getacceptedlists

//approve reject form
router.route("/approve/:id").post(
  // upload.fields([
  //   { name: "signature", maxCount: 1 },
  //   { name: "logo", maxCount: 1 },

  // ]),
  approveForm); 

  
router.route("/reject/:id").post(rejectForm);

//getadmindetails
router.route("/checkstatus").post(adminAuthMiddleware,checkstatus)

//getList association list
router.route("/getSApendinglist").get( getSAPendingList);
router.route("/getSAacceptedlist").get( getSAAcceptedList);
router.route("/getSARejectedlist").get( getSARejectedList);

// Add bulk upload route
// router.route("/upload-bulks").post( upload.single('file'), uploadBulks);

// donwload Excel file
router.route("/download-excel").post(downloadExcel);

export default router;
