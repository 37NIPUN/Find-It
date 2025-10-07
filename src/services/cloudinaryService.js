// Upload image to Cloudinary
export const uploadImageToCloudinary = async (imageFile) => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const formData = new FormData();
  formData.append("file", imageFile);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", "findit-posts");

  console.log({ cloudName, uploadPreset });

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    const data = await response.json();
    return data.secure_url; // This is the image URL to store in Firestore
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};
