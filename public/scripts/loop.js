let HERTZ = 120;
let PANIC = 120;
let MAX = 3;

export function createLoop(options) {
	let { update, render } = options;

	let frameRate = 1000 / HERTZ;
	let isPlaying = false;
	let prev = null;

	function handleFrame(now) {
		if (!isPlaying) {
			return;
		}

		let delta = now - prev;
		let ticks = Math.floor(delta / frameRate);

		if (ticks > PANIC) {
			prev = now - frameRate;
			ticks = 1;
		}

		if (ticks > MAX) {
			ticks = MAX;
		}

		if (ticks > 0) {
			if (update) {
				while (ticks--) {
					update({ now, prev, delta: frameRate });
					now += frameRate;
					prev += frameRate;
				}
			}

			if (render) {
				render();
			}
		}

		requestAnimationFrame(handleFrame);
	}

	return {
		get isPlaying() {
			return isPlaying;
		},

		start() {
			if (!isPlaying) {
				isPlaying = true;
				prev = performance.now();
				requestAnimationFrame(handleFrame);
			}
		},

		stop() {
			if (isPlaying) {
				isPlaying = false;
			}
		},
	};
}
