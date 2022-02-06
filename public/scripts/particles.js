export function constrain(a, b, options = {}) {
	let { x: ax, y: ay, mass: aMass = 1, radius: aRadius = 0 } = a;
	let { x: bx, y: by, mass: bMass = 1, radius: bRadius = 0 } = b;
	let { length = 0, strength = 1, adjust } = options;

	if (!aMass && !bMass) {
		return;
	}

	let xDelta = ax - bx;
	let yDelta = ay - by;
	let abDistance = Math.hypot(xDelta, yDelta);
	let abDelta = abDistance - aRadius - bRadius - length;

	if (adjust) {
		abDelta = adjust(abDelta);
	}

	if (!abDelta) {
		return;
	}

	let abMass = aMass + bMass;
	let abScale = abDelta / (abDistance * abMass);
	let aScale = abScale * aMass * strength;
	let bScale = abScale * bMass * strength;

	a.x -= xDelta * aScale;
	a.y -= yDelta * aScale;
	b.x += xDelta * bScale;
	b.y += yDelta * bScale;
}

export function getDistance(a, b) {
	let { x: ax, y: ay, radius: aRadius = 0 } = a;
	let { x: bx, y: by, radius: bRadius = 0 } = b;

	let xDelta = ax - bx;
	let yDelta = ay - by;
	let abDistance = Math.hypot(xDelta, yDelta);

	return abDistance - aRadius - bRadius;
}
