from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_pymongo import PyMongo
from flask_bcrypt import Bcrypt
from flask_login import LoginManager, UserMixin, login_user, logout_user
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from bson import ObjectId
import openai
import io
import speech_recognition as sr
from pydub import AudioSegment
import yfinance as yf
from nltk.sentiment.vader import SentimentIntensityAnalyzer


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
app.config['MONGO_URI'] = "mongodb+srv://junc040105:ai_earnings@cft.3j0i9mo.mongodb.net/transcriptions?retryWrites=true&w=majority&appName=CFT"
app.config['SECRET_KEY'] = 'CFT'
bcrypt = Bcrypt(app)
mongo = PyMongo(app)
login_manager = LoginManager(app)
openai.api_key = "fake key"

class User(UserMixin):
    def __init__(self, user_id):
        self.id = user_id

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.route('/login', methods=['POST'])
def login():
    try:
        username = request.json['username']
        password = request.json['password']
        user_data = mongo.db.users.find_one({'username': username})

        if user_data and bcrypt.check_password_hash(user_data['password'], password):
            user_obj = User(str(user_data['_id']))
            login_user(user_obj)

            return jsonify({'message': 'Login successful', 'username': username}), 200
        else:
            return jsonify({'message': 'Invalid username or password'}), 401

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/logout')
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

            access_token = create_access_token(identity=user_id)

            return jsonify({'message': 'Registration successful', 'access_token': access_token}), 201
        else:
            return jsonify({'message': 'Username already exists'}), 400

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/transcribe', methods=['POST'])
def transcribe_route():
    try:
        audio_file = request.files['audio']
        transcription_result = transcribe_audio(audio_file)

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

@app.route('/company-info/<symbol>', methods=['GET'])
def get_company_info(symbol):
    try:
        stock = yf.Ticker(symbol)
        company_info = stock.info
        history = stock.history(period='1d')

        if not company_info:
            return jsonify({'error': 'Invalid symbol or API key'}), 400

        result = {
            'symbol': company_info.get('symbol', ''),
            'name': company_info.get('longName', ''),
            'industry': company_info.get('industry', ''),
            'sector': company_info.get('sector', ''),
            'curr_price': company_info.get('regularMarketPrice', 0.0),
            'prev_price': company_info.get('regularMarketPreviousClose', 0.0),
            'change': company_info.get('regularMarketChange', 0.0),
            'change_percent': company_info.get('regularMarketChangePercent', 0.0),
            'high': history['High'].max(),
            'low': history['Low'].min(),
        }
        return jsonify(result), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/store', methods=['POST'])
def store_transcription():
    try:
        data = request.json
        transcription = data.get('transcription')
        user = data.get('username')
        company = data.get('symbol')

        if not transcription:
            return jsonify({'error': 'Missing transcription or symbol'}), 400

        result = mongo.db.transcriptions.insert_one({
            'user': user, 'company': company, 'transcription': transcription,
        })

        if result.inserted_id:
            return jsonify({'message': 'Transcription stored successfully'}), 200
        else:
            return jsonify({'error': 'Failed to store transcription'}), 500

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/get_transcripts', methods=['GET'])
def get_transcripts():
    try:
        username = request.args.get('username')

        if not username:
            return jsonify({'error': 'Missing username parameter'}), 400

        transcriptions = mongo.db.transcriptions.find({'user': username}, {'_id': 0})

        transcript_list = list(transcriptions)

        return jsonify({'transcriptions': transcript_list}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/company-boxes', methods=['GET'])
def get_company_boxes():
    try:
        company_boxes = list(mongo.db.transcriptions.find({}, {'_id': 0}))

        return jsonify({'company_boxes': company_boxes}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/summarize', methods=['POST'])
def summarize_route():
    try:
        data = request.json
        transcription = data.get('transcription')
        symbol = data.get('symbol')
        print(symbol)

        if not transcription:
            return jsonify({'error': 'Missing transcription'}), 400
        

         # Initialize the Sentiment Intensity Analyzer
        sid = SentimentIntensityAnalyzer()
        sentiment_scores = sid.polarity_scores(transcription)
        sentiment_summary = "The sentiment of the call is "
        if sentiment_scores['compound'] >= 0.05:
            sentiment_summary += "positive."
        elif sentiment_scores['compound'] <= -0.05:
            sentiment_summary += "negative."
        else:
            sentiment_summary += "neutral."


        conversation = [
            {"role": "system", "content": "You are an AI assistant analyzing an earnings call."},
            {"role": "user", "content": f"Summarize the following excerpt from an earnings call in the context of the company with stock ticker: {symbol}\n\n{transcription}"},
        ]

        response = openai.ChatCompletion.create(
            model="gpt-4-turbo-preview",
            messages=conversation,
            temperature=0.7,
            max_tokens=150
        )

        assistant_reply = response['choices'][0]['message']['content']
        bullet_points = [point.strip() for point in assistant_reply.split('.') if point.strip()]
        return jsonify({'summary': assistant_reply}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
