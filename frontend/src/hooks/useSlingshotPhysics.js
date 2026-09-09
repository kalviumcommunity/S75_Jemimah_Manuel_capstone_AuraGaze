import {
  useCallback,
  useRef,
  useState,
} from "react";

const MAX_PULL = 95;

export default function useSlingshotPhysics() {
  const [
    dragPosition,
    setDragPosition,
  ] = useState({
    x: 0,
    y: 0,
  });

  const [
    trajectory,
    setTrajectory,
  ] = useState([]);

  const [
    isDragging,
    setIsDragging,
  ] = useState(false);

  const startPoint =
    useRef(null);

  const beginDrag =
    useCallback((point) => {
      startPoint.current = point;

      setIsDragging(true);

      setDragPosition({
        x: 0,
        y: 0,
      });

      setTrajectory([]);
    }, []);

  const updateDrag =
    useCallback((point) => {
      if (!startPoint.current) {
        return;
      }

      let dx =
        point.x -
        startPoint.current.x;

      let dy =
        point.y -
        startPoint.current.y;

      const distance =
        Math.sqrt(
          dx * dx +
            dy * dy
        );

      /*
       * Limit pull distance.
       */
      if (
        distance > MAX_PULL
      ) {
        const ratio =
          MAX_PULL /
          distance;

        dx *= ratio;
        dy *= ratio;
      }

      setDragPosition({
        x: dx,
        y: dy,
      });

      /*
       * Generate trajectory dots.
       *
       * The launch direction is opposite
       * to the pull direction.
       */
      const points = [];

      const launchX = -dx;
      const launchY = -dy;

      for (
        let i = 0;
        i < 14;
        i++
      ) {
        const t = i / 13;

        points.push({
          x:
            launchX * t,

          y:
            launchY * t +
            55 * t * t,
        });
      }

      setTrajectory(points);
    }, []);

  const releaseDrag =
    useCallback(() => {
      const velocity = {
        x:
          -dragPosition.x,

        y:
          -dragPosition.y,
      };

      setIsDragging(false);

      setTrajectory([]);

      return velocity;
    }, [dragPosition]);

  const reset =
    useCallback(() => {
      startPoint.current = null;

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