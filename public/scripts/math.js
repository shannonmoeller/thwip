let DAY = 1000 * 60 * 60 * 24;

export function clamp(min, value, max) {
	return Math.max(min, Math.min(value, max));
}

export function createRandom() {
	let then = new Date(2022, 0, 1).setHours(0, 0, 0, 0);
	let now = new Date().setHours(0, 0, 0, 0);
	let seed = Math.floor((now - then) / DAY);

	return function random() {
		let t = (seed += 0x6d2b79f5);

		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);

		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}
