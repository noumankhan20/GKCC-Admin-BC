import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { addanalbumtophotomedia, addaphototoaalbum, deletePhotoFromandAlbum, deletePhotoMedia,  editalbumname,  viewAllPhotoMedia } from "../controllers/photo.media.controller.js";

const router = Router();

// Base route to test API health
router.route("/").post(async (req, res) => {
  res.status(200).json(new ApiResponse(200, "API of media is working"));
});



router.route("/viewphotosofmediapage").get(
  viewAllPhotoMedia
)

router.route("/deletephotomedia/:_id").delete(deletePhotoMedia)



router.post("/add", 
  
  upload.fields([{ name: "albumphotos", maxCount: 20 }]),

addanalbumtophotomedia

);


router.route("/deletesinglephoto/:id/:pid").delete(deletePhotoFromandAlbum)


router.route("/addphototoalbum/:id").put(
  upload.fields(
    [
      {
        name:"albumphotos",
        maxCount:20
      }
    ]
  ),
  addaphototoaalbum)

  

router.route("/editname/:id").put(editalbumname)

export default router


