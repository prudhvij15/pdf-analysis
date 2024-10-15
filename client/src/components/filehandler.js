import React, { useState } from "react";
import axios from "axios";
import { FaFileUpload, FaFilePdf, FaEye } from "react-icons/fa";
const FileUploadComponent = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [description, setDescription] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setPreviewData(fileURL);
    }
  };

  const handleUploadClick = async () => {
    if (!selectedFile) {
      alert("Please select a PDF file first.");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setDescription(
        response.data.openAIResponse || "No description available."
      );
    } catch (error) {
      console.error("Error uploading the file:", error);
      alert("Error uploading the file. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">PDF Upload and Analysis Tool</h1>
      <p className="mb-6 text-white">
        This web application allows users to upload PDF files and receive
        instant analysis through an integrated AI response system. This web
        application allows users to upload PDF files and receive instant
        analysis through an integrated AI response system. The tool features a
        user-friendly interface for selecting and previewing PDF documents,
        providing a seamless experience for uploading and viewing content. After
        the upload, the application processes the PDF and displays relevant
        insights, making it a valuable resource for users seeking quick
        summaries or analyses of their documents.
      </p>

      <div className="flex">
        {/* Left side: Upload and Preview */}
        <div className="w-2/3 pr-4">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">
              <FaFileUpload className="inline mr-2 text-blue-500" />
              Upload PDF
            </h2>
            <div className="flex items-center mb-4">
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="mr-2 border rounded p-2 focus:outline-none focus:ring focus:ring-blue-300"
              />
              <button
                onClick={handleUploadClick}
                disabled={!selectedFile || uploading}
                className={`px-4 py-2 rounded ${
                  uploading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
                } text-white disabled:cursor-not-allowed`}
              >
                {" "}
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>

          <div className="bg-gray-300 h-96 overflow-auto rounded-md shadow-md">
            <h2 className="text-xl font-semibold mb-2 p-2">
              {" "}
              <FaEye className="inline mr-2 text-green-500" />
              PDF Preview
            </h2>
            {previewData ? (
              <iframe
                src={previewData}
                title="PDF Preview"
                className="w-full h-full"
                style={{ border: "none" }}
              ></iframe>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">No preview available.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right side: Description */}
        {/* <div className="w-2/3 pl-3">
          {description && (
            <div>
              <h2 className="text-2xl  font-bold mt-16">PDF Analysis</h2>
              <div className=" p-4 rounded-md  bg-green-100 shadow-md h-96 overflow-auto flex flex-col justify-start">
                <p className="whitespace-pre-line text-gray-700 leading-relaxed">
                  {description}
                </p>
              </div>
            </div>
          )}
        </div>
        
        
        */}

        {description && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-green-600">
              PDF Analysis
            </h2>
            <div className="mt-4  p-4 bg-slate-500  h-96 overflow-auto rounded-lg shadow-lg">
              <p className="whitespace-pre-line text-black font-serif leading-relaxed">
                {description}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploadComponent;
