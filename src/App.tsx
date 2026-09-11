import { useEffect, useState } from "react";
import tvStencil from "./assets/tvstencil.webp";
import { playNote, setSynth, startAudio, synthOptions, type SynthName } from "./audio";
import { DVDIcon } from "./components/DVDIcon";
import {
  LOGO_HEIGHT,
  LOGO_WIDTH,
  RECT_HEIGHT,
  RECT_WIDTH,
  useDimensions,
  type Obstacle,
} from "./hooks/useDimensions";
import { defaultScaleId, getScale, scaleGroups, withOctaves } from "./scales";

const SPAWN_SIZE = 30;
const MIN_OCTAVE = 1;
const MAX_OCTAVE = 7;

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

  const [selectedScale, setSelectedScale] = useState(defaultScaleId);
  const [selectedSynth, setSelectedSynth] = useState<SynthName>("synth");
  const [octave, setOctave] = useState(4);
  const [selectedNote, setSelectedNote] = useState("C4");

  const scaleNotes = withOctaves(getScale(selectedScale).notes, octave);

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

  const changeScale = (scaleId: string) => {
    setSelectedScale(scaleId);
    setSelectedNote(withOctaves(getScale(scaleId).notes, octave)[0]);
  };

  const changeSynth = (name: SynthName) => {
    void startAudio();
    setSelectedSynth(name);
    setSynth(name);
  };

  const shiftOctave = (delta: number) => {
    const nextOctave = Math.min(
      MAX_OCTAVE,
      Math.max(MIN_OCTAVE, octave + delta),
    );
    const noteIndex = Math.max(0, scaleNotes.indexOf(selectedNote));
    setOctave(nextOctave);
    setSelectedNote(
      withOctaves(getScale(selectedScale).notes, nextOctave)[noteIndex],
    );
  };

  const removeAllSpawns = () => {
    setSpawns([]);
  };

  useEffect(() => {
    console.log(spawns);
  }, [spawns]);

  return (
    <div className="container">
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
              onChange={(event) => changeScale(event.target.value)}
            >
              {scaleGroups.map((group) => (
                <optgroup key={group.label} label={group.label}>
                  {group.scales.map((scale) => (
                    <option key={scale.id} value={scale.id}>
                      {scale.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          <div className="tv-control">
            <span className="tv-label">Synth</span>
            <select
              className="tv-select"
              value={selectedSynth}
              onChange={(event) =>
                changeSynth(event.target.value as SynthName)
              }
            >
              {synthOptions.map((synth) => (
                <option key={synth.id} value={synth.id}>
                  {synth.label}
                </option>
              ))}
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
                  className={note === selectedNote ? "tv-btn is-on" : "tv-btn"}
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
              <span className="tv-readout tv-readout-wide">{selectedNote}</span>
            </div>
          </div>
          <div className="tv-control">
            <span className="tv-label">Reset</span>
            <button
              type="button"
              className="tv-btn tv-btn-wide"
              onClick={() => removeAllSpawns()}
              disabled={spawns.length === 0}
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
