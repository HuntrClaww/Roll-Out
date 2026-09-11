import { Marble, Vector3 } from "../physics/marble";

export interface TrackObstacle {
  id: string;
  name: string;
  position: Vector3;
  radius: number;
  bounce: number;
  description: string;
}

/**
 * Resolves a simple spherical obstacle against a marble in 3D.
 * Artwork remains separate from this collision data so tracks can be reskinned.
 */
export const resolveObstacleCollision = (marble: Marble, obstacle: TrackObstacle): boolean => {
  const offset = marble.position.subtract(obstacle.position);
  const collisionDistance = marble.radius + obstacle.radius;
  const distance = offset.length();

  if (distance >= collisionDistance) return false;

  const normal = distance > 0
    ? offset.multiply(1 / distance)
    : new Vector3(1, 0, 0);
  const correction = collisionDistance - distance;
  marble.position = marble.position.add(normal.multiply(correction));

  const velocityIntoObstacle = marble.velocity.dot(normal);
  if (velocityIntoObstacle < 0) {
    marble.velocity = marble.velocity.subtract(normal.multiply((1 + obstacle.bounce) * velocityIntoObstacle));
  }

  return true;
};

export const createStarterObstacle = (): TrackObstacle => ({
  id: "starter-boulder",
  name: "Starter Boulder",
  position: new Vector3(0, 0.15, 32),
  radius: 0.15,
  bounce: 0.25,
  description: "A solid boulder that rewards steering around it or controlled impact.",
});
