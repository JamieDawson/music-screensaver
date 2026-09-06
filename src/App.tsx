import { useState } from "react";
import { animated } from "react-spring";

function App() {
  type Spawn = {
    x: number;
    y: number;
  };

  const [spawns, setSpawns] = useState<Spawn[]>([]);

  const Spawn = ({ x, y }: Spawn) => {
    const spawnStyles = {
      position: "absolute",
      left: x + "px",
      top: y + "px",
      transform: `translate(-50%, -50%)`,
    };

    return (
      <animated.div style={spawnStyles}>
        <p>+1</p>
      </animated.div>
    );
  };

  const clickHandler = (event: React.MouseEvent) => {
    const { clientX, clientY } = event;
    console.log(clientX, clientY);

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
      <div>Music screen saver</div>
      <div className="rectangle" onClick={(event) => clickHandler(event)}>
        {spawns.map((spawn) => {
          return <Spawn x={spawn.x} y={spawn.y} />;
        })}
        <div className="iconContainer">
          <div className="icon">icon</div>
        </div>
      </div>
    </div>
  );
}

export default App;
