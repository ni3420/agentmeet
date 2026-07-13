export async function startPCMCapture(
  stream: MediaStream,
  onPCM: (pcm: Int16Array) => void
) {
  const audioContext = new AudioContext();

  const workletCode = `
class PCMProcessor extends AudioWorkletProcessor {
  process(inputs) {
    const input = inputs[0];
    if (!input.length) return true;

    const samples = input[0];
    const pcm = new Int16Array(samples.length);

    for (let i = 0; i < samples.length; i++) {
      const s = Math.max(-1, Math.min(1, samples[i]));
      pcm[i] = s < 0 ? s * 32768 : s * 32767;
    }

    this.port.postMessage(pcm.buffer, [pcm.buffer]);

    return true;
  }
}

registerProcessor("pcm-processor", PCMProcessor);
`;

  const blob = new Blob([workletCode], {
    type: "application/javascript",
  });

  const url = URL.createObjectURL(blob);

  await audioContext.audioWorklet.addModule(url);

  URL.revokeObjectURL(url);

  const source = audioContext.createMediaStreamSource(stream);

  const node = new AudioWorkletNode(audioContext, "pcm-processor");

  source.connect(node);

  node.port.onmessage = (event: MessageEvent<ArrayBuffer>) => {
    onPCM(new Int16Array(event.data));
  };

  return {
    stop: async () => {
      source.disconnect();
      node.disconnect();
      await audioContext.close();
    },
  };
}