import { useState } from "react";
import { animated } from "react-spring";
import squareImg from "../src/assets/square-img.png";

function App() {
  // A click point on the screen (pixels from the top-left)
  type Spawn = {
    x: number;
    y: number;
  };

  // All click points so far. setSpawns replaces the whole list.
  const [spawns, setSpawns] = useState<Spawn[]>([]);

  // One "+1" label, placed at a click point
  const Spawn = ({ x, y }: Spawn) => {
    const spawnStyles: React.CSSProperties = {
      position: "absolute",
      left: x + "px",
      top: y + "px",
      transform: `translate(-50%, -50%)`,
    };

    return (
      <animated.div style={spawnStyles}>
        <div className="note">+1</div>
      </animated.div>
    );
  };

  const clickHandler = (event: React.MouseEvent) => {
    const { clientX, clientY } = event; // mouse position in the window
    console.log(clientX, clientY);

    // Keep old clicks, then add this one
    setSpawns([
      ...spawns,
      {
        x: clientX,
        y: clientY,
      },
    ]);
  };

  return (
    <div className="container">
      <div className="title">Music screen saver</div>
      <div className="rectangle" onClick={(event) => clickHandler(event)}>
        {/* Draw a "+1" for every stored click */}
        {spawns.map((spawn, key) => {
          return <Spawn x={spawn.x} y={spawn.y} key={key} />;
        })}
        <div className="iconContainer">
          <img src={squareImg} alt="square" className="icon"></img>
        </div>
      </div>
    </div>
  );
}

export default App;
