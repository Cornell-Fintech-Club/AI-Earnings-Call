from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity

import io
import speech_recognition as sr
from pydub import AudioSegment

app = Flask(__name__)
CORS(app, resources={r"/transcribe": {"origins": "*"}})
app.config['MONGO_URI'] = "mongodb+srv://junc040105:ai_earnings@cft.3j0i9mo.mongodb.net/transcriptions?retryWrites=true&w=majority&appName=CFT"
app.config['SECRET_KEY'] = 'your_secret_key'
app.config['JWT_SECRET_KEY'] = 'your_jwt_secret_key'  # Change this to a secure random string
bcrypt = Bcrypt(app)
mongo = PyMongo(app)
login_manager = LoginManager(app)
jwt = JWTManager(app)

class User(UserMixin):
    def __init__(self, user_id):
        self.id = user_id

@login_manager.user_loader
def load_user(user_id):
    return User(user_id)

@app.route('/login', methods=['POST'])
def login():
    try:
        username = request.json['username']
        password = request.json['password']
        user_data = mongo.db.users.find_one({'username': username})

        if user_data and bcrypt.check_password_hash(user_data['password'], password):
            user_obj = User(str(user_data['_id']))
            login_user(user_obj)

            # Generate an access token
            access_token = create_access_token(identity=str(user_data['_id']))
            
            return jsonify({'message': 'Login successful', 'access_token': access_token}), 200
        else:
            return jsonify({'message': 'Invalid username or password'}), 401

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/logout')
@jwt_required()
def logout():
    logout_user()
    return jsonify({'message': 'Logout successful'}), 200

@app.route('/register', methods=['POST'])
def register():
    try:
        username = request.json['username']
        password = request.json['password']
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

        if not mongo.db.users.find_one({'username': username}):
            user_id = str(mongo.db.users.insert_one({'username': username, 'password': hashed_password}).inserted_id)
            user_obj = User(user_id)
            login_user(user_obj)

            # Generate an access token
            access_token = create_access_token(identity=user_id)

            return jsonify({'message': 'Registration successful', 'access_token': access_token}), 201
        else:
            return jsonify({'message': 'Username already exists'}), 400

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/transcribe', methods=['POST'])
@jwt_required()
def transcribe_route():
    try:
        print("Request received")

        audio_file = request.files['audio']
        transcription_result = transcribe_audio(audio_file)
        print(transcription_result)
        print(mongo)
        print(mongo.db.list_collection_names())
        mongo.db.transcriptions.insert_one({'transcription': transcription_result})

        response = jsonify({'transcription': transcription_result})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
    except Exception as e:
        print(f"Error: {str(e)}")
        response = jsonify({'error': str(e)})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response

def transcribe_audio(audio_file):
    r = sr.Recognizer()

    audio = AudioSegment.from_mp3(audio_file)

    with io.BytesIO() as wav_data:
        audio.export(wav_data, format="wav")
        wav_data.seek(0)
        with sr.AudioFile(wav_data) as source:
            audio_data = r.record(source)
            try:
                text = r.recognize_google(audio_data)
                return text
            except sr.UnknownValueError:
                return "AIEC could not understand the audio."
            except sr.RequestError as e:
                return f"Could not request results from Google Speech Recognition service; {e}"

if __name__ == "__main__":
    app.run(debug=True)
