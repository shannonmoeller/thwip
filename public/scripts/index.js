import { createContext, resizeContext } from './canvas.js';
import { createLoop } from './loop.js';
import { createRandom } from './math.js';

const State = {
	SETUP: 'SETUP',
	READY: 'READY',
	SWINGING: 'SWINGING',
	FLYING: 'FLYING',
	SCORING: 'SCORING',
	DEAD: 'DEAD',
};

function createGame(ctx) {
	let random = null;
	let state = null;
	let platforms = [];
	let player = {};
	let rope = [];

	function setup() {
		state = State.SETUP;
		random = createRandom();

		// reset platforms
		// reset players
	}

	function ready() {
		state = State.READY;
	}

	function swing() {
		if (state !== State.READY) return;
		state = State.SWINGING;

		// create rope
		// jump
	}

	function fly() {
		if (state !== State.SWINGING) return;
		state = State.FLYING;

		// delete rope
	}

	function score() {
		state = State.SCORING;
		// measure
	}

	function die() {
		state = State.DEAD;
	}

	function update() {
		switch (state) {
			case State.SETUP: {
				// move platforms
				// move player
				// ready
				break;
			}

			case State.SWINGING: {
				// move player
				// move anchor
				// resolve rope
				break;
			}

			case State.FLYING: {
				// move player
				// collide
				// score
				break;
			}
		}
	}

	function render() {
		// render platforms
		// render player
		// render rope
	}

	function resize() {
		resizeContext(ctx);
	}

	return {
		setup,
		update,
		render,
		resize,
		swing,
		fly,
	};
}

const canvas = document.querySelector('canvas');
const ctx = createContext(canvas);
const game = createGame(ctx);
const loop = createLoop(game);

addEventListener('contextmenu', (e) => e.preventDefault());
addEventListener('resize', game.resize, { passive: true });
addEventListener('pointerdown', game.swing);
addEventListener('pointerup', game.fly);
addEventListener('pointercancel', game.fly);

game.resize();
game.setup();
loop.start();

// import { createContext, clearContext, resizeContext } from './canvas.js';
// import { createLoop } from './loop.js';
// import { constrain, getDistance } from './particles.js';
//
// function createGame() {
// 	let score = 0;
// 	let player = { x: 0, x0: 0, y: 0, y0: 0 };
// 	let platforms = [];
//
// 	function ready() {}
// 	function swinging() {}
// 	function flying() {}
// 	function scoring() {}
// 	function animating() {}
// 	function gameOver() {}
//
// 	return {
// 		get score() {
// 			return score;
// 		},
//
// 		get player() {
// 			return player;
// 		},
//
// 		get platforms() {
// 			return platforms;
// 		},
//
// 		ready,
// 		swinging,
// 		flying,
// 		scoring,
// 		animating,
// 		gameOver,
// 	};
// }
//
// console.log(createGame());
//
// let dayEl = document.getElementById('day');
// let livesEl = document.getElementById('lives');
// let scoreEl = document.getElementById('score');
// let platformEl = document.getElementById('platform');
// let streakEl = document.getElementById('streak');
//
// let canvas = document.getElementById('canvas');
// let ctx = createContext(canvas);
//
// let second = 1000;
// let minute = second * 60;
// let hour = minute * 60;
// let day = hour * 24;
//
// let timeout = null;
// let gravity = 0.04;
// let jump = 1;
// let pump = 0.02125;
// let good = 10;
// let better = 25;
// let best = 100;
//
// let state = createGameState();
// let ropeLength = getDistance(state.player, state.anchor);
//
// function createGameState() {
// 	let then = new Date(2022, 0, 1).setHours(0, 0, 0, 0);
// 	let now = new Date().setHours(0, 0, 0, 0);
// 	let seed = Math.floor((now - then) / day);
//
// 	function random() {
// 		let t = (seed += 0x6d2b79f5);
//
// 		t = Math.imul(t ^ (t >>> 15), t | 1);
// 		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
//
// 		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
// 	}
//
// 	function createPlatform() {
// 		return {
// 			x: 300 + Math.round(random() * 300),
// 			y: 200 + Math.round(random() * 100),
// 			w: 20 + Math.round(random() * 200),
// 		};
// 	}
//
// 	return {
// 		seed,
// 		isTouched: false,
// 		isSwinging: false,
// 		isGrabbing: false,
//
// 		lives: 3,
// 		score: 0,
// 		platform: 1,
// 		streak: 0,
//
// 		anchor: {
// 			x: 200,
// 			y: 0,
// 			mass: 0,
// 		},
//
// 		player: {
// 			x: 100,
// 			x0: 100,
// 			y: 100,
// 			y0: 100,
// 			w: 20,
// 			h: 20,
// 			mass: 1,
// 		},
//
// 		platformA: {
// 			x: 80,
// 			y: 110,
// 			w: 60,
// 		},
//
// 		platformB: createPlatform(),
//
// 		reset() {
// 			this.isTouched = false;
// 			this.isSwinging = false;
// 			this.isGrabbing = false;
// 			this.player.x = this.player.x0 = 100;
// 			this.player.y = this.player.y0 = 100;
// 		},
//
// 		next() {
// 			this.platform += 1;
// 			this.isTouched = false;
// 			this.isSwinging = false;
// 			this.isGrabbing = false;
// 			this.player.x = this.player.x0 = 100;
// 			this.player.y = this.player.y0 = 100;
// 			this.platformB = createPlatform();
// 		},
// 	};
// }
//
// function update() {
// 	updateDude();
// }
//
// function updateDude() {
// 	if (!state.isSwinging) {
// 		return;
// 	}
//
// 	let { x, x0, y, y0 } = state.player;
// 	let vx = x - x0;
// 	let vy = y - y0;
//
// 	vy += gravity;
//
// 	state.player.x = x + vx;
// 	state.player.x0 = x;
// 	state.player.y = y + vy;
// 	state.player.y0 = y;
//
// 	if (state.isGrabbing) {
// 		if (state.player.x0 < state.player.x) {
// 			state.player.x0 -= pump;
// 		}
//
// 		for (let i = 3; i--; ) {
// 			constrain(state.player, state.anchor, { length: ropeLength });
// 		}
// 	}
//
// 	if (state.player.y > ctx.height) {
// 		if (state.lives) {
// 			state.lives -= 1;
//
// 			if (state.lives) {
// 				state.reset();
// 			} else {
// 				timeout = setTimeout(() => {
// 					state = createGameState();
// 				}, 1000);
// 			}
// 		}
//
// 		return;
// 	}
//
// 	if (state.player.y + state.player.h * 0.5 < state.platformB.y) {
// 		return;
// 	}
//
// 	if (
// 		state.player.x + state.player.w * 0.5 <
// 		state.platformB.x - state.platformB.w * 0.5
// 	) {
// 		return;
// 	}
//
// 	if (
// 		state.player.x - state.player.w * 0.5 >
// 		state.platformB.x + state.platformB.w * 0.5
// 	) {
// 		return;
// 	}
//
// 	if (state.player.y + state.player.h * 0.1 < state.platformB.y) {
// 		state.player.y = state.platformB.y - state.player.h * 0.5;
// 	}
//
// 	if (state.player.y + state.player.h * 0.5 > state.platformB.y) {
// 		state.streak = 0;
// 		state.score += good;
// 	} else if (
// 		state.player.x < state.platformB.x - 10 ||
// 		state.player.x > state.platformB.x + 10
// 	) {
// 		state.streak = 0;
// 		state.score += better;
// 	} else {
// 		state.streak += 1;
// 		state.score += best * state.streak;
// 	}
//
// 	state.isSwinging = false;
// 	timeout = setTimeout(() => state.next(), 1000);
// }
//
// function render() {
// 	clearContext(ctx);
// 	ctx.save();
// 	ctx.scale(devicePixelRatio, devicePixelRatio);
//
// 	let scale = Math.min(ctx.height / 360, ctx.width / 700);
// 	ctx.scale(scale, scale);
//
// 	renderPlatform(state.platformA);
// 	renderPlatform(state.platformB);
// 	renderRope();
// 	renderPlayer();
// 	renderScore();
//
// 	ctx.restore();
// }
//
// function renderPlatform(platform) {
// 	ctx.save();
//
// 	let { x, y, w } = platform;
//
// 	ctx.translate(x, y);
//
// 	ctx.fillStyle = 'white';
// 	ctx.fillRect(w * -0.5, 0, w, ctx.height * 2);
//
// 	ctx.fillStyle = 'deeppink';
// 	ctx.fillRect(w * -0.5, 0, w, 5);
//
// 	ctx.fillStyle = 'yellow';
// 	ctx.fillRect(-10, 0, 20, 5);
//
// 	ctx.restore();
// }
//
// function renderRope() {
// 	if (!state.isGrabbing) {
// 		return;
// 	}
//
// 	ctx.save();
//
// 	ctx.beginPath();
// 	ctx.moveTo(state.anchor.x, state.anchor.y);
// 	ctx.lineTo(state.player.x, state.player.y);
//
// 	ctx.strokeStyle = 'dodgerblue';
// 	ctx.stroke();
//
// 	ctx.restore();
// }
//
// function renderPlayer() {
// 	ctx.save();
//
// 	let { x, y, h, w } = state.player;
//
// 	ctx.translate(x, y);
//
// 	ctx.fillStyle = 'dodgerblue';
// 	ctx.fillRect(w * -0.5, h * -0.5, w, h);
//
// 	ctx.restore();
// }
//
// function renderScore() {
// 	dayEl.innerHTML = String(state.seed);
// 	livesEl.innerHTML = String(state.lives);
// 	scoreEl.innerHTML = String(state.score);
// 	platformEl.innerHTML = String(state.platform);
// 	streakEl.innerHTML = String(state.streak);
// }
//
// resizeContext(ctx);
// addEventListener('resize', () => resizeContext(ctx), { passive: true });
//
// canvas.addEventListener('contextmenu', (event) => {
// 	event.preventDefault();
// });
//
// canvas.addEventListener('pointerdown', () => {
// 	if (state.isTouched) {
// 		return;
// 	}
// 	clearTimeout(timeout);
// 	state.reset();
// 	state.isTouched = true;
// 	state.isSwinging = true;
// 	state.isGrabbing = true;
// 	state.player.x0 = state.player.x + jump;
// 	state.player.y0 = state.player.y + jump;
// });
//
// canvas.addEventListener('pointerup', () => {
// 	state.isGrabbing = false;
// });
// canvas.addEventListener('pointercancel', () => {
// 	state.isGrabbing = false;
// });
//
// createLoop({ update, render }).start();
