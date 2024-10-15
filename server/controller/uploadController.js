const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const OpenAI = require("openai");
const pdfParse = require("pdf-parse");

const client = new OpenAI({
  apiKey: "",
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const filename = uuidv4() + "-" + file.originalname;
    cb(null, filename);
  },
});

const upload = multer({ storage });

const uploadFileHandler = async (req, res) => {
  upload.single("file")(req, res, async (err) => {
    try {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: "Multer error", error: err });
      } else if (err) {
        return res.status(500).json({ message: "Error", error: err });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const isPDF = req.file.mimetype === "application/pdf";

      if (isPDF) {
        const openAIResponse = await processPDF(req.file.path);
        return res.status(200).json({
          message: "PDF uploaded successfully",
          openAIResponse: openAIResponse,
        });
      } else {
        return res
          .status(400)
          .json({ message: "Unsupported file type. Please upload a PDF." });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Failed to upload file", error: error.message });
    }
  });
};

const processPDF = async (pdfPath) => {
  try {
    const fileBuffer = fs.readFileSync(pdfPath);

    const data = await pdfParse(fileBuffer);
    const pdfText = data.text;

    const openAIResponse = await sendOpenAIRequestForPDF(pdfText);

    return openAIResponse;
  } catch (error) {
    throw new Error("Failed to process PDF: " + error.message);
  }
};

const sendOpenAIRequestForPDF = async (pdfText) => {
  try {
    const messages = [
      {
        role: "user",
        content: `Please analyze the following PDF content: ${pdfText}`,
      },
    ];

    const params = {
      model: "gpt-4-turbo",
      messages,
    };

    const response = await client.chat.completions.create(params);
    return response.choices[0].message.content;
  } catch (error) {
    throw new Error("Failed to send request to OpenAI API: " + error.message);
  }
};

module.exports = {
  uploadFileHandler,
};
