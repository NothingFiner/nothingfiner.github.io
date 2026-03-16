import paper from 'paper';

export const getNewPosition = (position: paper.Point, vector: paper.Point): paper.Point => {
  const newPosition = position.clone();
  newPosition.x += vector.x;
  newPosition.y += vector.y;
  return newPosition;
};

export const getNewVector = (position1: paper.Point, position2: paper.Point): paper.Point => {
  const newVector = position1.clone();
  newVector.x -= position2.x;
  newVector.y -= position2.y;
  return newVector;
};
