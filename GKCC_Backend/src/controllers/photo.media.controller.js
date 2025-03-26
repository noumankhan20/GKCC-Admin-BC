// controllers/photomedia.controller.js

import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asynchandler.js";
import Photomedia from "../models/photos.media.model.js";
import path from "path";
import fs from "fs/promises";

// Define __dirname for ES modules
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Controller to add an album to photo media using local storage
const addanalbumtophotomedia = asyncHandler(async (req, res) => {
  try {
    const data = req.body;
    const photos = req.files?.albumphotos || [];

    // Validate input
    if (!photos.length) {
      throw new ApiError(400, "No photos provided");
    }

    // Create the album in the database
    const albumSection = await Photomedia.create({
      nameofalbum: data.nameofalbum,
      photosdetails: photos.map(photo => ({
        url: `/Public/AllImages/albumphotos/${photo.filename}`, // Relative URL
        filename: photo.filename,
      })),
    });

    console.log("Album created:", albumSection);

    // Return success response
    return res
      .status(200)
      .json(new ApiResponse("Album created successfully", albumSection));
  } catch (error) {
    console.error("Error adding album to photo media:", error);
    throw new ApiError(500, "An error occurred while processing your request.");
  }
});

// Controller to view all photo albums
const viewAllPhotoMedia = asyncHandler(async (req, res) => {
  try {
    const allAlbums = await Photomedia.find();

    if (!allAlbums || allAlbums.length === 0) {
      throw new ApiError(404, "No photo albums found");
    }

    // Update the URLs in the photosdetails field for each album
    allAlbums.forEach((album) => {
      album.photosdetails.forEach((photo) => {
        photo.url = `${process.env.WEB_URL}${photo.url}`; // Prepend the environment variable to the URL
      });
    });

    return res
      .status(200)
      .json(new ApiResponse(200, "Fetched all photo albums successfully", allAlbums));
  } catch (error) {
    console.error("Error fetching all photo albums:", error);
    throw new ApiError(500, "There was an error fetching the photo albums", error.message);
  }
});


// Controller to delete an entire photo album
const deletePhotoMedia = asyncHandler(async (req, res) => {
  const { _id } = req.params; 

  try {
    const photoAlbum = await Photomedia.findById(_id);
    
    if (!photoAlbum) {
      throw new ApiError(404, "Photo album not found");
    }

    const photos = photoAlbum.photosdetails;

    // Delete each photo file from the local filesystem
    for (let photo of photos) {
      const filePath = path.join(__dirname, "..", photo.url); // Adjust the path as needed
      try {
        await fs.unlink(filePath);
        console.log(`Deleted file: ${filePath}`);
      } catch (err) {
        console.error(`Error deleting file ${filePath}:`, err);
        // Optionally, continue or handle the error as needed
      }
    }

    // Delete the album from the database
    await Photomedia.deleteOne({ _id });

    return res.status(200).json(new ApiResponse(200, "Photo album deleted successfully"));
  } catch (error) {
    console.error("Error deleting photo album:", error);
    throw new ApiError(500, "Something went wrong while deleting the photo album", error.message);
  }
});

// Controller to delete a specific photo from an album
const deletePhotoFromandAlbum = asyncHandler(async (req, res) => {
  const { id, pid } = req.params; 

  try {
    const album = await Photomedia.findById(id);
    
    if (!album) {
      throw new ApiError(404, "Album not found");
    }
    console.log("pid is", pid);
    console.log("album is", album);
    
    // Find the photo by matching the _id string directly with pid
    const photoIndex = album.photosdetails.findIndex(photo => String(photo._id) === pid);
    
    console.log("Photo index found:", photoIndex);
    
    // Check if photo was found
    if (photoIndex !== -1) {
        console.log("Photo found:", album.photosdetails[photoIndex]);
    } else {
        console.log("No photo found with id:", pid);
    }
    
    const photoToDelete = album.photosdetails[photoIndex];
    
    const filePath = path.join(__dirname, "..", photoToDelete.url); // Adjust the path as needed
    try {
      await fs.unlink(filePath);
      console.log(`Deleted file: ${filePath}`);
    } catch (err) {
      console.error(`Error deleting file ${filePath}:`, err);
      // Optionally, you can decide to throw an error or continue
    }

    // Remove the photo from the array
    album.photosdetails.splice(photoIndex, 1);
    
    await album.save();

    return res.status(200).json(new ApiResponse(200, "Photo deleted successfully from the album"));
  } catch (error) {
    console.error("Error deleting photo from album:", error);
    throw new ApiError(500, "An error occurred while deleting the photo from the album", error.message);
  }
});

// Controller to add photos to an existing album
const addaphototoaalbum = asyncHandler(async (req, res) => {
  const { id } = req.params; 
  const album = await Photomedia.findById(id); 

  if (!album) {
    throw new ApiError(404, "Album not found");
  }

  const photos = req.files?.albumphotos || []; 

  if (!photos.length) {
    throw new ApiError(400, "No photos provided");
  }

  if (photos.length > 20) {
    throw new ApiError(400, "Too many files; the limit is 20.");
  }

  let uploadedMedia = []; 
  const uploadDir = path.join(__dirname, "../Public/AllImages/albumphotos");

  // Ensure the directory exists
  // await fs.mkdir(uploadDir, { recursive: true });

  for (let i = 0; i < photos.length; i++) {
    const photo = photos[i];
    try {
      // Move the photo to the local storage
      const photoFileName = `${Date.now()}-${photo.originalname}`;
      const photoPath = path.join(uploadDir, photoFileName);
      await fs.rename(photo.path, photoPath);

      // Store the file information in the array
      uploadedMedia.push({
        url: `/Public/AllImages/PhotoAlbums/${photoFileName}`, // Relative URL
        filename: photoFileName,
      });
    } catch (error) {
      console.error(`Error saving file ${photo.originalname}:`, error);
      continue; 
    }
  }

  // Add the new photos to the album's photosdetails array
  album.photosdetails.push(...uploadedMedia);

  await album.save();

  return res.status(200).json(new ApiResponse(200, "Photos added successfully", album));
});

// Controller to edit album name
const editalbumname = asyncHandler(async (req, res) => {
  const { id } = req.params; 
  const { nameofalbum } = req.body; 
  
  if (!nameofalbum) {
    throw new ApiError(400, "New album name is required");
  }

  const album = await Photomedia.findById(id);

  if (!album) {
    throw new ApiError(404, "Album not found");
  }

  album.nameofalbum = nameofalbum;

  await album.save();

  return res.status(200).json(new ApiResponse(200, "Album name updated successfully", album));
});

export { 
  viewAllPhotoMedia, 
  deletePhotoMedia, 
  addanalbumtophotomedia, 
  deletePhotoFromandAlbum, 
  addaphototoaalbum, 
  editalbumname 
};
