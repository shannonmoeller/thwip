export function clamp(min, value, max) {
	return Math.max(min, Math.min(value, max));
}

// mulberry32
// https://stackoverflow.com/a/47593316
function mullberry32(t) {
	t = Math.imul(t ^ (t >>> 15), t | 1);
	t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
	t = ((t ^ (t >>> 14)) >>> 0) / 4294967296;

	return t;
}

export function createRandom(seed, i = 0) {
	seed += i * 0x6d2b79f5;

	return function random() {
		seed += 0x6d2b79f5;

		return mullberry32(seed);
	};
}
