import { useEffect, useState } from "react";
import tvStencil from "./assets/tvstencil.webp";
import { playNote, startAudio } from "./audio";
import { DVDIcon } from "./components/DVDIcon";
import {
  LOGO_HEIGHT,
  LOGO_WIDTH,
  RECT_HEIGHT,
  RECT_WIDTH,
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
  const { color, top, left } = useDimensions(spawns, (obstacle) => {
    void playNote(obstacle.note);
  });

  const [selectedScale, setSelectedScale] = useState<ScaleName>("cmajor");
  const [octave, setOctave] = useState(4);
  const [selectedNote, setSelectedNote] = useState("C4");

  const scaleNotes = withOctaves(scales[selectedScale], octave);

  const clickHandler = (event: React.MouseEvent<HTMLDivElement>) => {
    void startAudio();
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * RECT_WIDTH;
    const y = ((event.clientY - bounds.top) / bounds.height) * RECT_HEIGHT;

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
    void startAudio();
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
      <div className="tv-set">
        <div className="tv">
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
          <img src={tvStencil} alt="" className="tv-frame" />
        </div>
        <div className="tv-panel">
          <div className="tv-control">
            <span className="tv-label">Input</span>
            <select
              className="tv-select"
              value={selectedScale}
              onChange={(event) =>
                changeScale(event.target.value as ScaleName)
              }
            >
              <option value="cmajor">C Major</option>
              <option value="aminor">A Minor</option>
              <option value="gmajor">G Major</option>
            </select>
          </div>
          <div className="tv-control">
            <span className="tv-label">Octave</span>
            <div className="tv-btn-row">
              <button
                type="button"
                className="tv-btn"
                onClick={() => shiftOctave(-1)}
                disabled={octave <= MIN_OCTAVE}
              >
                −
              </button>
              <span className="tv-readout">{octave}</span>
              <button
                type="button"
                className="tv-btn"
                onClick={() => shiftOctave(1)}
                disabled={octave >= MAX_OCTAVE}
              >
                +
              </button>
            </div>
          </div>
          <div className="tv-control tv-control-notes">
            <span className="tv-label">Channel</span>
            <div className="tv-btn-row">
              {scaleNotes.map((note) => (
                <button
                  type="button"
                  className={
                    note === selectedNote ? "tv-btn is-on" : "tv-btn"
                  }
                  key={note}
                  onClick={() => updateNote(note)}
                >
                  {note}
                </button>
              ))}
            </div>
          </div>
          <div className="tv-control">
            <span className="tv-label">On air</span>
            <div className="tv-status">
              <span className="tv-led" />
              <span className="tv-readout tv-readout-wide">
                {selectedNote}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
