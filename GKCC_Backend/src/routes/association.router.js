import { Router } from "express";
import {
  getAcceptedAssociationNames,
  createAssociation,
  test,
  getPendingAssociation,
  getAcceptedAssociation,
  getRejectedAssociation,
  approveAssociation,
  rejectAssociation,
  getAllAssociations,
  getAllAssociationNames,
  getOneAssociationDetails,
  uploadMembershipBulks,
  totalAssociationNumber,
} from "../controllers/association.controller.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import verifyCaptcha from "../middlewares/verifycaptcha.middleware.js";

const router = Router();

// testing routes
router.route("/").post((req, res) => {
  return res.status(200).json(new ApiResponse(200, "working"));
});

// Route for creating a membership
router.route("/Addassociation").post(
  upload.fields([
    { name: "signature", maxCount: 1 },
    { name: "logo", maxCount: 1 },

  ]),verifyCaptcha,
  createAssociation
);

// Example route with multiple fields
router.route("/testlocalstorage").post(
  upload.fields([
    { name: "signature", maxCount: 1 },
  ]),
  test
);



// get all list
router.route("/getPendingAssociation").get(getPendingAssociation);
router.route("/getAcceptedAssociation").get(getAcceptedAssociation);
router.route("/getRejectedAssociation").get(getRejectedAssociation);

// aprove reject association
router.route("/approveAssociation/:id").post(
  upload.fields([
    { name: "signature", maxCount: 1 },
    { name: "logo", maxCount: 1 },

  ]),
  approveAssociation);

  
router.route("/rejectAssociation/:id").post(rejectAssociation);

// get All
router.route("/getAll").get(getAllAssociations);

// get Single Association Details
router.route("/getOneAssociation/:id").get(getOneAssociationDetails)

// get list of all Association Names
router.route("/getAcceptedAssociationNames").get(getAcceptedAssociationNames);

router.route("/getAllAssociationNames").get(getAllAssociationNames)

// Upload Bulk Membership for the Association 
// router.route("/uploadMembershipBulks").post(
//   upload.single("file"),
//   uploadMembershipBulks
// );

// get Count
router.route("/getAssociationcount").get(totalAssociationNumber)


export default router;
