import * as Tone from "tone";

let synth: Tone.PolySynth | null = null;

function getSynth() {
  if (!synth) {
    synth = new Tone.PolySynth(Tone.MonoSynth).toDestination();
  }
  return synth;
}

// Browsers block sound until the user clicks something
export async function startAudio() {
  if (Tone.getContext().state !== "running") {
    await Tone.start();
  }
}

export async function playNote(note: string) {
  await startAudio();
  getSynth().triggerAttackRelease(note, "8n");
}
