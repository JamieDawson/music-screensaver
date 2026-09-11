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

function createSynth(name: SynthName): Instrument {
  switch (name) {
    case "synth":
      return new Tone.Synth().toDestination();
    case "mono":
      return new Tone.MonoSynth().toDestination();
    case "fm":
      return new Tone.FMSynth().toDestination();
    case "am":
      return new Tone.AMSynth().toDestination();
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
