from pydub import AudioSegment
import io
import speech_recognition as sr


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
    print(transcribe_audio("backend/test/Tesla_Demo.mp3"))