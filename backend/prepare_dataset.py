from datasets import load_dataset
import torchaudio
import librosa
import os
import json
import torch


# Load the Québecois dataset from Hugging Face
print("📥 Downloading dataset...")
dataset = load_dataset("rishabbahal/quebecois_canadian_french_dataset", split="train")

# Create a folder to store processed audio
os.makedirs("quebecois_audio", exist_ok=True)

# Function to process each audio file
import os
import librosa
import torchaudio
import torch

# Ensure output directory exists
os.makedirs("quebecois_audio", exist_ok=True)

def process_audio(example):
    audio_path = example.get("audio_filepath")  # ✅ Use the correct field
    text = example.get("text")  # ✅ Ensure the correct transcription field

    if not audio_path:
        print("⚠️ Missing audio path in example:", example)
        return None  # Skip entry if it has no audio

    try:
        # Load and resample the audio to 16kHz
        audio_array, sample_rate = librosa.load(audio_path, sr=16000)

        # Define output path
        output_path = f"quebecois_audio/{example['__index_level_0__']}.wav"

        # Save as WAV format with 16kHz sample rate
        torchaudio.save(output_path, torch.tensor(audio_array).unsqueeze(0), 16000)

        return {
            "id": example["__index_level_0__"],  # Keep track of dataset ID
            "audio_path": output_path,
            "transcription": text
        }
    except Exception as e:
        print(f"❌ Error processing {audio_path}: {e}")
        return None  # Skip if there's an error

# Apply processing to all files
print("🎙 Processing audio files...")
processed_dataset = dataset.map(process_audio)

# Save metadata to a JSON file
data_list = [{"id": d["id"], "audio_path": d["audio_path"], "text": d["transcription"]} for d in processed_dataset]
with open("quebecois_dataset.json", "w") as f:
    json.dump(data_list, f, indent=4)

print("✅ Dataset processed & saved as `quebecois_dataset.json`")
