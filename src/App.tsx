import { useState } from "react";
import { animated } from "react-spring";
import { DVDIcon } from "./components/DVDIcon";
import {
  LOGO_HEIGHT,
  LOGO_WIDTH,
  useDimensions,
  type Obstacle,
} from "./hooks/useDimensions";

const SPAWN_SIZE = 30;

function App() {
  const [spawns, setSpawns] = useState<Obstacle[]>([]);
  const { color, top, left } = useDimensions(spawns);

  const Spawn = ({ x, y }: Pick<Obstacle, "x" | "y">) => {
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

  const clickHandler = (event: React.MouseEvent<HTMLDivElement>) => {
    // Position inside the rectangle, not the whole window
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - bounds.left - event.currentTarget.clientLeft;
    const y = event.clientY - bounds.top - event.currentTarget.clientTop;

    setSpawns([
      ...spawns,
      {
        id: Date.now() + spawns.length,
        x,
        y,
        width: SPAWN_SIZE,
        height: SPAWN_SIZE,
      },
    ]);
  };

  return (
    <div className="container">
      <div className="title">Music screen saver</div>
      <div className="rectangle" onClick={clickHandler}>
        {spawns.map((spawn) => {
          return <Spawn x={spawn.x} y={spawn.y} key={spawn.id} />;
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

/*



*/
