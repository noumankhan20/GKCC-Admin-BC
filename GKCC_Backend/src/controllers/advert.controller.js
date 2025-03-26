import { asyncHandler } from "../utils/asynchandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

import { uploadOnCloudinary, deleteOnCloudinary } from "../utils/cloudinary.js";

import AdvertSponsor from "../models/advert.model.js";

const addadvertsponsor = asyncHandler(async (req, res) => {
  try {
    const data = req.body;

    const uploadedadvertimage = await uploadOnCloudinary(
      req.files.advertimage[0].path
    );
    if (!uploadedadvertimage) {
      throw new ApiError(401, "error while uploading image to cloudinary");
    }

    const advert = new AdvertSponsor({
      name: data.name,
      description: data.description,
      websitelink: data.websitelink,
      brochure: data.brochure,
      divnumber: data.divnumber,
      advertimage: uploadedadvertimage.secure_url,
    });

    await advert.save();

    return res
      .status(200)
      .json(new ApiResponse(200, "added sucessfully", advert));
  } catch (error) {
    throw new ApiError(402, "can't add a advert here", error);
  }
});

const editadvertsponsor = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params; // Get advert ID from request params
    const data = req.body;

    const advert = await AdvertSponsor.findById(id);
    if (!advert) {
      throw new ApiError(404, "Advert not found");
    }

    if (req.files && req.files.advertimage) {
      // If a new advert image is uploaded, replace the existing one
      await deleteOnCloudinary(advert.advertimage); // Delete the old image
      const uploadedImage = await uploadOnCloudinary(
        req.files.advertimage[0].path
      );
      if (!uploadedImage) {
        throw new ApiError(401, "Error while uploading image to Cloudinary");
      }
      data.advertimage = uploadedImage.secure_url;
    }

    // Update advert with new data
    Object.assign(advert, data);
    await advert.save();

    return res
      .status(200)
      .json(new ApiResponse(200, "Advert updated successfully", advert));
  } catch (error) {
    throw new ApiError(402, "Can't edit the advert", error);
  }
});


const deleteadvert = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params; // Get advert ID from request params

    const advert = await AdvertSponsor.findById(id);
    
    if (!advert) {
      throw new ApiError(404, "Advert not found");
    }

    // Delete image from Cloudinary
    await deleteOnCloudinary(advert.advertimage);
    
    // Delete the advert from the database
    await advert.deleteOne({ _id:id })

    return res
      .status(200)
      .json(new ApiResponse(200, "Advert deleted successfully"));
  } catch (error) {
    throw new ApiError(403, "Can't delete the advert", error);
  }
});

const viewadvert = asyncHandler(async (req, res) => {
  try {


    const adverts = await AdvertSponsor.find();
    return res
      .status(200)
      .json(new ApiResponse(200, "All adverts retrieved successfully", adverts));
  } catch (error) {
    throw new ApiError(404, "Can't retrieve adverts", error);
  }
});


export {
  addadvertsponsor,
  editadvertsponsor,
  deleteadvert,
  viewadvert,
};
