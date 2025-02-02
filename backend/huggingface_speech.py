import sys
import torch
import torchaudio
from transformers import Wav2Vec2Processor, Wav2Vec2ForCTC

# Load Hugging Face model (French speech recognition)
processor = Wav2Vec2Processor.from_pretrained("jonatasgrosman/wav2vec2-large-xlsr-53-french")
model = Wav2Vec2ForCTC.from_pretrained("jonatasgrosman/wav2vec2-large-xlsr-53-french")

# Get file path from command-line arguments
file_path = sys.argv[1]

# Load audio file
waveform, sample_rate = torchaudio.load(file_path)

# Resample if necessary (Hugging Face model expects 16kHz)
if sample_rate != 16000:
    waveform = torchaudio.transforms.Resample(orig_freq=sample_rate, new_freq=16000)(waveform)

# Process audio
input_values = processor(waveform.squeeze(), sampling_rate=16000, return_tensors="pt").input_values

# Get transcription
with torch.no_grad():
    logits = model(input_values).logits

# Decode to text
predicted_ids = torch.argmax(logits, dim=-1)
transcription = processor.batch_decode(predicted_ids)[0]

print(transcription)

