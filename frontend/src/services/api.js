import axios from "axios";
import { API_BASE } from "../config";

// Upload image to backend and get annotated image URL
export const uploadImage = async (file, environment) => {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("environment", environment);

  try {
    const response = await axios.post(`${API_BASE}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data; // { detectedItems, missingItems, imageUrl }
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};
