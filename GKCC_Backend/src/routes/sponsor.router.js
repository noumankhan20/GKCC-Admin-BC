import { Router } from "express";
import {addpopup, addSponsor, deletepopup, deleteSponsor, editSponsordetails,  viewhomepopupimage, viewSponsor, getSections, addSections, deleteSections} from "../controllers/sponsor.controller.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/").post((req, res) => {
  return res.status(200).json(new ApiResponse(200, "working api"));
});

router
  .route("/addSponsor")
  .post(
    upload.fields(
        [
            { 
                name: "logo",
                maxCount: 1 
            },

        ]
    ), 
    addSponsor
);

router.route("/viewsponsors").get(viewSponsor)

router.route("/editsponsorsdetails/:id").post(
  upload.fields([
    {
      name:"logo",
      maxCount:1
    },
  ]),
  editSponsordetails
)

router.route("/deletesponsor/:_id").delete(deleteSponsor)

router.route("/addpopupimage").post(
  upload.fields(
    [
      {
        name:"logo",
        maxCount:1,
      }
    ]
  ),addpopup)

router.route("/viewpopup").get(viewhomepopupimage)
router.route("/deletepopup/:_id").delete(deletepopup)

router.route("/getsections").get(getSections)
router.route("/addsections").post(addSections)
router.route("/deletesections/:_id").delete(deleteSections)



export default router;
