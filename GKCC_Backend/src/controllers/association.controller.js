import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Association from "../models/association.model.js";
import Membership from "../models/membership.model.js";
import { asyncHandler } from "../utils/asynchandler.js";
import sendEmail from "../services/email.service.js";
import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs/promises";
import XLSX from "xlsx";
import { Worker } from "worker_threads";
import bcrypt from "bcrypt";
import { fileURLToPath } from "url";


// Define __filename and __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to generate a JWT token
function generateToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" }); // Token expires in 30 days
}

function generateGKC_ID(countryName) {
  const prefix = "GKCC";

  // Ensure the country code is exactly 2 uppercase letters
  const country = countryName.toUpperCase().slice(0, 2).padEnd(2, "X");

  const now = new Date();

  // Time-based components
  const seconds = now.getSeconds();
  const milliseconds = now.getMilliseconds();

  // Combine seconds and milliseconds to form a unique number
  const timeUniqueNumber = seconds * 1000 + milliseconds; // Range: 0 - 59999

  // Convert the unique number to Base36
  const timeEncoded = timeUniqueNumber.toString(36).toUpperCase(); // 2-3 characters

  // Generate a random number and encode it in Base36
  const randomNumber = Math.floor(Math.random() * 46656); // 36^3 = 46656
  const randomEncoded = randomNumber.toString(36).toUpperCase(); // 1-3 characters

  // Combine all parts
  const uniqueID = `${prefix}${country}${timeEncoded}${randomEncoded}`;

  // Ensure the ID length is between 10 to 12 characters
  return uniqueID.slice(0, 12); // Truncate if necessary
}

// Login a association
const loginAssociation = async (req, res) => {
  const { GKCCId, password } = req.body;

  try {
    const associationAdmin = await Association.findOne({ GKCCId: GKCCId });
    if (!associationAdmin) {
      return res.status(404).json({ message: "associationAdmin not found" });
    }
    const token = generateToken(associationAdmin._id);

    const isMatch = await associationAdmin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json(new ApiError(500, "wrong password"));
    }

    res.status(200).json(new ApiResponse(200, associationAdmin, token));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller to create an association
const createAssociation = asyncHandler(async (req, res) => {
  try {
    const {
      associationName,
      country,
      locationCity,
      associationContactNumber,
      associationEmail,
      password,
      websiteLink,
      yearEstablished,
      numberOfMembers,
      presidentName,
      presidentMobileNumber,
      presidentWhatsappNumber,
      presidentEmail,
      presidentDistrict,
      presidentTaluka,
      presidentVillage,
      secretaryName,
      secretaryMobileNumber,
      secretaryWhatsappNumber,
      secretaryDistrict,
      secretaryTaluka,
      secretaryVillage,
      associationActivities,
      activityDate,
    } = req.body;
    
    // Validate that a signature file is provided
    if (!req.files || !req.files.signature || req.files.signature.length === 0) {
      throw new ApiError(400, "President signature is required.");
    }

    // Set up directories for file uploads
    // Adjust these paths as needed. They assume your public images are stored under
    // /Public/AllImages/signature and /Public/AllImages/logo relative to the project root.
    const uploadDir = path.join(__dirname, "../Public/AllImages");
    const signatureDir = path.join(uploadDir, "signature");
    const logoDir = path.join(uploadDir, "logo");

    // Save the president's signature locally
    const signatureFile = req.files.signature[0];
    const signatureFilePath = path.join(signatureDir, signatureFile.filename);
    // Uncomment the following line if you wish to move the file to the desired folder:
    // fs.renameSync(signatureFile.path, signatureFilePath);

    // Optionally, save the association's logo locally (if provided)
    let logoFilePath = "";
    if (req.files.logo && req.files.logo[0]) {
      const logoFile = req.files.logo[0];
      logoFilePath = path.join(logoDir, logoFile.filename);
      // Uncomment the following line if you wish to move the file to the desired folder:
      // fs.renameSync(logoFile.path, logoFilePath);
    }

    // Create the new association object
    const newAssociation = new Association({
      associationName,
      country,
      locationCity,
      associationContactNumber,
      associationEmail,
      password,
      websiteLink,
      yearEstablished,
      numberOfMembers,
      associationLogo: logoFilePath
        ? `/Public/AllImages/logo/${path.basename(logoFilePath)}`
        : "",
      president: {
        name: presidentName,
        mobileNumber: presidentMobileNumber,
        whatsappNumber: presidentWhatsappNumber,
        email: presidentEmail,
        district: presidentDistrict,
        taluka: presidentTaluka,
        village: presidentVillage,
        signature: `/Public/AllImages/signature/${path.basename(signatureFilePath)}`, // Relative path
      },
      secretary: {
        name: secretaryName,
        mobileNumber: secretaryMobileNumber,
        whatsappNumber: secretaryWhatsappNumber,
        district: secretaryDistrict,
        taluka: secretaryTaluka,
        village: secretaryVillage,
      },
      associationActivities,
      activityDate,
    });

    // Save the new association to the database
    await newAssociation.save();
    
    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          newAssociation,
          "Association created successfully!"
        )
      );
  } catch (error) {
    console.error("Error creating association:", error);
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error);
    } else {
      return res
        .status(500)
        .json(new ApiError(500, "Internal server error", [error.message]));
    }
  }
});

const test = asyncHandler(async (req, res) => {
  try {
    const mainimage = req.files.signature[0];

    // Create a relative file path for the database
    const filePath = `${process.env.WEB_URL}/Public/AllImages/signature/${mainimage.filename}`;

    // Save the file entry in the database

    // Respond with success
    res.status(201).json({
      message: "Association created successfully!",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get list of pending association forms
const getPendingAssociation = asyncHandler(async (req, res, next) => {
  try {
    const associationPending = await Association.find({ status: "pending" });

    // Update file paths with environment variable
    const updatedAssociations = associationPending.map((assoc) => ({
      ...assoc._doc,
      associationLogo: assoc.associationLogo
        ? `${process.env.WEB_URL}${assoc.associationLogo}`
        : "",
      president: {
        ...assoc.president,
        signature: assoc.president.signature
          ? `${process.env.WEB_URL}${assoc.president.signature}`
          : "",
      },
    }));

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Pending Association lists retrieved successfully",
          updatedAssociations
        )
      );
  } catch (error) {

    next(
      new ApiError(
        500,
        "Error retrieving pending Association lists",
        error.message
      )
    );
  }
});

// Get list of accepted association forms
const getAcceptedAssociation = asyncHandler(async (req, res, next) => {
  try {
    const acceptedAssociation = await Association.find({ status: "accepted" });

    // Update file paths with environment variable
    const updatedAssociations = acceptedAssociation.map((assoc) => ({
      ...assoc._doc,
      associationLogo: assoc.associationLogo
        ? `${process.env.WEB_URL}${assoc.associationLogo}`
        : "",
      president: {
        ...assoc.president,
        signature: assoc.president.signature
          ? `${process.env.WEB_URL}${assoc.president.signature}`
          : "",
      },
    }));

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Accepted association lists retrieved successfully",
          updatedAssociations
        )
      );
  } catch (error) {
    next(
      new ApiError(
        500,
        "Error retrieving accepted association lists",
        error.message
      )
    );
  }
});

// Get list of rejected association forms
const getRejectedAssociation = asyncHandler(async (req, res, next) => {
  try {
    const rejectedAssociation = await Association.find({ status: "rejected" });

    // Update file paths with environment variable
    const updatedAssociations = rejectedAssociation.map((assoc) => ({
      ...assoc._doc,
      associationLogo: assoc.associationLogo
        ? `${process.env.WEB_URL}${assoc.associationLogo}`
        : "",
      president: {
        ...assoc.president,
        signature: assoc.president.signature
          ? `${process.env.WEB_URL}${assoc.president.signature}`
          : "",
      },
    }));

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Rejected association lists retrieved successfully",
          updatedAssociations
        )
      );
  } catch (error) {
    next(
      new ApiError(
        500,
        "Error retrieving rejected association lists",
        error.message
      )
    );
  }
});

const approveAssociation = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Find the association
    const association = await Association.findById(id);
    if (!association) {
      return res
        .status(404)
        .json(
          new ApiResponse(
            404,
            "Association not found",
            "No association found with the provided ID."
          )
        );
    }

    // 2. Process Image Uploads - Using Same Logic as createAssociation
    const signatureFilePath =
      req.files && req.files.signature && req.files.signature[0]
        ? `/Public/AllImages/signature/${req.files.signature[0].filename}`
        : association.president.signature;

    const logoFilePath =
      req.files && req.files.logo && req.files.logo[0]
        ? `/Public/AllImages/logo/${req.files.logo[0].filename}`
        : association.associationLogo;

    // 3. Update Textual Fields (Only Update If Present)
    if (req.body.associationName) association.associationName = req.body.associationName;
    if (req.body.country) association.country = req.body.country;
    if (req.body.locationCity) association.locationCity = req.body.locationCity;
    if (req.body.associationContactNumber) association.associationContactNumber = req.body.associationContactNumber;
    if (req.body.associationEmail) association.associationEmail = req.body.associationEmail;
    if (req.body.websiteLink) association.websiteLink = req.body.websiteLink;
    if (req.body.yearEstablished) association.yearEstablished = req.body.yearEstablished;
    if (req.body.numberOfMembers) association.numberOfMembers = req.body.numberOfMembers;
    if (req.body.associationActivities) association.associationActivities = req.body.associationActivities;
    if (req.body.activityDate) association.activityDate = req.body.activityDate;

    // 4. Update President & Secretary Fields
    if (req.body.president) {
      const parsedPresident = JSON.parse(req.body.president);
      association.president.name = parsedPresident.name || association.president.name;
      association.president.mobileNumber = parsedPresident.mobileNumber || association.president.mobileNumber;
      association.president.whatsappNumber = parsedPresident.whatsappNumber || association.president.whatsappNumber;
      association.president.email = parsedPresident.email || association.president.email;
      association.president.district = parsedPresident.district || association.president.district;
      association.president.taluka = parsedPresident.taluka || association.president.taluka;
      association.president.village = parsedPresident.village || association.president.village;
    }

    if (req.body.secretary) {
      const parsedSecretary = JSON.parse(req.body.secretary);
      association.secretary.name = parsedSecretary.name || association.secretary.name;
      association.secretary.mobileNumber = parsedSecretary.mobileNumber || association.secretary.mobileNumber;
      association.secretary.whatsappNumber = parsedSecretary.whatsappNumber || association.secretary.whatsappNumber;
      association.secretary.district = parsedSecretary.district || association.secretary.district;
      association.secretary.taluka = parsedSecretary.taluka || association.secretary.taluka;
      association.secretary.village = parsedSecretary.village || association.secretary.village;
    }

    // 5. Save Updated Image Paths
    association.president.signature = signatureFilePath;
    association.associationLogo = logoFilePath;

    // 6. Generate GKCC_ID and Approve the Association
    association.GKCCId = generateGKC_ID(association.country);
    association.status = "accepted";

    // 7. Save the Changes
    await association.save();

    // 8. Send Approval Email
    // await sendEmail(
    //   association.associationEmail,
    //   "Association Approved",
    //   `Congratulations ${association.associationName}, your association profile has been approved! Your GKCC ID is ${association.GKCCId}.`
    // );

    return res
      .status(200)
      .json(
        new ApiResponse(200, "Association approved successfully", association)
      );

  } catch (error) {
    console.error("Failed to approve association:", error);
    return res
      .status(500)
      .json(
        new ApiResponse(500, "Error approving association form", error.message)
      );
  }
});

// Reject association form
const rejectAssociation = asyncHandler(async (req, res) => {
  const { id } = req.params; // Assuming you're passing the ID in the URL

  try {
    const association = await Association.findById(id);

    if (!association) {
      throw new ApiError(
        404,
        "Association not found",
        "No association found with the provided ID."
      );
    }

    association.status = "rejected";
    await association.save();

    // Optionally, send an email notification about rejection
    await sendEmail(
      association.associationEmail,
      "Association Rejected",
      `Dear ${association.associationName}, we regret to inform you that your association profile has been rejected. Please contact support for more details.`
    );

    return res
      .status(200)
      .json(
        new ApiResponse(200, "Association rejected successfully", association)
      );
  } catch (error) {
    throw new ApiError(500, "Error rejecting association form", error.message);
  }
});

//getallascoaition
const getAllAssociations = asyncHandler(async (req, res, next) => {
  try {
    const allAssociations = await Association.find({}); // Fetch all associations without any status filter

    // Update file paths with environment variable
    const updatedAssociations = allAssociations.map((assoc) => ({
      ...assoc._doc,
      associationLogo: assoc.associationLogo
        ? `${process.env.WEB_URL}${assoc.associationLogo}`
        : "",
      president: {
        ...assoc.president,
        signature: assoc.president.signature
          ? `${process.env.WEB_URL}${assoc.president.signature}`
          : "",
      },
    }));

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "All associations retrieved successfully",
          updatedAssociations
        )
      );
  } catch (error) {
    throw new ApiError(500, "Error retrieving all associations", error.message);
  }
});

// This Function is used to get All the Association Names List
const getAllAssociationNames = asyncHandler(async (req, res) => {
  try {
    const allAssociationNames = await Association.find(
      {},
      { associationName: 1, GKCCId: 1, _id: 0 }
    );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          allAssociationNames,
          "All Association Names Retrieved Successfully"
        )
      );
  } catch (error) {
    throw new ApiError(
      500,
      "Error Retrieving List of All Association Names",
      error.message
    );
  }
});

const getAcceptedAssociationNames =  asyncHandler(async (req, res) => {
  try {


    const allAssociationNames = await Association.find({status: "accepted" },{ associationName: 1 });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          allAssociationNames,
          "All Association Names Retrieved Successfully"
        )
      );
  } catch (error) {
    throw new ApiError(
      500,
      "Error Retrieving List of All Association Names",
      error.message
    );
  }
});




// This Function is used to get a single Association Details
const getOneAssociationDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const associationDetails = await Association.findById(id);

    if (!associationDetails) {
      throw new ApiError(
        404,
        "Association not found",
        "No association found with the provided ID."
      );
    }

    // Update file paths with environment variable
    const updatedAssociation = {
      ...associationDetails._doc,
      associationLogo: associationDetails.associationLogo
        ? `${process.env.WEB_URL}${associationDetails.associationLogo}`
        : "",
      president: {
        ...associationDetails.president,
        signature: associationDetails.president.signature
          ? `${process.env.WEB_URL}${associationDetails.president.signature}`
          : "",
      },
    };

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Association Details Retrieved Successfully",
          updatedAssociation
        )
      );
  } catch (error) {
    throw new ApiError(
      500,
      "Error Retrieving Association Details",
      error.message
    );
  }
});

// Bulk membership upload handler
const uploadMembershipBulks = async (req, res) => {
  if (!req.file || !req.file.path) {
    console.warn("No file received.");
    return res.status(400).json({ message: "No valid file uploaded" });
  }

  try {
    const filePath = path.resolve(req.file.path);

    await fs.access(filePath);
    const fileBuffer = await fs.readFile(filePath);

    const workbook = XLSX.read(fileBuffer, { type: "buffer" });

    if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
      throw new Error("No sheets found in the workbook");
    }

    const sheetName = workbook.SheetNames[0];

    const sheet = workbook.Sheets[sheetName];

    if (!sheet) {
      throw new Error(`Sheet not found: ${sheetName}`);
    }

    const data = XLSX.utils.sheet_to_json(sheet, { raw: false });

    const membershipData = [];
    const emailJobs = []; // Collect email jobs for the worker

    // Define required fields from Mongoose schema
    const requiredFields = [
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
      "association",
      "internationalFlat",
      "internationalBlock",
      "internationalStreetAddress",
      "internationalCity",
      "internationalStateProvince",
      "internationalPostalCode",
      "internationalCountry",
      "nativeFlat",
      "nativeBlock",
      "district",
      "area",
      "nativePincode",
      "nativeCity",
      "nativeState",
      "fatherName",
      "motherName",
    ];

    // Process each record
    for (const [index, record] of data.entries()) {
      // Trim all string fields to remove leading/trailing whitespace
      for (const key in record) {
        if (typeof record[key] === "string") {
          record[key] = record[key].trim();
        }
      }

      // Validate required fields
      const missingFields = requiredFields.filter((field) => {
        return !record[field] || record[field].toString().trim() === "";
      });

      // Skip invalid records
      if (missingFields.length > 0) {
        console.warn(
          `Skipping record ${
            index + 2
          } due to missing fields: ${missingFields.join(", ")}`
        );
        continue;
      }

      // Conditionally require 'spouseName' and default to empty string if not provided
      const spouse =
        record.maritalStatus !== "Single" && !record.spouseName
          ? ""
          : record.spouseName || "";

      // Process children field
      let childrenArray = [];
      if (record.children && typeof record.children === "string") {
        childrenArray = record.children
          .split(",")
          .map((childName) => childName.trim())
          .filter((childName) => childName.length > 0)
          .map((childName) => ({ name: childName }));
      }
      const children = childrenArray.length > 0 ? childrenArray : [];

      // Generate GKCC ID based on the country
      const GKCCId = generateGKC_ID(record.internationalCountry);

      // Set the status to "accepted"
      const status = "accepted";

      // Hash the password for storage in the database
      const plainPassword = record.password;
      const hashedPassword = await bcrypt.hash(plainPassword, 10);

      // Create the new membership record
      const newMembershipRecord = {
        ...record,
        spouseName: spouse,
        children: children,
        GKCCId: GKCCId,
        status: status,
        password: hashedPassword,
      };

      membershipData.push(newMembershipRecord);

      // Prepare email job for the worker
      emailJobs.push({
        to: record.email,
        subject: "Membership Approved",
        text: `Congratulations ${record.firstName} ${record.familyName}, your membership has been approved! Your GKCC ID is ${GKCCId}. Please use your original password: ${plainPassword} to log in. Welcome to the community!`,
      });
    }

    if (membershipData.length > 0) {
      // Insert the records into MongoDB
      const result = await Membership.insertMany(membershipData, {
        ordered: false,
      });

      // Offload email sending to a worker thread
      const worker = new Worker(
        path.resolve(__dirname, "../services/emailWorker.js"),
        {
          workerData: { emailJobs }, // Send email jobs to the worker
        }
      );

      worker.on("message", (msg) => {
        console.log("Worker message:", msg);
      });

      worker.on("error", (error) => {
        console.error("Worker error:", error);
      });

      return res.status(200).json({
        message:
          "Excel file processed successfully. Emails will be sent in the background.",
        insertedCount: result.length,
        insertedIds: result.map((doc) => doc._id),
      });
    } else {
      console.warn("No valid records found to insert.");
      return res.status(400).json({
        message: "No valid records found to save",
      });
    }
  } catch (error) {
    console.error("Error during processing:", error);
    return res
      .status(500)
      .json({ message: "Error processing Excel data", error: error.message });
  } finally {
    if (req.file.path) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error("Error deleting the file:", unlinkError);
      }
    }
  }
};

// This Function is used to get Total Number of Associations
const totalAssociationNumber = asyncHandler(async (req, res) => {
  try {
    const associations = await Association.find({});

    // Check if associations exist
    if (!associations) {
      throw new ApiError(404, "No associations found");
    }

    // Respond with the total number of associations
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          totalAssociations: associations.length,
        },
        "Associations retrieved successfully"
      )
    );
  } catch (error) {
    console.error("Error retrieving associations:", error);
    throw new ApiError(500, "Error retrieving associations", error.message);
  }
});

export {
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
  getAcceptedAssociationNames
};
