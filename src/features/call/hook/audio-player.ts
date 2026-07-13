 class AudioPlayer {
  private audioContext: AudioContext;

  constructor() {
    this.audioContext = new AudioContext({
      sampleRate: 16000,
    });
  }

  async playPCM(pcm: Int16Array) {
    if (this.audioContext.state === "suspended") {
      await this.audioContext.resume();
    }

    const audioBuffer = this.audioContext.createBuffer(
      1,
      pcm.length,
      16000
    );

    const channelData = audioBuffer.getChannelData(0);

    for (let i = 0; i < pcm.length; i++) {
      channelData[i] = pcm[i] / 32768;
    }

    const source = this.audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(this.audioContext.destination);
    source.start();
  }

  async close() {
    await this.audioContext.close();
  }
}

export const audioPlayer=new AudioPlayer()