import { ApiResponse } from "../utils/ApiResponse.js";
import { Router } from "express";
import {
  addNewsletter,
  deletenewsletter,
  editnewsletter,
  viewnewsletter,
  addArchiveNewsletter,
  viewArchiveNewsletter,
  viewableNewsletter,
} from "../controllers/newsletter.controller.js";
import { upload } from "./../middlewares/multer.middleware.js";

const router = Router();

router.route("/").get(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, "Newsletter API is working"));
});

const photoFields = Array.from({ length: 20 }, (_, index) => ({
  name: `photo${index}`,
  maxCount: 1,
}));

// router.route("/add").post(upload.fields(photoFields), addNewsletter);

router.route("/view").get(viewnewsletter);

// router.route("/edit/:id").put(upload.fields(photoFields), editnewsletter);

router.route("/delete/:id").delete(deletenewsletter);

// router.route("/addarchive/:id").put(upload.fields(photoFields), addArchiveNewsletter);

router.route("/viewarchive").get(viewArchiveNewsletter);

router.route("/viewable").get(viewableNewsletter);


export default router;
