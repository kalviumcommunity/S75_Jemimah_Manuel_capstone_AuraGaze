import {
  useCallback,
  useRef,
  useState,
} from "react";

const MAX_PULL = 105;

export default function useSlingshotPhysics() {
  const [dragPosition, setDragPosition] = useState({
    x: 0,
    y: 0,
  });

  const [trajectory, setTrajectory] = useState([]);

  const [isDragging, setIsDragging] = useState(false);

  const startPointRef = useRef(null);

  const beginDrag = useCallback((point) => {
    startPointRef.current = {
      x: point.x,
      y: point.y,
    };

    setIsDragging(true);

    setDragPosition({
      x: 0,
      y: 0,
    });

    setTrajectory([]);
  }, []);

  const updateDrag = useCallback((point) => {
    const start = startPointRef.current;

    if (!start) {
      return;
    }

    let dx = point.x - start.x;
    let dy = point.y - start.y;

    const distance = Math.sqrt(
      dx * dx + dy * dy
    );

    if (distance > MAX_PULL) {
      const ratio = MAX_PULL / distance;

      dx *= ratio;
      dy *= ratio;
    }

    setDragPosition({
      x: dx,
      y: dy,
    });

    const points = [];

    const launchX = -dx;
    const launchY = -dy;

    for (let i = 0; i < 18; i++) {
      const t = i / 17;

      points.push({
        x: launchX * t,
        y: launchY * t + 48 * t * t,
      });
    }

    setTrajectory(points);
  }, []);

  const releaseDrag = useCallback(() => {
    const velocity = {
      x: -dragPosition.x,
      y: -dragPosition.y,
    };

    startPointRef.current = null;

    setIsDragging(false);

    setTrajectory([]);

    return velocity;
  }, [dragPosition]);

  const reset = useCallback(() => {
    startPointRef.current = null;

    setDragPosition({
      x: 0,
      y: 0,
    });

    setTrajectory([]);

    setIsDragging(false);
  }, []);

  return {
    dragPosition,
    trajectory,
    isDragging,
    beginDrag,
    updateDrag,
    releaseDrag,
    reset,
  };
}