import requests

# API endpoint URL
API_URL = "https://plant-diesase.kindmushroom-20b564e6.centralindia.azurecontainerapps.io/predict/"

def predict_plant_disease(image_path):
    """
    Send image to Azure-hosted model and get prediction results
    
    Args:
        image_path (str): Path to image file to analyze
        
    Returns:
        dict: Prediction results from API
    """
    try:
        # Open the image file in binary mode
        with open(image_path, 'rb') as file:
            files = {'file': (image_path, file, 'image/jpeg')}
            
            # Send POST request to API
            response = requests.post(API_URL, files=files)
            
            # Check for successful response
            if response.status_code == 200:
                return response.json()
            else:
                return {"error": f"API request failed with status code {response.status_code}"}
                
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    # Get image path from user
    image_path = input("Enter path to plant image: ").strip()
    
    # Get prediction
    result = predict_plant_disease(image_path)
    
    # Display results
    if 'error' in result:
        print(f"Error: {result['error']}")
    else:
        print("\nPrediction Results:")
        print(f"Main Prediction: {result['prediction']} (Confidence: {result['confidence']:.2%})")
        print("\nTop 3 Predictions:")
        for pred in result['top_3_predictions']:
            print(f"- {pred['class']}: {pred['confidence']:.2%}")