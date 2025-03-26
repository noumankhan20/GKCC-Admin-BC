import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";
import sendEmail from "../services/email.service.js";
import Vendor from "../models/vendors.model.js"; // Update the path if necessary
import {uploadOnCloudinary} from '../utils/cloudinary.js'

import jwt from "jsonwebtoken";

// Function to generate a JWT token
function generateToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" }); // Token expires in 30 days
}

function generateGKC_ID(countryName) {
  
  const prefix = "GKCC";
  const country = countryName.toUpperCase().slice(0, 2); // Use the first 2 letters of the country name
  const now = new Date();

  // Get the current time components
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");

  // Combine time components to create a unique 4-digit string
  const uniqueTime = hours + minutes + seconds;
  const lastFourDigits = uniqueTime.slice(-4);

  return `${prefix}${country}${lastFourDigits}`;
}

// Create a new vendor
const createVendor = asyncHandler(async (req, res) => {
  try {
    const {
      vendorName,
      contactPersonName,
      contactNumber,
      whatsappNumber,
      password,
      vendorEmail,
      streetName,
      address,
      country,
      state,
      city,
      pincode,
      googleMapsLink,
      category,
      offerType,
      productsOffered,
      servicesOffered,
      discountPercentage,
      discountAmount,
      discountDetails,
      freeOfferOn,
      offerStartDate,
      offerEndDate,
      vendorSupport,
      instagramLink,
      facebookLink,
      linkedinLink,
      association,
      customAssociation,
      associationMember,
      confirmation
    } = req.body;

    // Validate required fields
    if (!req.files || !req.files.signature || req.files.signature.length === 0) {
      throw new ApiError(400, "Vendor signature is required.");
    }

    // Construct the local path for the uploaded signature
    const signatureFile = req.files.signature[0];
    const signaturePath = `/Public/AllImages/signature/${signatureFile.filename}`;

    // Optional: Handle association logo if provided
    let associationLogoPath = "";
    if (req.files.logo && req.files.logo.length > 0) {
      const logoFile = req.files.logo[0];
      associationLogoPath = `/Public/AllImages/logo/${logoFile.filename}`;
    }

    // Create the new vendor object
    const newVendor = new Vendor({
      vendorName,
      contactPersonName,
      contactNumber,
      whatsappNumber,
      password,
      vendorEmail,
      streetName,
      address,
      country,
      state,
      city,
      pincode,
      googleMapsLink,
      category,
      offerType,
      productsOffered,
      servicesOffered,
      discountPercentage,
      discountAmount,
      discountDetails,
      freeOfferOn,
      offerStartDate,
      offerEndDate,
      vendorSupport,
      socialMediaLinks: {
        instagramLink,
        facebookLink,
        linkedinLink,
      },
      association,
      customAssociation,
      associationMember,
      confirmation,
      associationLogo: associationLogoPath, // Optional logo
      signature: signaturePath, // Signature path
    });

    // Save the new vendor to the database
    await newVendor.save();

    // Return a successful response
    return res
      .status(201)
      .json(new ApiResponse(201, newVendor, "Vendor created successfully"));
  } catch (error) {
    console.error("Error creating vendor:", error);
    // If using ApiError as an error response format
    return res.status(error.statusCode || 500).json(
      new ApiError(
        error.statusCode || 500,
        error.message || "Internal server error",
        error.errors || []
      )
    );
  }
});



// Login a vendor
const loginVendor = async (req, res) => {
  const { GKCCId, password } = req.body;

  try {
    const vendor = await Vendor.findOne({ GKCCId: GKCCId });
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    const token = generateToken(vendor._id);

    const isMatch = await vendor.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json(new ApiError(500, "wrong password"));
    }

    res.status(200).json(new ApiResponse(200, vendor, token));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get list of pending vendor forms
const getPendingVendorForm = asyncHandler(async (req, res, next) => {
  try {
    const pendingVendors = await Vendor.find({ status: "pending" });

    // Check if there are any pending vendors
    if (!pendingVendors || pendingVendors.length === 0) {
      return res.status(404).json(
        new ApiResponse(
          404,
          "No pending vendor lists found",
          []
        )
      );
    }
    // tostring
    const url = String(process.env.WEB_URL);
    console.log(url);
    // Correct the typo and ensure logos and signatures are fully constructed
    const updatedPendingVendors = pendingVendors.map(vendor => ({
      ...vendor.toObject(),
      logo: `${url}/${vendor.logo}`,
      signature: `${url}${vendor.signature}`,
    }));

    return res.status(200).json(
      new ApiResponse(
        200,
        "Pending vendor lists retrieved successfully",
        updatedPendingVendors
      )
    );
  } catch (error) {
    // Log the error details for debugging
    console.error('Error retrieving pending vendors:', error);
    next(
      new ApiError(500, "Error retrieving pending vendor lists", error.message)
    );
  }
});


// Get list of accepted vendor forms
const getAcceptedVendorForm = asyncHandler(async (req, res, next) => {
  try {
    const acceptedVendors = await Vendor.find({ status: "accepted" });

    // Check if there are any accepted vendors
    if (!acceptedVendors || acceptedVendors.length === 0) {
      return res.status(404).json(
        new ApiResponse(
          404,
          "No accepted vendor lists found",
          []
        )
      );
    }

    // Convert the WEB_URL to string and log for debugging
    const url = String(process.env.WEB_URL);
    console.log(url);

    // Ensure logo and signature URLs are constructed
    const updatedAcceptedVendors = acceptedVendors.map(vendor => ({
      ...vendor.toObject(),
      logo: `${url}/${vendor.logo}`,
      signature: `${url}${vendor.signature}`,
    }));

    return res.status(200).json(
      new ApiResponse(
        200,
        "Accepted vendor lists retrieved successfully",
        updatedAcceptedVendors
      )
    );
  } catch (error) {
    // Log the error details for debugging
    console.error('Error retrieving accepted vendors:', error);
    next(
      new ApiError(500, "Error retrieving accepted vendor lists", error.message)
    );
  }
});


// Get list of rejected vendor forms
const getRejectedVendorForm = asyncHandler(async (req, res, next) => {
  try {
    const rejectedVendors = await Vendor.find({ status: "rejected" });

    // Check if there are any rejected vendors
    if (!rejectedVendors || rejectedVendors.length === 0) {
      return res.status(404).json(
        new ApiResponse(
          404,
          "No rejected vendor lists found",
          []
        )
      );
    }

    // Convert the WEB_URL to string and log for debugging
    const url = String(process.env.WEB_URL);
    console.log(url);

    // Ensure logo and signature URLs are constructed
    const updatedRejectedVendors = rejectedVendors.map(vendor => ({
      ...vendor.toObject(),
      logo: `${url}/${vendor.logo}`,
      signature: `${url}${vendor.signature}`,
    }));

    return res.status(200).json(
      new ApiResponse(
        200,
        "Rejected vendor lists retrieved successfully",
        updatedRejectedVendors
      )
    );
  } catch (error) {
    // Log the error details for debugging
    console.error('Error retrieving rejected vendors:', error);
    next(
      new ApiError(500, "Error retrieving rejected vendor lists", error.message)
    );
  }
});


// Approve vendor form
const approveVendorForm = asyncHandler(async (req, res) => {
  const { id } = req.params; // Assuming you're passing the ID in the URL

  try {
    const vendor = await Vendor.findById(id);    
    if (!vendor) {
      return res
        .status(404)
        .json(
          new ApiResponse(
            404,
            "Vendor not found",
            "No vendor found with the provided ID."
          )
        );
    }

    // Generate GKC_ID for the vendor based on the country they belong to
    vendor.GKCCId = generateGKC_ID(vendor.city);

    vendor.status = "accepted";

    // Save the vendor profile
    await vendor.save();

    // Send email to the vendor
    await sendEmail(
      vendor.email,
      "Vendor Approved",
      `Congratulations ${vendor.name}, your vendor profile has been approved! Your GKCC ID is ${vendor.GKCCId}.`
    );

    return res
      .status(200)
      .json(new ApiResponse(200, "Vendor approved successfully", vendor));
  } catch (error) {
    console.log("Failed to", error);
    
    return res
      .status(500)
      .json(new ApiResponse(500, "Error approving vendor form", error.message));
  }
});

// Reject vendor form
const rejectVendorForm = asyncHandler(async (req, res) => {
  const { id } = req.params; // Assuming you're passing the ID in the URL

  try {
    const vendor = await Vendor.findById(id);

    if (!vendor) {
      throw new ApiError(
        404,
        "Vendor not found",
        "No vendor found with the provided ID."
      );
    }

    vendor.status = "rejected";
    await vendor.save();

    return res
      .status(200)
      .json(new ApiResponse(200, "Vendor rejected successfully", vendor));
  } catch (error) {
    throw new ApiError(500, "Error rejecting vendor form", error.message);
  }
});

const getAllVendors = asyncHandler(async (req, res, next) => {
  try {
    const allVendors = await Vendor.find({}); // Fetch all vendors without any status filter

    // Check if there are any vendors
    if (!allVendors || allVendors.length === 0) {
      return res.status(404).json(
        new ApiResponse(
          404,
          "No vendors found",
          []
        )
      );
    }

    // Convert the WEB_URL to string and log for debugging
    const url = String(process.env.WEB_URL);
    console.log(url);

    // Ensure logo and signature URLs are constructed
    const updatedAllVendors = allVendors.map(vendor => ({
      ...vendor.toObject(),
      logo: `${url}/${vendor.logo}`,
      signature: `${url}${vendor.signature}`,
    }));

    return res.status(200).json(
      new ApiResponse(
        200,
        "All vendors retrieved successfully",
        updatedAllVendors
      )
    );
  } catch (error) {
    // Log the error details for debugging
    console.error('Error retrieving all vendors:', error);
    next(new ApiError(500, "Error retrieving all vendors", error.message));
  }
});


// get Total Vendor Number
const totalVendor = asyncHandler(async (req, res) => {
  try {
    
    const vendor = await Vendor.find({});

    // Check if associations exist
    if (!Vendor) {
      throw new ApiError(404, "No Vendor found");
    }

    // Respond with the total number of associations
    return res.status(200).json(
      new ApiResponse(200,  {
        Vendor: Vendor.length,
      },"Vendor retrieved successfully",)
    );
  } catch (error) {
    console.error("Error retrieving Vendor:", error);
    throw new ApiError(500, "Error retrieving Vendor", error.message);
  }
});


export {
  createVendor,
  loginVendor,
  getPendingVendorForm,
  getAcceptedVendorForm,
  getRejectedVendorForm,
  approveVendorForm,
  rejectVendorForm,
  getAllVendors,
  totalVendor
};
