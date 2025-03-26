import { asyncHandler } from "../utils/asynchandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

import { uploadOnCloudinary, deleteOnCloudinary } from "../utils/cloudinary.js";

import NewsLetter from "../models/newsletter.model.js";

const addNewsletter = asyncHandler(async (req, res) => {
  const uploadedPhotos = []; 
  try {
    const { title, date, heading, section } = req.body;

    if (!title || !date || !heading || !section) {
      throw new ApiError(
        400,
        "All required fields (title, date, heading, section) must be provided."
      );
    }

    let parsedSections;
    try {
      parsedSections = JSON.parse(section);
    } catch (err) {
      throw new ApiError(400, "Section must be a valid JSON array.");
    }

    if (!Array.isArray(parsedSections)) {
      throw new ApiError(400, "Section must be an array of objects.");
    }

    const processedSections = await Promise.all(
      parsedSections.map(async (sectionItem, i) => {
        let photoUrl = "";

        if (req.files && req.files[`photo${i}`]) {
          const uploadResult = await uploadOnCloudinary(
            req.files[`photo${i}`][0].path
          );
          if (!uploadResult) {
            throw new ApiError(
              405,
              `Unable to upload photo for section ${i + 1}.`
            );
          }
          photoUrl = uploadResult.secure_url;
          uploadedPhotos.push(photoUrl);
        }

        if (!photoUrl && !sectionItem.text) {
          throw new ApiError(
            400,
            `Section ${i + 1} must have at least text or a photo.`
          );
        }

        return {
          photo: photoUrl,
          text: sectionItem.text || "",
        };
      })
    );

    const newsletter = new NewsLetter({
      title,
      date,
      heading,
      section: processedSections,
      newsletterTypes:"viewable",
    });

    await newsletter.save();

    return res
      .status(200)
      .json(
        new ApiResponse(200, newsletter, "Newsletter uploaded successfully.")
      );
  } catch (error) {
    // Cleanup uploaded photos in case of error
    if (uploadedPhotos.length > 0) {
      await Promise.all(
        uploadedPhotos.map((photoUrl) => deleteOnCloudinary(photoUrl))
      );
    }

    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json(new ApiResponse(error.statusCode, null, error.message));
    }

    console.error("Unexpected error: ", error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "An unexpected error occurred."));
  }
});

const editnewsletter = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { title, date, heading, section } = req.body;

    if (!title || !date || !heading || !section) {
      throw new ApiError(
        400,
        "All required fields (title, date, heading, section) must be provided."
      );
    }

    let parsedSections;
    try {
      parsedSections = JSON.parse(section);
    } catch (err) {
      throw new ApiError(400, "Section must be a valid JSON array.");
    }

    if (!Array.isArray(parsedSections)) {
      throw new ApiError(400, "Section must be an array of objects.");
    }

    const newsletter = await NewsLetter.findById(id);
    if (!newsletter) {
      throw new ApiError(404, "Newsletter not found.");
    }

    const updatedSections = await Promise.all(
      parsedSections.map(async (sectionItem, i) => {
        let photoUrl = newsletter.section[i]?.photo || "";

        if (req.files && req.files[`photo${i}`]) {
          const uploadResult = await uploadOnCloudinary(
            req.files[`photo${i}`][0].path
          );
          if (!uploadResult) {
            throw new ApiError(
              405,
              `Unable to upload photo for section ${i + 1}.`
            );
          }

          if (photoUrl) {
            await deleteOnCloudinary(photoUrl);
          }

          photoUrl = uploadResult.secure_url;
        }

        // Ensure that at least text or photo is present
        if (!photoUrl && !sectionItem.text) {
          throw new ApiError(
            400,
            `Section ${i + 1} must have at least text or a photo.`
          );
        }

        return {
          photo: photoUrl,
          text: sectionItem.text || "",
        };
      })
    );

    newsletter.title = title;
    newsletter.date = date;
    newsletter.heading = heading;
    newsletter.section = updatedSections;

    await newsletter.save();

    return res
      .status(200)
      .json(
        new ApiResponse(200, newsletter, "Newsletter updated successfully.")
      );
  } catch (error) {
    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json(new ApiResponse(error.statusCode, null, error.message));
    }

    console.error("Unexpected error: ", error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "An unexpected error occurred."));
  }
});

const viewnewsletter = asyncHandler(async (req, res) => {
  try {
    const newsletter = await NewsLetter.find( );
    if (!newsletter) {
      throw new ApiError(404, "can't find newsletter");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, newsletter, "retreived sucessfully"));
  } catch (error) {
    return res
      .status(408)
      .json(new ApiError(408, "can't find newsletter", error));
  }
});

const deletenewsletter = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const newsletter = await NewsLetter.findById(id);

    if (!newsletter) {
      throw new ApiError(404, "Newsletter not found.");
    }

    for (let i = 0; i < newsletter.section.length; i++) {
      const photoUrl = newsletter.section[i].photo;
      if (photoUrl) {
        await deleteOnCloudinary(photoUrl);
      }
    }

    await NewsLetter.deleteOne({ _id: id });

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Newsletter deleted successfully."));
  } catch (error) {
    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json(new ApiResponse(error.statusCode, null, error.message));
    }

    console.error("Unexpected error: ", error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "An unexpected error occurred."));
  }
});



const addArchiveNewsletter = asyncHandler(async (req, res) => {
  const { id } = req.params; 
  try {
   
    const newsletter = await NewsLetter.findById(id);
    if (!newsletter) {
      throw new ApiError(404, "Newsletter not found");
    }

 
    if (newsletter.newsletterTypes === "archives") {
      newsletter.newsletterTypes = "viewable";

    }
    else{
      newsletter.newsletterTypes = "archives";

    }

    
    await newsletter.save();

    return res
      .status(200)
      .json(new ApiResponse(200, "Archived Toggled successfully", newsletter));
  } catch (error) {
    console.error("Archive Error:", error.message);
    throw new ApiError(500, "Unable to archive newsletter", error);
  }
});



const viewArchiveNewsletter = asyncHandler(async (req, res) => {
  try {
    const archives = await NewsLetter.find({
      newsletterTypes: "archives",
    });

    return res
      .status(200)
      .json(new ApiResponse(200, archives, "Archived newsletters fetched successfully"));
  } catch (error) {
    console.error("View Archives Error:", error.message);
    throw new ApiError(500, "Unable to fetch archived newsletters", error);
  }
});

const viewableNewsletter = asyncHandler(async (req, res) => {
  try {
    const viewable = await NewsLetter.find({
      newsletterTypes: "viewable",
    });

    return res
      .status(200)
      .json(new ApiResponse(200, viewable, "viewable newsletters fetched successfully"));
  } catch (error) {
    console.error("View Archives Error:", error.message);
    throw new ApiError(500, "Unable to fetch archived newsletters", error);
  }
});

export { addNewsletter, viewnewsletter, editnewsletter, deletenewsletter, addArchiveNewsletter, viewArchiveNewsletter , viewableNewsletter};
