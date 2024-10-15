const handleFileChange = (
  event,
  setSelectedFile,
  setPreviewData,
  setDescription
) => {
  const file = event.target.files[0];
  if (file && file.type === "application/pdf") {
    setSelectedFile(file);
    setDescription(null);
    const fileUrl = URL.createObjectURL(file);
    setPreviewData(fileUrl); // Set the URL for PDF preview
  } else {
    alert("Please upload a valid PDF file.");
  }
};

export default handleFileChange;
