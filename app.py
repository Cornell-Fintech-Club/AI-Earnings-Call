import streamlit as st
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
                return "Speech Recognition could not understand the audio."
            except sr.RequestError as e:
                return f"Could not request results from Google Speech Recognition service; {e}"



def main():
    st.title("Audio Transcription App")

    uploaded_file = st.file_uploader("Upload an MP3 file", type=["mp3"])

    if uploaded_file is not None:
        st.audio(uploaded_file, format="audio/mp3")

        if st.button("Transcribe"):
            transcribed_text = transcribe_audio(uploaded_file)
            st.subheader("Transcription:")
            st.write(transcribed_text)

if __name__ == "__main__":
    main()
