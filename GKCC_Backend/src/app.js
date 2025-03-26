import path from "path";
import { fileURLToPath } from "url";


import express from "express";


import helmet from "helmet";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import multer from "multer";
import { globalLimiter } from "../src/utils/limiter.js";


const app = express();




app.use(
  cors({
    origin: ["https://portal.gkcc.world", "https://gkcc.world","http://localhost:3000","http://localhost:3020"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], 
    allowedHeaders: ["Content-Type", "Authorization"], 
    credentials: true, 
    exposedHeaders: ["Content-Length", "X-Requested-With"], // Add exposed headers
  })
);


app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow images from other domains
  })
);


app.use(express.json());


app.use(express.urlencoded({ limit: "50mb", extended: true })); 


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); 


app.use("/Public", express.static(path.join(__dirname, "../Public"), {
  setHeaders: (res) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  },
}));


app.use(globalLimiter);


import MemberRouter from "./routes/membership.router.js";
import AdminRouter from "./routes/admin.router.js";
import AssociationRouter from "./routes/association.router.js";
import VendorRouter from "./routes/vendor.router.js";
import SponsorRouter from "./routes/sponsor.router.js";
import PhotoRouter from "./routes/photo.media.router.js";
import VideoRouter from "./routes/video.media.router.js";
import AdverRouter from "./routes/advert.router.js";
import NewsLetterRouter from "./routes/newsletter.router.js";


app.use("/api/member", MemberRouter);
app.use("/api/admin", AdminRouter);
app.use("/api/association", AssociationRouter);
app.use("/api/vendor", VendorRouter);
app.use("/api/sponsor", SponsorRouter);
app.use("/api/photomedia", PhotoRouter);
app.use("/api/videomedia", VideoRouter);
app.use("/api/advert", AdverRouter);
app.use("/api/newsletter", NewsLetterRouter);

export { app };
