from flask import Flask, request, jsonify
from transcription import transcribe_audio

app = Flask(__name__)

def perform_transcription(audio_file):
    try:
        result = transcribe_audio(audio_file)
        return {'transcription': result}
    except Exception as e:
        return {'error': str(e)}

@app.route('/transcribe', methods=['POST'])
def transcribe():
    if request.method == 'POST':
        try:
            audio_file = request.files['audio_file']
            result = perform_transcription(audio_file)
            return jsonify(result)
        except Exception as e:
            return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)
