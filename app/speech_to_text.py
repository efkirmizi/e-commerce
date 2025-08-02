from fastapi import File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from google.cloud import speech
import os
from dotenv import load_dotenv


# Load .env
dotenv_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
load_dotenv(dotenv_path)

google_cred_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
if not google_cred_path:
    raise RuntimeError("GOOGLE_APPLICATION_CREDENTIALS is not set in .env")
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = google_cred_path


import subprocess
import tempfile

async def transcribe_audio(file: UploadFile = File(...)) -> str:
    contents = await file.read()

    # Write webm to temp file
    with tempfile.NamedTemporaryFile(suffix=".webm", delete=False) as webm_file:
        webm_file.write(contents)
        webm_file_path = webm_file.name

    # Convert webm to wav using ffmpeg
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as wav_file:
        wav_file_path = wav_file.name

    cmd = [
        "ffmpeg", 
        "-y",
        "-i", webm_file_path,
        "-ar", "16000",  # sample rate for Google Speech
        "-ac", "1",      # mono channel
        "-f", "wav",
        wav_file_path
    ]

    subprocess.run(cmd, check=True)

    # Read wav bytes
    with open(wav_file_path, "rb") as f:
        wav_bytes = f.read()

    # Clean up temp files (optional)
    os.remove(webm_file_path)
    os.remove(wav_file_path)

    client = speech.SpeechClient()
    audio = speech.RecognitionAudio(content=wav_bytes)

    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
        sample_rate_hertz=16000,
        language_code="tr-TR"
    )

    response = client.recognize(config=config, audio=audio)

    if not response.results:
        return ""

    transcript = " ".join([result.alternatives[0].transcript for result in response.results])
    return transcript
