import {
  GoogleGenAI,
  Modality,
  Session,
  LiveServerMessage,
} from "@google/genai";

 class GeminiLive {
  private ai: GoogleGenAI;
  private session: Session | null = null;

  constructor() {
    this.ai = new GoogleGenAI({
      apiKey:process.env.GEMINI_API_KEY,
    });
  }

  async connect({
    onText,
    onAudio,
    onOpen,
    onClose,
    onError,
  }: {
    onText?: (text: string) => void;
    onAudio?: (audio: ArrayBuffer) => void;
    onOpen?: () => void;
    onClose?: () => void;
    onError?: (error: unknown) => void;
  }) {
    this.session = await this.ai.live.connect({
      model: "gemini-2.5-flash-live",
      config: {
        responseModalities: [Modality.AUDIO],
      },
      callbacks: {
        onopen: () => {
          console.log("Gemini Connected");
          onOpen?.();
        },

        onclose: () => {
          console.log("Gemini Closed");
          onClose?.();
        },

        onerror: (error) => {
          console.error(error);
          onError?.(error);
        },

        onmessage: (message: LiveServerMessage) => {
          // Text
          if (message.text) {
            onText?.(message.text);
          }

          // Audio
          const inlineData =
            message.serverContent?.modelTurn?.parts?.find(
              (part) => part.inlineData
            )?.inlineData;

          if (inlineData?.data) {
            const bytes = Uint8Array.from(
              atob(inlineData.data),
              (c) => c.charCodeAt(0)
            );

            onAudio?.(bytes.buffer);
          }
        },
      },
    });
  }

  sendPCM(pcm: Int16Array) {
    if (!this.session) return;

    const bytes = new Uint8Array(pcm.buffer);

    let binary = "";
    bytes.forEach((b) => {
      binary += String.fromCharCode(b);
    });

    this.session.sendRealtimeInput({
      audio: {
        data: btoa(binary),
        mimeType: "audio/pcm;rate=16000",
      },
    });
  }

  disconnect() {
    this.session?.close();
    this.session = null;
  }
}

export const gemini=new GeminiLive()