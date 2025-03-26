import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import { deleteOnCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import Sponsor from "../models/sponsor.model.js";


const addSponsor = asyncHandler(async (req, res) => {
  try {
    const data = req.body;

    if (!data) throw new ApiError(400, "Error: Problem, no data received");

    // Ensure logo is uploaded
    const logoFile = req.files?.logo?.[0];
    if (!logoFile) {
      throw new ApiError(400, "Error: No logo file uploaded");
    }

    // Construct the local path for the uploaded logo
    const logoPath = `/Public/AllImages/logo/${logoFile.filename}`; // Relative URL for logo

    // Create sponsor document
    const sponsor = new Sponsor({
      name: data.name,
      description: data.description,
      logo: logoPath, // Save relative path of logo
      brochure: data.brochure,
      websitelink: data.websitelink,
      sponsorsTypes: "Sponsorpage",
    });

    // Save sponsor to the database
    await sponsor.save();

    return res
      .status(201)
      .json(new ApiResponse(200, sponsor, "Added successfully"));
  } catch (error) {
    console.error("Error adding sponsor:", error);
    throw new ApiError(500, "Something went wrong while adding sponsor");
  }
});

const editSponsordetails = asyncHandler(async (req, res) => {
  const { name, description, brochure, websitelink } = req.body;
  const { id } = req.params;

  // Find the sponsor by ID
  const sponsor = await Sponsor.findById(id);

  if (!sponsor) {
    throw new ApiError(404, "Sponsor not found");
  }

  // Update sponsor details
  sponsor.name = name || sponsor.name;
  sponsor.description = description || sponsor.description;
  sponsor.brochure = brochure || sponsor.brochure;
  sponsor.websitelink = websitelink || sponsor.websitelink;

  // Check if logo file exists and needs to be updated
  if (req.files && req.files.logo && req.files.logo[0]) {
    const logoFile = req.files.logo[0];
    const logoPath = `/Public/AllImages/logo/${logoFile.filename}`;
    sponsor.logo = logoPath;
  }

  // Save the updated sponsor to the database
  await sponsor.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, sponsor, "Sponsor details updated successfully")
    );
});


const viewSponsor = asyncHandler(async (req, res) => {
  try {
    const sponsors = await Sponsor.find();

    if (!sponsors || sponsors.length === 0) {
      throw new ApiError(404, "No sponsors found");
    }

    // Update logo paths to include the base URL from environment variables
    const updatedSponsors = sponsors.map(sponsor => ({
      ...sponsor.toObject(),
      logo: `${process.env.WEB_URL}${sponsor.logo}`,
    }));

    return res
      .status(200)
      .json(new ApiResponse(200, "Sponsors fetched successfully", updatedSponsors));
  } catch (error) {
    throw new ApiError(404, "Sponsors not found", error);
  }
});


const deleteSponsor = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.params;
    const sponsor = await Sponsor.findById(_id);

    const isdeletefromcloudinary = await deleteOnCloudinary(sponsor.logo);


    if (!isdeletefromcloudinary) {
      throw new ApiError(403, "can't delete from cloudinary");
    }

    await Sponsor.deleteOne({ _id });

    return res
      .status(200)
      .json(new ApiResponse(200, "Delete SUcesfully", sponsor));
  } catch (error) {
    throw new ApiError(404, "Can't find the sponsor to delete");
  }
});

const addpopup = asyncHandler(async (req, res) => {
  try {
    const popupfind = await Sponsor.findOne({
      sponsorsTypes: "Homepopup",
    });
    if (popupfind) {
      throw new ApiError(400, "Cannot add existing image");
    }

    const popupFile = req.files?.logo?.[0];
    if (!popupFile) {
      throw new ApiError(400, "No logo file uploaded");
    }

    // Construct the local path for the uploaded popup image
    const popupPath = `/Public/AllImages/logo/${popupFile.filename}`; // Adjust directory as needed

    const popup = new Sponsor({
      logo: popupPath,
      sponsorsTypes: "Homepopup",
    });

    await popup.save();

    return res.status(201).json(new ApiResponse(201, "Popup uploaded", popup));
  } catch (error) {
    console.error("Error adding popup:", error);
    throw new ApiError(500, "Unable to add popup");
  }
});





const viewhomepopupimage = asyncHandler(async (req, res) => {
  try {
    const popup = await Sponsor.findOne({
      sponsorsTypes: "Homepopup",
    });

    if (!popup) {
      throw new ApiError(404, "Popup image not found");
    }

    // Prepend the base URL from environment variables
    const updatedPopup = {
      ...popup.toObject(),
      logo: `${process.env.WEB_URL}${popup.logo}`, // Ensure 'WEB_BASE_URL' is defined in your .env
    };
    console.log(updatedPopup);
    return res.status(200).json(new ApiResponse(200, updatedPopup,"Found image" ));
  } catch (error) {
    console.error("Error viewing popup image:", error);
    throw new ApiError(500, "Failed to retrieve popup image");
  }
});



const getSections = asyncHandler(async (req, res) => {
  try {
    const sponsors = await Sponsor.find({ sponsorsTypes: "Sponsorpage" }); // Ensure this query is correct
    // Debugging the fetched sponsors
    if (!sponsors.length) {
      return res.status(200).json({
        status: 200,
        message: "No sponsors found.",
        sponsors: [],
      });
    }

    res.status(200).json({
      status: 200,
      message: "Sections fetched successfully",
      sponsors,
    });
  } catch (error) {
    console.error("Error fetching sections:", error);
    res.status(500).json({
      status: 500,
      message: "Failed to fetch sections",
      error: error.message,
    });
  }
});

const deletepopup = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.params;
    const popup = await Sponsor.findById(_id);

    if (!popup) {
      throw new ApiError(404, "Popup not found");
    }

    // Assuming local file deletion is handled in middleware or separate logic

    await Sponsor.deleteOne({ _id });

    return res
      .status(200)
      .json(new ApiResponse(200, "Popup deleted successfully", popup));
  } catch (error) {
    console.error("Error deleting popup:", error);
    throw new ApiError(500, "Can't find the popup to delete");
  }
});

const addSections = asyncHandler(async (req, res) => {
  const { sponsorId, sectionName, selectedOption } = req.body;

  try {
    if (!["brochure", "websitelink"].includes(selectedOption)) {
      return res.status(400).json({ message: "Invalid selected option" });
    }

    const sponsor = await Sponsor.findById(sponsorId);

    if (!sponsor) {
      return res.status(404).json({ message: "Sponsor not found" });
    }

    // Check if the section name already exists
    const existingSection = sponsor.sections.find(
      (section) => section.sectionName === sectionName
    );

    if (existingSection) {
      return res.status(400).json({ message: "Section name already exists for this sponsor." });
    }

    // Add the new section
    sponsor.sections.push({ sectionName, selectedOption });

    await sponsor.save();

    res.status(201).json({
      status: 201,
      message: "Section added successfully",
      sponsor,
    });
  } catch (error) {
    console.error("Error adding section:", error);
    res.status(500).json({
      status: 500,
      message: "Failed to add section",
      error: error.message,
    });
  }
});

  
  
const deleteSections = asyncHandler(async (req, res) => {
  const { _id } = req.params; // Sponsor ID from the URL
  const { sectionName } = req.body; // Section name from the request body

  if (!_id || !sectionName) {
    return res.status(400).json({
      status: 400,
      message: "Sponsor ID and section name are required.",
    });
  }

  // Find the sponsor by ID
  const sponsor = await Sponsor.findById(_id);
  if (!sponsor) {
    return res.status(404).json({
      status: 404,
      message: "Sponsor not found.",
    });
  }

  // Filter out the section to delete
  const updatedSections = sponsor.sections.filter(
    (section) => section.sectionName !== sectionName
  );

  if (updatedSections.length === sponsor.sections.length) {
    return res.status(404).json({
      status: 404,
      message: "Section not found within the sponsor.",
    });
  }

  sponsor.sections = updatedSections;
  await sponsor.save();

  res.status(200).json({
    status: 200,
    message: "Section deleted successfully.",
    sponsor,
  });
});




export {
  viewSponsor,
  addSponsor,
  editSponsordetails,
  deleteSponsor,
  addpopup,
  viewhomepopupimage,
  deletepopup,
  getSections,
  addSections,
  deleteSections,
};
