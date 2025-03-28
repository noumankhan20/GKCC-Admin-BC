import { Worker } from "worker_threads";
import { asyncHandler } from "../utils/asynchandler.js";
import Membership from "../models/membership.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import path from "path";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to generate a JWT token
function generateToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" }); // Token expires in 30 days
}

const validateRequiredFields = (data, requiredFields) => {
  const missingFields = requiredFields.filter((field) => !data[field]);
  return missingFields;
};

// Helper function to validate child data
const validateChildren = (children) => {
  if (children.length > 20) {
    return "A maximum of 20 children are allowed.";
  }

  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (!child.name || !/^[A-Za-z\s]+$/.test(child.name.trim())) {
      return `Child ${
        i + 1
      } name is required and must contain only letters and spaces.`;
    }
  }

  return null;
};

const createMembership = asyncHandler(async (req, res, next) => {
  try {

    const {
      country,
      firstName,
      middleName,
      familyName,
      email,
      password,
      dob,
      countryCode,
      bloodGroup,
      education,
      mobileNumber,
      whatsappNumber,
      gender,
      maritalStatus,
      association,
      internationalCountry,
      internationalStateProvince,
      internationalCity,
      internationalStreetAddress,
      internationalFlat,
      internationalBlock,
      internationalPostalCode,
      nativeFlat,
      nativeBlock,
      nativeCity,
      nativeState,
      nativePincode,
      area,
      areaVillage,
      district,
      fatherName,
      motherName,
      spouseName,
      buildingFlat,
      street,
      talukaCity,
      ...childData
    } = req.body;

    // Extract children from form data
    const childrenArray = Object.keys(childData)
      .filter((key) => key.startsWith("childName")) // Get only childName keys
      .map((key) => ({ name: childData[key].trim() })) // Map to child object
      .filter((child) => child.name); // Filter out empty names

    // Validate required fields
    const requiredFields = [
      "association",
      "firstName",
      "middleName",
      "familyName",
      "email",
      "password",
      "dob",
      "bloodGroup",
      "education",
      "mobileNumber",
      "whatsappNumber",
      "gender",
      "maritalStatus",
      "countryCode",




      "internationalCountry",
      "internationalStateProvince",
      "internationalCity",
      "internationalFlat",
      "internationalStreetAddress",
      "internationalBlock",
      "internationalPostalCode",

      
      "nativeFlat",
      "nativeBlock",
      "district",
      "nativeCity",
      "area",
      "nativePincode",

      "fatherName",
      "motherName",
    ];

    if (maritalStatus !== "Single") {
      requiredFields.push("spouseName");
    }

    const missingFields = requiredFields.filter((field) => !req.body[field]);
    if (missingFields.length > 0) {
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            `The following fields are required: ${missingFields.join(", ")}.`
          )
        );
    }

    // Check if email already exists
    
    const existingMembership = await Membership.findOne({ email });
    console.log(existingMembership) ;
    if (existingMembership) {
      console.log('member:', existingMembership);
      return res
        .status(409)
        .json(
          new ApiResponse(
            409,
            "Email is already used. Please try with a different email."
          )
        
        );
    }
  
    // Validate children data
    if (childrenArray.length > 20) {
      return res
        .status(400)
        .json(new ApiResponse(400, "A maximum of 20 children are allowed."));
    }

    for (let i = 0; i < childrenArray.length; i++) {
      const child = childrenArray[i];
      if (!child.name || !/^[A-Za-z\s]+$/.test(child.name)) {
        return res
          .status(400)
          .json(
            new ApiResponse(
              400,
              `Child ${
                i + 1
              } name is required and must contain only letters and spaces.`
            )
          );
      }
    }

    // Prepare new membership data
    const newMembership = new Membership({
      country,
      countryCode:countryCode,
      firstName: firstName.trim(),
      middleName: middleName.trim(),
      familyName: familyName.trim(),
      email: email.trim().toLowerCase(),
      password, // Will be hashed by Mongoose pre-save hook
      dob,
      bloodGroup,
      education: education.trim(),
      mobileNumber: mobileNumber.trim(),
      whatsappNumber: whatsappNumber.trim(),
      gender,
      maritalStatus,
      association: association.trim(),
      internationalCountry: internationalCountry.trim(),
      internationalStateProvince: internationalStateProvince.trim(),
      internationalCity: internationalCity.trim(),
      internationalStreetAddress: internationalStreetAddress.trim(),
      internationalFlat: internationalFlat.trim(),
      internationalBlock: internationalBlock.trim(),
      internationalPostalCode: internationalPostalCode.trim(),
      nativeFlat: nativeFlat.trim(),
      nativeBlock: nativeBlock.trim(),
      nativeCity: nativeCity.trim(),
      nativePincode: nativePincode.trim(),
      area: area.trim(),
      district: district.trim(),
      fatherName: fatherName.trim(),
      motherName: motherName.trim(),
      spouseName: maritalStatus !== "Single" ? spouseName.trim() : undefined,
      children: childrenArray,
    });
    
    // Save to database
    await newMembership.save();

    // Respond to frontend
    res
      .status(201)
      .json(new ApiResponse(201, "Membership data saved successfully."));

    // Send confirmation email via worker thread
    const workerPath = path.resolve(
      __dirname,
      "../services/emailWorker.service.js"
    );
    const worker = new Worker(workerPath);

    const emailData = {
      email,
      subject: "Membership Form Submitted",
      message: `Hello ${middleName}, your membership has been successfully created! We'll connect with you soon regarding your membership. Thank you.`,
    };

    worker.postMessage(emailData);

    worker.on("error", (error) => {
      console.error("Worker thread error:", error);
    });

    worker.on("exit", (code) => {
      if (code !== 0) {
        console.error(`Worker stopped with exit code ${code}`);
      }
    });
  } catch (error) {
    console.error("Error in createMembership:", error);
    next(new ApiError(500, "Error saving membership data", error));
  }
});

// Login function (Updated to use GKCCId)
const loginMembership = asyncHandler(async (req, res) => {
  const { GKCCId, password } = req.body;

  try {
    // Find membership by GKCCId
    const membership = await Membership.findOne({ GKCCId });

    if (!membership) {
      throw new ApiError(404, "Membership not found");
    }

    // Check if the membership status is accepted
    if (membership.status !== "accepted") {
      throw new ApiError(403, "Membership is not accepted yet");
    }

    // Check if the password matches
    const isMatch = await membership.comparePassword(password);
    if (!isMatch) {
      throw new ApiError(401, "Invalid password");
    }

    // Generate a token if status is accepted and password matches
    const token = generateToken(membership._id);

    return res
      .status(200)
      .json(new ApiResponse(200, "Login successful", { token }));
  } catch (error) {
    console.log("Error:", error);
    throw new ApiError(500, "Login failed", error);
  }
});
// Get member details
const getMemberDetail = asyncHandler(async (req, res) => {
  const { id } = req.user;

  try {
    const membership = await Membership.findById(id);

    if (!membership) {
      throw new ApiError(404, "Membership not found");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          membership,
          "Membership details retrieved successfully"
        )
      );
  } catch (error) {
    console.log("Error:", error);
    throw new ApiError(500, "Error retrieving membership details", error);
  }
});

// This Function will Update the Individual Membership details

const updateMemberDetails = asyncHandler(async (req, res) => {
  const { id } = req.user;

  try {
    const updatedData = req.body;

    // Use the $set operator to update only the provided fields
    const membership = await Membership.findByIdAndUpdate(
      id,
      { $set: updatedData },
      { new: true, runValidators: true } // Options: return updated doc & run schema validators
    );

    if (!membership) {
      throw new ApiError(404, "Membership not found");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Membership details updated successfully",
          membership
        )
      );
  } catch (error) {
    console.error("Error updating membership details:", error);
    throw new ApiError(500, "Error updating membership details", error);
  }
});

// Get the Total Number of Member
const totalMember = asyncHandler(async (req, res) => {
  try {
    const Member = await Membership.find({ status: "accepted" });

    // Check if associations exist
    if (!Member) {
      throw new ApiError(404, "No Member found");
    }

    // Respond with the total number of associations
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          totalMember: Member.length,
        },
        "Member retrieved successfully"
      )
    );
  } catch (error) {
    console.error("Error retrieving Member:", error);
    throw new ApiError(500, "Error retrieving Member", error.message);
  }
});

// Get the Total Pending Member
const totalPendingMember = asyncHandler(async (req, res) => {
  try {
    const pendingmember = await Membership.find({ status: "pending" });

    if (!pendingmember) {
      throw new ApiError(404, "pending member not found");
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          pendingcount: pendingmember.length,
        },
        "member pending lists gotten"
      )
    );
  } catch (error) {
    throw new ApiError(402, error, "error pending lists");
  }
});

// Get the Association Pending Member Count

const associationPendingMemberCount = asyncHandler(async (req, res) => {
  try {
    const admin = req.admin;

    const pendingMember = await Membership.find({
      association: admin.association,
      status: "pending",
    });

    if (!pendingMember) {
      throw new ApiError(401, "can't find pending member");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, pendingMember.length, "Paticular member found ")
      );
  } catch (error) {
    throw new ApiError(500, error);
  }
});

// Get the Total number of association Count
const associationTotalMemberCount = asyncHandler(async (req, res) => {
  try {
    const admin = req.admin;

    const MemberCount = await Membership.find({
      association: admin.association,
    });

    if (!MemberCount) {
      throw new ApiError(401, "can't find pending member");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, MemberCount.length, "Paticular member found ")
      );
  } catch (error) {
    throw new ApiError(500, error);
  }
});

//created by vivek to fetch to total number of memeber in a association
const getTotalMembersInAssociation = asyncHandler(async (req, res) => {
  try {
    const { associationName } = req.params;

    // Count the number of members in the given association
    const totalMembers = await Membership.countDocuments({ association: associationName });

    // Respond with the total member count
    return res.status(200).json(
      new ApiResponse(200, { totalMembers }, "Total members in association fetched successfully")
    );
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching total members in association",
      error: error.message,
    });
  }
});

// Controller to fetch the total number of members in a particular association based on GKCCId
const getTotalMembersInAssociationByGKCCId = asyncHandler(async (req, res) => {
  const { GKCCId } = req.params;

  // Check if GKCCId is provided
  if (!GKCCId) {
    return res.status(400).json({ message: "GKCCId is required" });
  }

  // Debugging: Log the received GKCCId
  console.log("Received GKCCId:", GKCCId);

  try {
    // Ensure GKCCId is treated as a string
    const totalMembers = await Membership.countDocuments({ GKCCId: String(GKCCId) });

    // Respond with the total member count
    if (totalMembers === 0) {
      return res.status(404).json({ message: "No members found for the given GKCCId" });
    }

    return res.status(200).json({
      data: { totalMembers },
      message: "Total members in association fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching total members:", error);
    return res.status(500).json({
      message: "Error fetching total members in association by GKCCId",
      error: error.message,
    });
  }
});

const getAllMemberships = asyncHandler(async (req, res) => {
  try {
    // Fetch all membership records
    const memberships = await Membership.find();

    // Check if any memberships are found
    if (memberships.length === 0) {
      return res.status(404).json({ message: "No memberships found" });
    }

    // Return the list of memberships
    return res.status(200).json({
      data: memberships,
      message: "All memberships fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching memberships:", error);
    return res.status(500).json({
      message: "Error fetching all memberships",
      error: error.message,
    });
  }
});

const getMembersByAssociationName = async (req, res) => {
  try {
    const associationName = req.params.associationName;

    // Fetch all members where the associationName matches
    const members = await Membership.find({ association: associationName });

    if (!members || members.length === 0) {
      return res.status(404).json({
        message: "No members found for this association.",
      });
    }

    return res.status(200).json({
      data: members,
      message: "Membership details fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching members:", error);
    return res.status(500).json({
      message: "Failed to fetch membership details",
      error: error.message,
    });
  }
};

export {
  createMembership,
  loginMembership,
  getMemberDetail,
  updateMemberDetails,
  totalMember,
  totalPendingMember,
  associationPendingMemberCount,
  associationTotalMemberCount,
  getTotalMembersInAssociation,
  getTotalMembersInAssociationByGKCCId,
  getAllMemberships,
  getMembersByAssociationName
};
