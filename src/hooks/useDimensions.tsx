import { useEffect, useRef, useState } from "react";

export const RECT_WIDTH = 1000;
export const RECT_HEIGHT = 500;
export const LOGO_WIDTH = 200;
export const LOGO_HEIGHT = 90;

export type Obstacle = {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  note: string;
};

type Rect = {
  x: number;
  y: number;
  w: number;
  h: number;
};

const colors = [
  "#60D833",
  "#D500F9",
  "#651FFF",
  "#EF5350",
  "#FF8F00",
  "#F4FF81",
  "#B0BEC5",
  "#9DE7D7",
  "#00B08B",
  "#FF585D",
  "#8DB9CA",
];

const wall = {
  horizontal: RECT_WIDTH - LOGO_WIDTH,
  vertical: RECT_HEIGHT - LOGO_HEIGHT,
};

const overlaps = (a: Rect, b: Rect) =>
  a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

// Spawn x/y is the center of the square
const obstacleRect = (obstacle: Obstacle): Rect => ({
  x: obstacle.x - obstacle.width / 2,
  y: obstacle.y - obstacle.height / 2,
  w: obstacle.width,
  h: obstacle.height,
});

export const useDimensions = (
  obstacles: Obstacle[] = [],
  onHit?: (obstacle: Obstacle) => void,
) => {
  const [top, setTop] = useState(0);
  const [left, setLeft] = useState(0);
  const [color, setColor] = useState("#60D833");
  const [flagHorizontal, setFlagHorizontal] = useState(true);
  const [flagVertical, setFlagVertical] = useState(true);

  // Squares the logo is already touching, so we don't reverse every frame
  const overlappingRef = useRef<Set<number>>(new Set());
  const onHitRef = useRef(onHit);
  onHitRef.current = onHit;

  useEffect(() => {
    const timeout = setTimeout(() => {
      const random = Math.round(Math.random() * (colors.length - 1));

      let nextLeft = left + (flagHorizontal ? 2 : -2);
      let nextTop = top + (flagVertical ? 1 : -1);
      let nextHorizontal = flagHorizontal;
      let nextVertical = flagVertical;
      let bounced = false;

      // Bounce off the rectangle walls
      if (nextLeft <= 0) {
        nextLeft = 0;
        nextHorizontal = true;
        bounced = true;
      } else if (nextLeft >= wall.horizontal) {
        nextLeft = wall.horizontal;
        nextHorizontal = false;
        bounced = true;
      }

      if (nextTop <= 0) {
        nextTop = 0;
        nextVertical = true;
        bounced = true;
      } else if (nextTop >= wall.vertical) {
        nextTop = wall.vertical;
        nextVertical = false;
        bounced = true;
      }

      const stillOverlapping = new Set<number>();

      for (const obstacle of obstacles) {
        const box = obstacleRect(obstacle);
        const logo: Rect = {
          x: nextLeft,
          y: nextTop,
          w: LOGO_WIDTH,
          h: LOGO_HEIGHT,
        };

        if (!overlaps(logo, box)) {
          continue;
        }

        stillOverlapping.add(obstacle.id);

        const overlapX =
          Math.min(logo.x + logo.w, box.x + box.w) - Math.max(logo.x, box.x);
        const overlapY =
          Math.min(logo.y + logo.h, box.y + box.h) - Math.max(logo.y, box.y);
        const hitHorizontal = overlapX <= overlapY;
        const isNewHit = !overlappingRef.current.has(obstacle.id);

        if (isNewHit) {
          bounced = true;
          onHitRef.current?.(obstacle);
        }

        if (hitHorizontal) {
          const logoCenter = nextLeft + LOGO_WIDTH / 2;
          const boxCenter = box.x + box.w / 2;
          nextLeft =
            logoCenter < boxCenter ? box.x - LOGO_WIDTH : box.x + box.w;
          if (isNewHit) {
            nextHorizontal = !nextHorizontal;
          }
        } else {
          const logoCenter = nextTop + LOGO_HEIGHT / 2;
          const boxCenter = box.y + box.h / 2;
          nextTop =
            logoCenter < boxCenter ? box.y - LOGO_HEIGHT : box.y + box.h;
          if (isNewHit) {
            nextVertical = !nextVertical;
          }
        }
      }

      overlappingRef.current = stillOverlapping;

      nextLeft = Math.max(0, Math.min(nextLeft, wall.horizontal));
      nextTop = Math.max(0, Math.min(nextTop, wall.vertical));

      if (bounced) {
        setColor(colors[random]);
      }

      setLeft(nextLeft);
      setTop(nextTop);
      setFlagHorizontal(nextHorizontal);
      setFlagVertical(nextVertical);
    }, 10);

    return () => clearTimeout(timeout);
  });

  return { color, top, left };
};
