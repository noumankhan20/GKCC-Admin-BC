import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asynchandler.js";

import Videomedia from "../models/videos.media.model.js";

const uploadVideoonMediaPage = asyncHandler(async (req, res) => {
  try {
    const data = req.body;

    if (!data) {
      throw new ApiError(400, "Data is missing");
    }

    if (!data.nameofalbum) {
      throw new ApiError(400, "Album name is required");
    }

    const allvideos = data.videosdetails;

    if (!allvideos || !Array.isArray(allvideos) || allvideos.length === 0) {
      throw new ApiError(400, "At least one video URL is required");
    }

    const videos = await Videomedia.create({
      nameofalbum: data.nameofalbum,
      videosdetails: allvideos,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, "Videos uploaded successfully", videos));
  } catch (error) {
    console.error("Error in uploadVideoonMediaPage:", error);

    return res
      .status(error.statusCode || 500)
      .json(
        new ApiError(
          error.statusCode || 500,
          error.message || "Server Error",
          error
        )
      );
  }
});

const viewVideomedia = asyncHandler(async (req, res) => {
  try {
    const allVideos = await Videomedia.find();

    if (!allVideos || allVideos.length === 0) {
      throw new ApiError(404, "No videos found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "List retrieved successfully", allVideos));
  } catch (error) {
    throw new ApiError(500, "Error retrieving videos", error);
  }
});

const deletealbum = asyncHandler(async (req, res) => {
  const { _id } = req.params;

  try {
    const video = await Videomedia.findById(_id);

    if (!video) {
      throw new ApiError(404, "Album not found");
    }

    await Videomedia.deleteOne({ _id });

    return res
      .status(200)
      .json(new ApiResponse(200, "Album deleted successfully"));
  } catch (error) {
    throw new ApiError(500, "Error deleting video", error);
  }
});

const addvideoonalbum = asyncHandler(async (req, res) => {
  const { _id } = req.params; // Album ID
  const { url, videoId } = req.body; // Video details provided in request

  // Validate inputs
  if (!url || !videoId) {
    throw new ApiError(400, "Video URL and Video ID are required");
  }

  // Fetch album from database
  const album = await Videomedia.findById(_id);
  if (!album) {
    throw new ApiError(404, "Album not found");
  }

  // Check if video already exists in the album
  if (album.videosdetails.some((video) => video.videoId === videoId)) {
    throw new ApiError(400, "Video already exists in the album");
  }

  // Check if album exceeds the video limit
  if (album.videosdetails.length >= 20) {
    throw new ApiError(400, "Cannot add more than 20 videos to an album");
  }

  // Add new video to album
  album.videosdetails.push({ url, videoId });
  await album.save();

  return res.status(200).json(new ApiResponse(200, "Video added successfully", album));
});


const deletevideofromalbum = asyncHandler(async (req, res) => {
  const { _id, _VidId } = req.params;

  try {
    // Find the album by its ID
    const album = await Videomedia.findById(_id);
    
    // Check if album exists
    if (!album) {
      throw new ApiError(404, "Album not found");
    }

    // Find the index of the video to delete
    const videoIndex = album.videosdetails.findIndex(url => url._id.toString() === _VidId);

    // If video not found in the album
    if (videoIndex === -1) {
      throw new ApiError(404, "Video not found in album");
    }

    // Remove the video from the videosdetails array
    album.videosdetails.splice(videoIndex, 1);

    // Save the updated album
    await album.save();

    // Respond with success
    res.status(200).json({
      message: "Video deleted successfully from the album",
    });
  } catch (error) {
    // Handle any errors
    throw new ApiError(400, "There's something wrong, please try again", error);
  }
});


const editalbum = asyncHandler(async (req, res) => {
try {
    const { id } = req.params; // Album ID from the route
    const { nameofalbum } = req.body; // New album details
  
    if (!nameofalbum) {
      throw new ApiError(400, "Album name is required");
    }
  
    const album = await Videomedia.findById(id); // Ensure you're using `Videomedia`
    if (!album) {
      throw new ApiError(404, "Album not found");
    }
  
    // Update the album fields
    album.nameofalbum = nameofalbum;
  
  
    await album.save();
  
    return res.status(200).json(new ApiResponse(200, "Album updated successfully", album));
  
} catch (error) {
  return res.status(501).json(new ApiResponse(501,error,"error while parsing "))
  
}});


export { uploadVideoonMediaPage, viewVideomedia,addvideoonalbum, deletealbum,deletevideofromalbum , editalbum};
