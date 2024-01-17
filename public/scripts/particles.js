export function applyMovement(...particles) {
	for (const particle of particles) {
		const { x, x0, y, y0 } = particle;

		particle.x0 = x;
		particle.x += x - x0;

		particle.y0 = y;
		particle.y += y - y0;
	}
}

export function applyGravity(...particles) {
	for (const particle of particles) {
		particle.y += 0.2;
	}
}

export function getDistance(a, b) {
	let { x: ax, y: ay, radius: aRadius = 0 } = a;
	let { x: bx, y: by, radius: bRadius = 0 } = b;

	let xDelta = ax - bx;
	let yDelta = ay - by;
	let abDistance = Math.hypot(xDelta, yDelta);

	return abDistance - aRadius - bRadius;
}

export function constrain(a, b, options = {}) {
	let { x: ax, y: ay, m: aMass = 1, r: aRadius = 0 } = a;
	let { x: bx, y: by, m: bMass = 1, r: bRadius = 0 } = b;
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

export function constrainSeries(particles, options) {
	let max = particles.length - 1;

	for (let i = 0; i < max; i++) {
		let a = particles[i];
		let b = particles[i + 1];

		constrain(a, b, options);
	}
}

export function constrainRope(rope) {
	constrainSeries(rope, {
		adjust: (d) => (d < 0 ? 0 : d),
		length: 2,
		strength: 0.125,
	});
}
