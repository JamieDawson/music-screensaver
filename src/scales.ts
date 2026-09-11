// Pitch-class numbers for octave wrapping. Names match Tone.js note spellings.
export const PITCH: Record<string, number> = {
  C: 0,
  "C#": 1,
  Db: 1,
  D: 2,
  "D#": 3,
  Eb: 3,
  E: 4,
  "E#": 5,
  F: 5,
  "F#": 6,
  Gb: 6,
  G: 7,
  "G#": 8,
  Ab: 8,
  A: 9,
  "A#": 10,
  Bb: 10,
  B: 11,
};

export type Scale = {
  id: string;
  label: string;
  notes: readonly string[];
};

export type ScaleGroup = {
  label: string;
  scales: readonly Scale[];
};

export const scaleGroups: readonly ScaleGroup[] = [
  {
    label: "Major",
    scales: [
      { id: "c-major", label: "C Major", notes: ["C", "D", "E", "F", "G", "A", "B", "C"] },
      { id: "g-major", label: "G Major", notes: ["G", "A", "B", "C", "D", "E", "F#", "G"] },
      { id: "d-major", label: "D Major", notes: ["D", "E", "F#", "G", "A", "B", "C#", "D"] },
      { id: "a-major", label: "A Major", notes: ["A", "B", "C#", "D", "E", "F#", "G#", "A"] },
      { id: "e-major", label: "E Major", notes: ["E", "F#", "G#", "A", "B", "C#", "D#", "E"] },
      { id: "b-major", label: "B Major", notes: ["B", "C#", "D#", "E", "F#", "G#", "A#", "B"] },
      { id: "fs-major", label: "F# Major", notes: ["F#", "G#", "A#", "B", "C#", "D#", "E#", "F#"] },
      { id: "f-major", label: "F Major", notes: ["F", "G", "A", "Bb", "C", "D", "E", "F"] },
      { id: "bb-major", label: "Bb Major", notes: ["Bb", "C", "D", "Eb", "F", "G", "A", "Bb"] },
      { id: "eb-major", label: "Eb Major", notes: ["Eb", "F", "G", "Ab", "Bb", "C", "D", "Eb"] },
      { id: "ab-major", label: "Ab Major", notes: ["Ab", "Bb", "C", "Db", "Eb", "F", "G", "Ab"] },
      { id: "db-major", label: "Db Major", notes: ["Db", "Eb", "F", "Gb", "Ab", "Bb", "C", "Db"] },
    ],
  },
  {
    label: "Minor",
    scales: [
      { id: "a-minor", label: "A Minor", notes: ["A", "B", "C", "D", "E", "F", "G", "A"] },
      { id: "e-minor", label: "E Minor", notes: ["E", "F#", "G", "A", "B", "C", "D", "E"] },
      { id: "b-minor", label: "B Minor", notes: ["B", "C#", "D", "E", "F#", "G", "A", "B"] },
      { id: "fs-minor", label: "F# Minor", notes: ["F#", "G#", "A", "B", "C#", "D", "E", "F#"] },
      { id: "cs-minor", label: "C# Minor", notes: ["C#", "D#", "E", "F#", "G#", "A", "B", "C#"] },
      { id: "gs-minor", label: "G# Minor", notes: ["G#", "A#", "B", "C#", "D#", "E", "F#", "G#"] },
      { id: "d-minor", label: "D Minor", notes: ["D", "E", "F", "G", "A", "Bb", "C", "D"] },
      { id: "g-minor", label: "G Minor", notes: ["G", "A", "Bb", "C", "D", "Eb", "F", "G"] },
      { id: "c-minor", label: "C Minor", notes: ["C", "D", "Eb", "F", "G", "Ab", "Bb", "C"] },
      { id: "f-minor", label: "F Minor", notes: ["F", "G", "Ab", "Bb", "C", "Db", "Eb", "F"] },
      { id: "bb-minor", label: "Bb Minor", notes: ["Bb", "C", "Db", "Eb", "F", "Gb", "Ab", "Bb"] },
    ],
  },
  {
    label: "Pentatonic",
    scales: [
      { id: "c-major-pent", label: "C Major Pentatonic", notes: ["C", "D", "E", "G", "A", "C"] },
      { id: "g-major-pent", label: "G Major Pentatonic", notes: ["G", "A", "B", "D", "E", "G"] },
      { id: "d-major-pent", label: "D Major Pentatonic", notes: ["D", "E", "F#", "A", "B", "D"] },
      { id: "a-minor-pent", label: "A Minor Pentatonic", notes: ["A", "C", "D", "E", "G", "A"] },
      { id: "e-minor-pent", label: "E Minor Pentatonic", notes: ["E", "G", "A", "B", "D", "E"] },
      { id: "d-minor-pent", label: "D Minor Pentatonic", notes: ["D", "F", "G", "A", "C", "D"] },
    ],
  },
  {
    label: "Blues",
    scales: [
      { id: "c-blues", label: "C Blues", notes: ["C", "Eb", "F", "F#", "G", "Bb", "C"] },
      { id: "g-blues", label: "G Blues", notes: ["G", "Bb", "C", "C#", "D", "F", "G"] },
      { id: "a-blues", label: "A Blues", notes: ["A", "C", "D", "D#", "E", "G", "A"] },
      { id: "e-blues", label: "E Blues", notes: ["E", "G", "A", "A#", "B", "D", "E"] },
    ],
  },
  {
    label: "Modes",
    scales: [
      { id: "c-dorian", label: "C Dorian", notes: ["C", "D", "Eb", "F", "G", "A", "Bb", "C"] },
      { id: "d-dorian", label: "D Dorian", notes: ["D", "E", "F", "G", "A", "B", "C", "D"] },
      { id: "e-phrygian", label: "E Phrygian", notes: ["E", "F", "G", "A", "B", "C", "D", "E"] },
      { id: "f-lydian", label: "F Lydian", notes: ["F", "G", "A", "B", "C", "D", "E", "F"] },
      { id: "g-mixolydian", label: "G Mixolydian", notes: ["G", "A", "B", "C", "D", "E", "F", "G"] },
      { id: "d-mixolydian", label: "D Mixolydian", notes: ["D", "E", "F#", "G", "A", "B", "C", "D"] },
      { id: "a-aeolian", label: "A Aeolian", notes: ["A", "B", "C", "D", "E", "F", "G", "A"] },
    ],
  },
];

export const defaultScaleId = "c-major";

export function getScale(id: string): Scale {
  for (const group of scaleGroups) {
    const match = group.scales.find((scale) => scale.id === id);
    if (match) {
      return match;
    }
  }
  return scaleGroups[0].scales[0];
}

// C4, D4, ... B4, C5 — octave goes up when the scale wraps past B to C
export function withOctaves(notes: readonly string[], startOctave: number) {
  let octave = startOctave;
  let previousPitch = -1;

  return notes.map((note, index) => {
    const pitch = PITCH[note];
    if (pitch === undefined) {
      throw new Error(`Unknown note "${note}" — Tone.js cannot play this spelling`);
    }
    if (index > 0 && pitch <= previousPitch) {
      octave += 1;
    }
    previousPitch = pitch;
    return `${note}${octave}`;
  });
}
