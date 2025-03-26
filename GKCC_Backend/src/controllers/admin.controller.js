import { asyncHandler } from "../utils/asynchandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import Admin from "../models/admin.model.js";
import sendEmail from "../services/email.service.js";
import Membership from "../models/membership.model.js";
import jwt from "jsonwebtoken";
import XLSX from 'xlsx';



// Function to generate a JWT token
function generateToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" }); // Token expires in 30 days
}

// Function to generate GKC_ID
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

// Admin Login Function (Updated to use GKCCId instead of email)
const loginAdmin = asyncHandler(async (req, res) => {
  const { GKCCId, password } = req.body;

  // Check if the admin exists in the database by GKCCId
  const admin = await Admin.findOne({ GKCCId });

  if (admin && (await admin.comparePassword(password))) {
    // Password matches, generate a token
    const token = generateToken(admin._id);

    return res.json(
      new ApiResponse(200, "Admin logged in successfully", {
        admin: {
          _id: admin._id,
          GKCCId: admin.GKCCId,
          position: admin.position,
          associationName: admin.association,
          country: admin.country,
          city: admin.city,
        },
        token,
      })
    );
  } else {
    throw new ApiError(
      401,
      "Invalid GKCCId or password",
      "Please check your credentials and try again."
    );
  }
});

// Register Admin Function (No changes to validation, already includes GKCCId)

const registerAdmin = asyncHandler(async (req, res) => {
  const data = req.body;
  
  // Generate GKC_ID for the admin
  data.GKCCId = generateGKC_ID(data.country); // Assuming data includes 'country'

  try {
    // Check if the GKC_ID is already used
    const existingAdmin = await Admin.findOne({
      GKCCId: data.GKCCId,
    });
    if (existingAdmin) {
      // Return an error response if the GKC_ID is already in use
      return res
        .status(409)
        .json(
          new ApiResponse(
            409,
            "GKCCId already exists. Please try with different details."
          )
        );
    }
    const existingAdmin1 = await Admin.findOne({
      email: data.email,
    });
    if (existingAdmin1) {
      // Return an error response if the GKC_ID is already in use
      return res
        .status(409)
        .json(
          new ApiResponse(
            409,
            "Email already exists. Please try with different details."
          )
        );
    }
    const newAdmin = new Admin(data);
    
    const savedAdmin = await newAdmin.save();
    

    const token = generateToken(savedAdmin._id);
    
    return res.status(201).json(
      new ApiResponse(201, "Admin registered successfully", {
        admin: savedAdmin,
        token,
      })
    );
  } catch (error) {
    console.error("Error details:", error);  // Log error for debugging
    throw new ApiError(500, "Error registering admin", error.message);
  
  }
});

const checkstatus = asyncHandler(async (req, res) => {
  const admin = req.admin; // The authenticated admin info added by the JWT middleware

  if (!admin) {
    throw new ApiError(
      401,
      "Unauthorized",
      "You need to be logged in to access this resource."
    );
  }

  // Respond with the admin details and a success message
  return res
    .status(200)
    .json(new ApiResponse(200, "Admin status retrieved successfully", admin));
});

const getSAPendingList = asyncHandler(async (req, res, next) => {
  try {
    const pendingLists = await Membership.find({ status: "pending" });
    
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "SuperAdmin: Pending lists retrieved successfully",
          pendingLists
        )
      );
  } catch (error) {
    next(new ApiError(500, "Error retrieving pending lists", error.message));
  }
});

// Get list of accepted memberships for SuperAdmin
const getSAAcceptedList = asyncHandler(async (req, res, next) => {
  try {
    const acceptedLists = await Membership.find({ status: "accepted" });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "SuperAdmin: Accepted lists retrieved successfully",
          acceptedLists
        )
      );
  } catch (error) {
    next(new ApiError(500, "Error retrieving accepted lists", error.message));
  }
});

// Get list of rejected memberships for SuperAdmin
const getSARejectedList = asyncHandler(async (req, res, next) => {
  try {
    const rejectedLists = await Membership.find({ status: "rejected" });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "SuperAdmin: Rejected lists retrieved successfully",
          rejectedLists
        )
      );
  } catch (error) {
    next(new ApiError(500, "Error retrieving rejected lists", error.message));
  }
});

// Get list of pending user statuses
const getPendingList = asyncHandler(async (req, res, next) => {
  try {
    const admin = req.admin;

    if (!admin || !admin.association) {
      throw new ApiError(400, "Admin information is missing or incomplete");
    }

    const pendingLists = await Membership.find({
      status: "pending",
      association:admin.association,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Pending lists retrieved successfully",
          pendingLists
        )
      );
  } catch (error) {
    next(new ApiError(500, "Error retrieving pending lists", error.message));
  }
});

// Get lists of accepted user status
const getAcceptedList = asyncHandler(async (req, res, next) => {
  try {
    const admin = req.admin;

    if (!admin || !admin.association) {
      throw new ApiError(400, "Admin information is missing or incomplete");
    }

    const acceptedLists = await Membership.find({
      status: "accepted",
      association: admin.association,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Accepted lists retrieved successfully",
          acceptedLists
        )
      );
  } catch (error) {
    next(new ApiError(500, "Error retrieving accepted lists", error.message));
  }
});

// Get lists of rejected user status
const getRejectedList = asyncHandler(async (req, res, next) => {
  try {
    const admin = req.admin;

    if (!admin || !admin.association) {
      throw new ApiError(400, "Admin information is missing or incomplete");
    }

    const rejectedLists = await Membership.find({
      status: "rejected",
      association: admin.association,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Rejected lists retrieved successfully",
          rejectedLists
        )
      );
  } catch (error) {
    new ApiError(500, "Error retrieving rejected lists", error.message);
  }
});

const approveForm = asyncHandler(async (req, res) => {
  const { id } = req.params; // Membership ID from URL
  const {
    firstName,
    middleName,
    familyName,
    email,
    dob,
    bloodGroup,
    education,
    gender,
    maritalStatus,
    whatsappCountryCode,
    whatsappNumber,
    mobileCountryCode,
    mobileNumber,
    internationalFlat,
    internationalBlock,
    internationalStreetAddress,
    internationalCity,
    internationalStateProvince,
    internationalPostalCode,
    internationalCountry,
    nativeFlat,
    nativeBlock,
    nativeCity,
    district,
    nativePincode,
    area,
    fatherName,
    motherName,
    children, // Array
  } = req.body;

  try {
    const profile = await Membership.findById(id);

    if (!profile) {
      return res
        .status(404)
        .json(
          new ApiResponse(
            404,
            "Membership not found",
            "No membership found with the provided ID."
          )
        );
    }

    // Validate required fields
    if (!dob || !internationalCountry) {
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            "Invalid profile data",
            "DOB or country is missing."
          )
        );
    }

    // Update profile fields with submitted data
    profile.firstName = firstName || profile.firstName;
    profile.middleName = middleName || profile.middleName;
    profile.familyName = familyName || profile.familyName;
    profile.email = email || profile.email;
    profile.dob = dob || profile.dob;
    profile.bloodGroup = bloodGroup || profile.bloodGroup;
    profile.education = education || profile.education;
    profile.gender = gender || profile.gender;
    profile.maritalStatus = maritalStatus || profile.maritalStatus;

    // Update phone fields separately
    profile.whatsappCountryCode = whatsappCountryCode || profile.whatsappCountryCode;
    profile.whatsappNumber = whatsappNumber || profile.whatsappNumber;
    profile.mobileCountryCode = mobileCountryCode || profile.mobileCountryCode;
    profile.mobileNumber = mobileNumber || profile.mobileNumber;

    // Update address details
    profile.internationalFlat = internationalFlat || profile.internationalFlat;
    profile.internationalBlock = internationalBlock || profile.internationalBlock;
    profile.internationalStreetAddress = internationalStreetAddress || profile.internationalStreetAddress;
    profile.internationalCity = internationalCity || profile.internationalCity;
    profile.internationalStateProvince = internationalStateProvince || profile.internationalStateProvince;
    profile.internationalPostalCode = internationalPostalCode || profile.internationalPostalCode;
    profile.internationalCountry = internationalCountry || profile.internationalCountry;

    profile.nativeFlat = nativeFlat || profile.nativeFlat;
    profile.nativeBlock = nativeBlock || profile.nativeBlock;
    profile.nativeCity = nativeCity || profile.nativeCity;
    profile.district = district || profile.district;
    profile.nativePincode = nativePincode || profile.nativePincode;
    profile.area = area || profile.area;

    // Family information
    profile.fatherName = fatherName || profile.fatherName;
    profile.motherName = motherName || profile.motherName;

    // Handle children array (if provided)
    if (Array.isArray(children)) {
      profile.children = children;
    }



    // Generate GKC_ID on approval
    if (!profile.GKCCId) {
      profile.GKCCId = generateGKC_ID(internationalCountry);
    }

    profile.status = "accepted"; // Mark as approved

    // Save profile updates
    await profile.save();

    // // Send approval email
    // await sendEmail(
    //   profile.email,
    //   "Membership Approved",
    //   `Congratulations ${profile.middleName}, your membership has been approved! Your GKC_ID is ${profile.GKCCId}. Welcome to the community!`
    // );
    
    return res
    .status(200)
    .json(new ApiResponse(200, "Form approved successfully", profile));
  } catch (error) {
    console.error("Error in approveForm:", error);
    return res
    .status(500)
    .json(new ApiResponse(500, "Error approving form", error.message));
  }
});

//reject the form of user who's pending
const rejectForm = asyncHandler(async (req, res) => {
  const { id } = req.params; // Assuming you're passing the ID in the URL

  try {
    const profile = await Membership.findById(id);

    if (!profile) {
      throw new ApiError(
        404,
        "Membership not found",
        "No membership found with the provided ID."
      );
    }

    profile.status = "rejected";
    await profile.save();

    return res
      .status(200)
      .json(new ApiResponse(200, "Form rejected successfully", profile));
  } catch (error) {
    throw new ApiError(500, "Error rejecting form", error.message);
  }
});

const uploadBulks=  asyncHandler(async (req, res) => {
  const file = req.file;

  // Log the uploaded file for debugging
  if (!file || !file.buffer) {
    return res.status(400).json({ message: 'No valid file uploaded' });
  }

  try {
    // Load the Excel file from the buffer
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });

    // Check if workbook has sheets
    if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
      throw new ApiError('No sheets found in the workbook');
    }

    // Extract the first sheet
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) {
      throw new ApiError(`Sheet not found: ${sheetName}`);
    }

    // Convert sheet to JSON
    const data = XLSX.utils.sheet_to_json(sheet, { raw: false });

    // Prepare a single object to hold all admin records
    const adminData = {
      admins: [] // Array to hold admin records
    };

    // Process each row and prepare the batch updates
    for (const record of data) {
      const { email, password, position, country, city } = record;

      // Validate required fields
      if (!email || !password || !position || !country || !city) {  
        continue; // Skip this record if any field is missing
      }

      // Create a new admin record object
      const newAdminRecord = {
        email,
        password,
        position,
        country,
        city,
      };

      // Add the new record to the admins array
      adminData.admins.push(newAdminRecord);
    }

    // Insert all valid admin records into MongoDB
    if (adminData.admins.length > 0) {
      const result = await Admin.insertMany(adminData.admins);
      return res.status(200).json({ message: 'Excel file processed and admin records added successfully', result });
    } else {
      return res.status(400).json({ message: 'No valid records found to save' });
    }
  }catch (error) {
    throw new ApiError(500, "Error Proccessing Excel data", error.message);
  }
});

const downloadExcel=asyncHandler(async(req, res)=>{
  const jsonData = req.body;


  // Validate JSON data
  if (!Array.isArray(jsonData) || jsonData.length === 0) {    
    return res.status(400).json({ message: 'Invalid or empty JSON data' });
  }


  // Convert JSON to a worksheet
  const worksheet = XLSX.utils.json_to_sheet(jsonData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

  // Create a buffer and set the response headers
  const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

  res.setHeader('Content-Disposition', 'attachment; filename=data_records.xlsx');
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

  // Send the buffer as a response
  return res.status(200).send(buffer);
})

export {
  downloadExcel,
  registerAdmin,
  getPendingList,
  getAcceptedList,
  getRejectedList,
  approveForm,
  rejectForm,
  loginAdmin,
  getSAPendingList,
  getSAAcceptedList,
  getSARejectedList,
  checkstatus,
  uploadBulks
};
