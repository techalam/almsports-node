const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Create an Express app
const AWS = require("aws-sdk");
const multer = require("multer");
const crypto = require("crypto");
const app = express();
app.use(cors());
app.use(express.json());

// Define your routes
const authRoutes = require("../routes/authRoutes");
const collectionRouter = require("../routes/collectionRoutes");
const productsRoutes = require("../routes/productRoutes");
const catalougeRouter = require("../routes/catalougeRoutes");

app.get("/", (req, res) => {
  res.json({ message: "Hello from Express on Vercel!" });
});
app.use("/api/auth", authRoutes);
app.use("/api/collections", collectionRouter);
app.use("/api/products", productsRoutes);
app.use("/api/catalouges", catalougeRouter);

// File upload configuration
const s3 = new AWS.S3({
  endpoint: "https://21c77404eff9f0e825c0916e721539ec.r2.cloudflarestorage.com",
  accessKeyId: "700012e5a1902575049c712b861aa2b0",
  secretAccessKey:
    "c0e0c131c622af83e8eb7ea6b826540c1e0da334f6227bfa5088e1a6f58a0219",
  signatureVersion: "v4",
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Upload Route
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;

    const uploadId = crypto.randomBytes(16).toString("hex");
    const fileKey = `images/${Date.now()}-${file.originalname}`;

    const params = {
      Bucket: "alm-images",
      Key: fileKey,
      Body: file.buffer,
      ContentType: file.mimetype,
      CacheControl: "public, max-age=31536000, immutable"
    };

    const result = await s3.upload(params).promise();
    res.json({ url: result.Location });
  } catch (error) {
    console.error("Error uploading:", error);
    res.status(500).json({ error: "Upload failed" });
  }
});

// Export the handler function
module.exports = (req, res) => {
  app(req, res); // Vercel expects a function that handles the request directly
};

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
