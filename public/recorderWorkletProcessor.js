class RecorderWorkletProcessor extends AudioWorkletProcessor {
    process(inputs, outputs, parameters) {
      const input = inputs[0]; // Get audio input
      if (input.length > 0) {
        const samples = input[0]; // Access the mono channel
        this.port.postMessage(samples);
      }
      return true;
    }
  }
  
  registerProcessor("recorder.worklet", RecorderWorkletProcessor);
  