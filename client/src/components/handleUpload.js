import axios from "axios";

const handleUpload = async (
  selectedFile,
  setUploading,
  setFileDetails,
  setDescription
) => {
  if (!selectedFile) return;

  setUploading(true);

  const formData = new FormData();
  formData.append("file", selectedFile);

  try {
    // Make the request to upload the PDF
    const response = await axios.post(
      "http://localhost:3000/api/upload", // Adjust the endpoint as needed
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log(response);

    // Assuming the response contains details about the uploaded PDF
    setFileDetails({
      file_name: response.data.fileName,
      file_size: response.data.fileSize,
      file_location: response.data.fileLocation,
      file_mimetype: response.data.fileMimetype,
    });

    // Set description or analysis response for the PDF
    setDescription(response.data.openAIResponse || "No description available.");
  } catch (error) {
    console.error("Failed to upload file:", error);
  } finally {
    setUploading(false);
  }
};

export default handleUpload;
