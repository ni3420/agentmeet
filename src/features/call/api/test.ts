import { gemini } from "../hook/Gemini";

export async function POST() {
  await gemini.connect({
    onText: (text) => console.log(text),
  });

  return Response.json({ ok: true });
}