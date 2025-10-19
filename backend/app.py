from flask import Flask, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO
import os
import cv2
import cloudinary
import cloudinary.uploader
from utils.ppe_detection import analyze_ppe  # your PPE logic

# ------------------ Config ------------------
app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Load YOLO model
model = YOLO("models/best.pt")

# Configure Cloudinary
cloudinary.config(
    cloud_name="dyxqyf7ix",
    api_key="215173552519325",
    api_secret="rUAVCg6cAQu8oGxMSYTre9BxDGs",
)

# ------------------ Routes ------------------
@app.route("/upload", methods=["POST"])
def upload_image():
    if "image" not in request.files:
        return jsonify({"error": "No image file"}), 400

    file = request.files["image"]
    environment = request.form.get("environment", "construction")

    # Save uploaded image temporarily
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    # Run YOLO detection
    results = model.predict(source=file_path, conf=0.4, verbose=False)
    result = results[0]

    # Extract detected items
    detected_items = list({model.names[int(cls)] for cls in result.boxes.cls.tolist()})

    # Compute missing PPE
    missing_items = analyze_ppe(environment, detected_items)

    # Save annotated image locally
    annotated_frame = result.plot()  # returns image with boxes drawn
    annotated_path = os.path.join(UPLOAD_FOLDER, f"annotated_{file.filename}")
    cv2.imwrite(annotated_path, annotated_frame)

    # Upload annotated image to Cloudinary
    cloud_response = cloudinary.uploader.upload(annotated_path, folder="ppe_detection")
    cloud_url = cloud_response.get("secure_url")

    # Delete local files
    os.remove(file_path)
    os.remove(annotated_path)

    # Return response
    return jsonify({
        "detectedItems": detected_items,
        "missingItems": missing_items,
        "imageUrl": cloud_url
    })


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
