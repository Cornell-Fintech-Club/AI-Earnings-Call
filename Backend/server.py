from flask import Flask, request, jsonify
from flask_cors import CORS
import io
import speech_recognition as sr
from pydub import AudioSegment

app = Flask(__name__)
CORS(app, resources={r"/transcribe": {"origins": "*"}})

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

@app.route('/transcribe', methods=['POST'])
def transcribe_route():
    try:
        print("Request received")

        # Assuming the frontend sends the file as 'audio'
        audio_file = request.files['audio']
        transcription_result = transcribe_audio(audio_file)
        print(transcription_result)

        response = jsonify({'transcription': transcription_result})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response
    except Exception as e:
        print(f"Error: {str(e)}")
        response = jsonify({'error': str(e)})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response

if __name__ == "__main__":
    app.run(debug=True)
