from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from ultralytics import YOLO
import os
import cv2
import numpy as np
import base64
import atexit
import shutil
from utils.ppe_detection import analyze_ppe  # Your PPE logic

# ------------------ Config ------------------
app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Load YOLO model
model = YOLO("models/best.pt")

# ------------------ Serve uploaded files ------------------
@app.route("/uploads/<path:filename>")
def serve_file(filename):
    """Serve annotated images directly from uploads directory."""
    return send_from_directory(UPLOAD_FOLDER, filename)

# ------------------ /upload ------------------
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

    # Annotated image
    annotated_frame = result.plot()
    annotated_path = os.path.join(UPLOAD_FOLDER, f"annotated_{file.filename}")
    cv2.imwrite(annotated_path, annotated_frame)

    # Build URL for frontend
    image_url = f"{request.host_url}uploads/annotated_{file.filename}"

    return jsonify({
        "detectedItems": detected_items,
        "missingItems": missing_items,
        "imageUrl": image_url
    })

# ------------------ /webcam ------------------
@app.route("/webcam", methods=["POST"])
def process_webcam():
    try:
        data = request.get_json()
        frame_data = data.get("frame")
        environment = data.get("environment", "construction")

        if not frame_data:
            return jsonify({"error": "No frame provided"}), 400

        # Decode Base64 frame
        header, encoded = frame_data.split(",", 1)
        img_bytes = base64.b64decode(encoded)
        nparr = np.frombuffer(img_bytes, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        # Resize frame for speed (optional)
        frame = cv2.resize(frame, (640, 480))

        # Run YOLO
        results = model.predict(frame, conf=0.4, verbose=False)
        result = results[0]

        # Extract detected items
        detected_items = list({model.names[int(cls)] for cls in result.boxes.cls.tolist()})
        missing_items = analyze_ppe(environment, detected_items)

        # Annotate frame
        annotated_frame = result.plot()
        _, buffer = cv2.imencode(".jpg", annotated_frame)
        annotated_base64 = "data:image/jpeg;base64," + base64.b64encode(buffer).decode()

        return jsonify({
            "annotatedFrame": annotated_base64,
            "detectedItems": detected_items,
            "missingItems": missing_items
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ------------------ Cleanup on Exit ------------------
def cleanup_uploads():
    """Delete everything inside uploads/ folder when Flask exits."""
    if os.path.exists(UPLOAD_FOLDER):
        try:
            shutil.rmtree(UPLOAD_FOLDER)
            print("🧹 Cleaned up uploads folder on exit.")
        except Exception as e:
            print(f"⚠️ Error cleaning uploads folder: {e}")

atexit.register(cleanup_uploads)


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
