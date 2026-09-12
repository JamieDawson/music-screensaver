import { useEffect, useRef, useState } from "react";
import tvStencil from "./assets/tvstencil.webp";
import {
  playNote,
  setBitcrushAmount,
  setDelayAmount,
  setReverbAmount,
  setSynth,
  startAudio,
  synthOptions,
  type SynthName,
} from "./audio";
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

function TvKnob({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  const startY = useRef(0);
  const startValue = useRef(0);
  const angle = -135 + value * 270;

  return (
    <div
      className="tv-knob"
      role="slider"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value * 100)}
      tabIndex={0}
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        startY.current = event.clientY;
        startValue.current = value;
      }}
      onPointerMove={(event) => {
        if (!event.currentTarget.hasPointerCapture(event.pointerId)) {
          return;
        }
        const next = startValue.current + (startY.current - event.clientY) / 90;
        onChange(Math.min(1, Math.max(0, next)));
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowUp" || event.key === "ArrowRight") {
          onChange(Math.min(1, value + 0.05));
        }
        if (event.key === "ArrowDown" || event.key === "ArrowLeft") {
          onChange(Math.max(0, value - 0.05));
        }
      }}
    >
      <div
        className="tv-knob-face"
        style={{ transform: `rotate(${angle}deg)` }}
      >
        <span className="tv-knob-marker" />
      </div>
    </div>
  );
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

  const [selectedScale, setSelectedScale] = useState(defaultScaleId);
  const [selectedSynth, setSelectedSynth] = useState<SynthName>("synth");
  const [delayAmount, setDelayAmountState] = useState(0.2);
  const [reverbAmount, setReverbAmountState] = useState(0.2);
  const [bitcrushAmount, setBitcrushAmountState] = useState(0);
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

  const changeDelay = (amount: number) => {
    void startAudio();
    setDelayAmountState(amount);
    setDelayAmount(amount);
  };

  const changeReverb = (amount: number) => {
    void startAudio();
    setReverbAmountState(amount);
    setReverbAmount(amount);
  };

  const changeBitcrush = (amount: number) => {
    void startAudio();
    setBitcrushAmountState(amount);
    setBitcrushAmount(amount);
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
              onChange={(event) => changeSynth(event.target.value as SynthName)}
            >
              {synthOptions.map((synth) => (
                <option key={synth.id} value={synth.id}>
                  {synth.label}
                </option>
              ))}
            </select>
          </div>
          <div className="tv-fx">
            <div className="tv-control">
              <span className="tv-label">Delay</span>
              <TvKnob
                label="Delay"
                value={delayAmount}
                onChange={changeDelay}
              />
            </div>
            <div className="tv-control">
              <span className="tv-label">Reverb</span>
              <TvKnob
                label="Reverb"
                value={reverbAmount}
                onChange={changeReverb}
              />
            </div>
            <div className="tv-control">
              <span className="tv-label">Crush</span>
              <TvKnob
                label="Bitcrusher"
                value={bitcrushAmount}
                onChange={changeBitcrush}
              />
            </div>
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
      <a
        className="credit"
        href="https://github.com/JamieDawson/screensavr"
        target="_blank"
        rel="noreferrer"
      >
        Made by Jamie Dawson Codes (Click for GitHub link)
      </a>
    </div>
  );
}

export default App;
