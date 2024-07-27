# Import necessary libraries
import os
from flask import Flask, request, render_template
from werkzeug.utils import secure_filename
import numpy as np
import tensorflow as tf
from tensorflow.keras.applications.resnet50 import preprocess_input, ResNet50
from tensorflow.keras.preprocessing import image

# Create a Flask web application
app = Flask(__name__)

# Define the path to the pre-trained model
MODEL_PATH = './model/Transfer Learning Resnet 50.ipynb'

# Load the pre-trained model
model = ResNet50(weights=MODEL_PATH)

# Define a function to make predictions on images

def predict(image_path):
    # Load the image
    image = image.load_img(image_path, target_size=(224, 224))
    # Resize the image to the expected size
    image = image.resize((224, 224))
    # Preprocess the image
    image = preprocess_input(np.array(image))
    # Expand the dimensions of the image to match the expected input shape of the model
    image = np.expand_dims(image, axis=0)
    # Make predictions using the model
    predictions = model.predict(image)
    # Return the predicted class
    return np.argmax(predictions)

# Define a route for the home page

@app.route('/', methods=['GET'])
def index():
    # Render the index.html template
    return render_template('index.html')

# Define a route for the prediction page

@app.route('/predict', methods=['GET', 'POST'])
def predict_image():
    if request.method == 'POST':
        # Get the uploaded file from the request
        uploaded_file = request.files['file']
        # Define the path where the uploaded file will be saved
        basepath = os.path.dirname(__file__)
        file_path = os.path.join(basepath, 'uploads', secure_filename(uploaded_file.filename))
        # Save the uploaded file to the specified path
        uploaded_file.save(file_path)
        # Make a prediction using the uploaded image
        prediction = predict(file_path)
        # Return the predicted class
        return prediction

# Run the application

if __name__ == '__main__':
    app.run(port=5001, debug=True)
