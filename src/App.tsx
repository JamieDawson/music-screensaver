import { useEffect, useState } from "react";
import { DVDIcon } from "./components/DVDIcon";
import {
  LOGO_HEIGHT,
  LOGO_WIDTH,
  useDimensions,
  type Obstacle,
} from "./hooks/useDimensions";

const SPAWN_SIZE = 30;
const MIN_OCTAVE = 1;
const MAX_OCTAVE = 7;

const PITCH: Record<string, number> = {
  C: 0,
  "C#": 1,
  D: 2,
  "D#": 3,
  E: 4,
  F: 5,
  "F#": 6,
  G: 7,
  "G#": 8,
  A: 9,
  "A#": 10,
  B: 11,
};

const scales = {
  cmajor: ["C", "D", "E", "F", "G", "A", "B", "C"],
  aminor: ["A", "B", "C", "D", "E", "F", "G", "A"],
  gmajor: ["G", "A", "B", "C", "D", "E", "F#", "G"],
};

type ScaleName = keyof typeof scales;

// C4, D4, ... B4, C5 — octave goes up when the scale wraps past B to C
function withOctaves(notes: readonly string[], startOctave: number) {
  let octave = startOctave;
  let previousPitch = -1;

  return notes.map((note, index) => {
    const pitch = PITCH[note] ?? 0;
    if (index > 0 && pitch <= previousPitch) {
      octave += 1;
    }
    previousPitch = pitch;
    return `${note}${octave}`;
  });
}

function Spawn({ x, y, note }: Pick<Obstacle, "x" | "y" | "note">) {
  const spawnStyles: React.CSSProperties = {
    position: "absolute",
    left: x + "px",
    top: y + "px",
    transform: `translate(-50%, -50%)`,
    zIndex: 1,
  };

  return (
    <div className="note" style={spawnStyles}>
      {note}
    </div>
  );
}

function App() {
  const [spawns, setSpawns] = useState<Obstacle[]>([]);
  const { color, top, left } = useDimensions(spawns);

  const [selectedScale, setSelectedScale] = useState<ScaleName>("cmajor");
  const [octave, setOctave] = useState(4);
  const [selectedNote, setSelectedNote] = useState("C4");

  const scaleNotes = withOctaves(scales[selectedScale], octave);

  const clickHandler = (event: React.MouseEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - bounds.left - event.currentTarget.clientLeft;
    const y = event.clientY - bounds.top - event.currentTarget.clientTop;

    // Last matching block is on top if two overlap
    const hit = [...spawns].reverse().find((spawn) => {
      const halfW = spawn.width / 2;
      const halfH = spawn.height / 2;
      return (
        x >= spawn.x - halfW &&
        x <= spawn.x + halfW &&
        y >= spawn.y - halfH &&
        y <= spawn.y + halfH
      );
    });

    if (hit) {
      setSpawns((current) => current.filter((spawn) => spawn.id !== hit.id));
      return;
    }

    setSpawns([
      ...spawns,
      {
        id: Date.now() + spawns.length,
        x,
        y,
        width: SPAWN_SIZE,
        height: SPAWN_SIZE,
        note: selectedNote,
      },
    ]);
  };

  const updateNote = (clickedNote: string) => {
    setSelectedNote(clickedNote);
  };

  const changeScale = (scale: ScaleName) => {
    setSelectedScale(scale);
    setSelectedNote(withOctaves(scales[scale], octave)[0]);
  };

  const shiftOctave = (delta: number) => {
    const nextOctave = Math.min(MAX_OCTAVE, Math.max(MIN_OCTAVE, octave + delta));
    const noteIndex = Math.max(0, scaleNotes.indexOf(selectedNote));
    setOctave(nextOctave);
    setSelectedNote(withOctaves(scales[selectedScale], nextOctave)[noteIndex]);
  };

  useEffect(() => {
    console.log(spawns);
  }, [spawns]);

  return (
    <div className="container">
      <div className="title">Music screen saver</div>
      <select
        value={selectedScale}
        onChange={(event) => changeScale(event.target.value as ScaleName)}
      >
        <option value="cmajor">C Major</option>
        <option value="aminor">A Minor</option>
        <option value="gmajor">G Major</option>
      </select>
      <div className="octave-controls">
        <button
          type="button"
          onClick={() => shiftOctave(-1)}
          disabled={octave <= MIN_OCTAVE}
        >
          Octave down
        </button>
        <span>Starting octave: {octave}</span>
        <button
          type="button"
          onClick={() => shiftOctave(1)}
          disabled={octave >= MAX_OCTAVE}
        >
          Octave up
        </button>
      </div>
      <div>
        {scaleNotes.map((note) => (
          <button type="button" key={note} onClick={() => updateNote(note)}>
            {note}
          </button>
        ))}
      </div>
      <div>Current selected note: {selectedNote}</div>
      <div className="rectangle" onClick={clickHandler}>
        {spawns.map((spawn) => {
          return (
            <Spawn
              x={spawn.x}
              y={spawn.y}
              note={spawn.note}
              key={spawn.id}
            />
          );
        })}
        <DVDIcon
          width={`${LOGO_WIDTH}px`}
          height={`${LOGO_HEIGHT}px`}
          color={color}
          top={top}
          left={left}
        />
      </div>
    </div>
  );
}

export default App;
