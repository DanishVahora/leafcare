from fastapi import FastAPI, File, UploadFile
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing import image as keras_image
import uvicorn
import os
import tempfile
from huggingface_hub import hf_hub_download

app = FastAPI()

# Load the model from Hugging Face Hub
def load_model_from_hub():
    # Download the model file from Hugging Face
    model_path = hf_hub_download(
        repo_id="niharrakholiya/plant-disease-detection",
        filename="trained_model.keras",
        repo_type="model"
    )
    
    # Load the downloaded model
    model = tf.keras.models.load_model(model_path, compile=False)
    
    # Compile the model
    model.compile(
        optimizer=tf.keras.optimizers.RMSprop(),
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    
    return model

# Load the model when the app starts
model = load_model_from_hub()

# Define class names
class_names = [
    'Apple___Apple_scab', 'Apple___Black_rot', 'Apple___Cedar_apple_rust', 'Apple___healthy',
    'Blueberry___healthy', 'Cherry_(including_sour)___Powdery_mildew', 'Cherry_(including_sour)___healthy',
    'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot', 'Corn_(maize)___Common_rust_',
    'Corn_(maize)___Northern_Leaf_Blight', 'Corn_(maize)___healthy', 'Grape___Black_rot',
    'Grape___Esca_(Black_Measles)', 'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)', 'Grape___healthy',
    'Orange___Haunglongbing_(Citrus_greening)', 'Peach___Bacterial_spot', 'Peach___healthy',
    'Pepper,_bell___Bacterial_spot', 'Pepper,_bell___healthy', 'Potato___Early_blight',
    'Potato___Late_blight', 'Potato___healthy', 'Raspberry___healthy', 'Soybean___healthy',
    'Squash___Powdery_mildew', 'Strawberry___Leaf_scorch', 'Strawberry___healthy', 
    'Tomato___Bacterial_spot', 'Tomato___Early_blight', 'Tomato___Late_blight', 'Tomato___Leaf_Mold',
    'Tomato___Septoria_leaf_spot', 'Tomato___Spider_mites Two-spotted_spider_mite', 
    'Tomato___Target_Spot', 'Tomato___Tomato_Yellow_Leaf_Curl_Virus', 'Tomato___Tomato_mosaic_virus', 'Tomato___healthy'
]


# Image size (Must match the training image size)
IMG_SIZE = (128, 128)

@app.post("/predict/")
async def predict(file: UploadFile = File(...)):
    try:
        # Create a temporary file to save the uploaded image
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp_file:
            # Read the uploaded file and write to temp file
            contents = await file.read()
            temp_file.write(contents)
            temp_file_path = temp_file.name
        
        # Using keras preprocessing without normalization
        img = keras_image.load_img(temp_file_path, target_size=IMG_SIZE)
        img_array = keras_image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)
        
        # Make prediction
        predictions = model.predict(img_array)
        
        # Get the class with the highest probability
        result_index = np.argmax(predictions)
        confidence = float(predictions[0][result_index])
        model_prediction = class_names[result_index]
        
        # Get top 3 predictions for additional context
        top_indices = np.argsort(predictions[0])[-3:][::-1]
        top_predictions = [
            {"class": class_names[i], 
             "confidence": float(predictions[0][i])}
            for i in top_indices
        ]
        
        # Clean up the temp file
        os.unlink(temp_file_path)
        
        return {
            "prediction": model_prediction,
            "confidence": confidence,
            "class_index": int(result_index),
            "top_3_predictions": top_predictions
        }
    
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        return {"error": str(e)}

@app.get("/")
def home():
    return {"message": "Plant Disease Classification Model is Running!"}

# Run FastAPI app
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)