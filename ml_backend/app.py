import torch
from transformers import AutoModelForImageClassification, AutoImageProcessor
from PIL import Image
import tempfile
import os
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (for development only)
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Model details
MODEL_NAME = "muhammad-atif-ali/fine_tuned_vit_plant_disease"

# Load model and processor
device = "cuda" if torch.cuda.is_available() else "cpu"
model = AutoModelForImageClassification.from_pretrained(MODEL_NAME).to(device)
processor = AutoImageProcessor.from_pretrained(MODEL_NAME)

def predict_image(image):
    """ Predicts the plant disease from a PIL image. """
    # Preprocess image
    inputs = processor(images=image, return_tensors="pt").to(device)

    # Run inference
    with torch.no_grad():
        outputs = model(**inputs)

    # Get predicted class
    predicted_label = outputs.logits.argmax(-1).item()
    class_labels = model.config.id2label  # Fetch class labels from config
    
    # Get the confidence scores
    probabilities = torch.nn.functional.softmax(outputs.logits, dim=-1)[0]
    confidence = probabilities[predicted_label].item()
    
    # Get top 3 predictions
    top_indices = torch.argsort(probabilities, descending=True)[:3].tolist()
    top_predictions = [
        {"class": class_labels[i], 
         "confidence": probabilities[i].item()}
        for i in top_indices
    ]
    
    return {
        "prediction": class_labels[predicted_label],
        "confidence": confidence,
        "class_index": predicted_label,
        "top_3_predictions": top_predictions
    }

@app.post("/predict/")
async def predict(file: UploadFile = File(...)):
    try:
        # Create a temporary file to save the uploaded image
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp_file:
            # Read the uploaded file and write to temp file
            contents = await file.read()
            temp_file.write(contents)
            temp_file_path = temp_file.name
        
        # Open the image using PIL
        image = Image.open(temp_file_path).convert("RGB")
        
        # Make prediction
        result = predict_image(image)
        
        # Clean up the temp file
        os.unlink(temp_file_path)
        
        return result
    
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        return {"error": str(e)}

@app.get("/")
def home():
    return {"message": "Plant Disease Classification Model with Hugging Face is Running!"}

# Run FastAPI app
if __name__ == "_main_":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)