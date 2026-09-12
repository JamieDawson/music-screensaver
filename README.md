# Screensavr

An experimental music app that used a DVD screensaver as a random note generator.

Inspired by early 2000's hardware, techno, and [that one scene from The Office](https://www.youtube.com/watch?v=QOtuX0jL85Y).

![Screensavr running in a CRT television](./src/assets/screensavr.png)

## Play

```bash
npm install
npm run dev
```

Click the screen to drop a note. Click a note to remove it. **Clear** wipes the board.

| Control              | What it does                                                                         |
| -------------------- | ------------------------------------------------------------------------------------ |
| **Input**            | Pick a scale (C Major, E Blues, G Major Pentatonic, …)                               |
| **Synth**            | Four [Tone.js](https://tonejs.github.io/) voices: Synth, MonoSynth, FMSynth, AMSynth |
| **Knobs**            | Delay, reverb, and bitcrush                                                          |
| **Octave / Channel** | Shift range and choose the next note                                                 |

The logo bouncing is the instrument.

Future goals: Turn this app into a VST for tools like FL Studio & Reaper so that musicians can use this as a random note generator.

![Michael Scott next to a TV playing a DVD screensaver](./src/assets/theoffice.png)
