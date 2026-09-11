import * as Tone from "tone";

export type SynthName = "synth" | "mono" | "fm" | "am";

export const synthOptions: { id: SynthName; label: string }[] = [
  { id: "synth", label: "Synth" },
  { id: "mono", label: "MonoSynth" },
  { id: "fm", label: "FMSynth" },
  { id: "am", label: "AMSynth" },
];

type Instrument = Tone.Synth | Tone.MonoSynth | Tone.FMSynth | Tone.AMSynth;

let currentName: SynthName = "synth";
let instrument: Instrument | null = null;
let delay: Tone.FeedbackDelay | null = null;
let delayWet = 0.2;

function getDelay() {
  if (!delay) {
    delay = new Tone.FeedbackDelay({
      delayTime: "8n",
      feedback: 0.35,
      wet: delayWet,
    }).toDestination();
  }
  return delay;
}

function createSynth(name: SynthName): Instrument {
  const fx = getDelay();
  switch (name) {
    case "synth":
      return new Tone.Synth().connect(fx);
    case "mono":
      return new Tone.MonoSynth().connect(fx);
    case "fm":
      return new Tone.FMSynth().connect(fx);
    case "am":
      return new Tone.AMSynth().connect(fx);
  }
}

function getSynth() {
  if (!instrument) {
    instrument = createSynth(currentName);
  }
  return instrument;
}

export function setSynth(name: SynthName) {
  if (name === currentName && instrument) {
    return;
  }
  instrument?.dispose();
  instrument = null;
  currentName = name;
}

export function setDelayAmount(amount: number) {
  delayWet = Math.min(1, Math.max(0, amount));
  getDelay().wet.value = delayWet;
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
