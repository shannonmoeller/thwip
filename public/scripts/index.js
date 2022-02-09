import { createContext, clearContext, resizeContext } from './canvas.js';
import { createLoop } from './loop.js';
import { constrain, getDistance } from './particles.js';

let canvas = document.querySelector('canvas');
let ctx = createContext(canvas);

let timeout = null;
let gravity = 0.04;
let jump = 1;
let pump = 0.02125;
let state = createGameState();
let ropeLength = getDistance(state.player, state.anchor);

function createGameState() {
	return {
		isSwinging: false,
		isGrabbing: false,

		anchor: {
			x: 200,
			y: 0,
			mass: 0,
		},

		hold: {
			x: 100,
			x0: 100,
			y: 100,
			y0: 100,
		},

		player: {
			x: 100,
			x0: 100,
			y: 100,
			y0: 100,
			w: 20,
			h: 20,
			mass: 1,
		},

		platformA: {
			x: 80,
			y: 110,
			w: 60,
		},

		platformB: {
			x: 300 + Math.round(Math.random() * 300),
			y: 200 + Math.round(Math.random() * 100),
			w: 20 + Math.round(Math.random() * 200),
		},

		reset() {
			this.isSwinging = false;
			this.isGrabbing = false;
			this.player.x = this.player.x0 = 100;
			this.player.y = this.player.y0 = 100;
		},
	};
}

function update() {
	updateDude();
}

function updateDude() {
	if (!state.isSwinging) {
		return;
	}

	let { x, x0, y, y0 } = state.player;
	let vx = x - x0;
	let vy = y - y0;

	vy += gravity;

	state.player.x = x + vx;
	state.player.x0 = x;
	state.player.y = y + vy;
	state.player.y0 = y;

	if (state.isGrabbing) {
		state.player.x0 -= pump;

		for (let i = 3; i--; ) {
			constrain(state.player, state.anchor, { length: ropeLength });
		}
	}

	if (state.player.y > ctx.height) {
		state.reset();
		return;
	}

	if (state.player.y + state.player.h * 0.5 < state.platformB.y) {
		return;
	}

	if (
		state.player.x + state.player.w * 0.5 <
		state.platformB.x - state.platformB.w * 0.5
	) {
		return;
	}

	if (
		state.player.x - state.player.w * 0.5 >
		state.platformB.x + state.platformB.w * 0.5
	) {
		return;
	}

	if (state.player.y + state.player.h * 0.1 < state.platformB.y) {
		state.player.y = state.platformB.y - state.player.h * 0.5;
	}

	state.isSwinging = false;
	timeout = setTimeout(() => {
		state = createGameState();
	}, 1000);
}

function render() {
	clearContext(ctx);
	ctx.save();
	ctx.scale(devicePixelRatio, devicePixelRatio);

	let scale = Math.min(ctx.height / 360, ctx.width / 500);
	ctx.scale(scale, scale);

	renderPlatform(state.platformA);
	renderPlatform(state.platformB);
	renderRope();
	renderPlayer();

	ctx.restore();
}

function renderPlatform(platform) {
	ctx.save();

	let { x, y, w } = platform;

	ctx.translate(x, y);

	ctx.fillStyle = 'white';
	ctx.fillRect(w * -0.5, 0, w, ctx.height * 2);

	ctx.fillStyle = 'deeppink';
	ctx.fillRect(w * -0.5, 0, w, 5);

	ctx.fillStyle = 'yellow';
	ctx.fillRect(-10, 0, 20, 5);

	ctx.restore();
}

function renderRope() {
	if (!state.isGrabbing) {
		return;
	}

	ctx.save();

	ctx.beginPath();
	ctx.moveTo(state.anchor.x, state.anchor.y);
	ctx.lineTo(state.player.x, state.player.y);

	ctx.strokeStyle = 'dodgerblue';
	ctx.stroke();

	ctx.restore();
}

function renderPlayer() {
	ctx.save();

	let { x, y, h, w } = state.player;

	ctx.translate(x, y);

	ctx.fillStyle = 'dodgerblue';
	ctx.fillRect(w * -0.5, h * -0.5, w, h);

	ctx.restore();
}

resizeContext(ctx);
addEventListener('resize', () => resizeContext(ctx), { passive: true });

canvas.addEventListener('contextmenu', (event) => {
	event.preventDefault();
});

canvas.addEventListener('pointerdown', () => {
	clearTimeout(timeout);
	state.reset();
	state.isSwinging = true;
	state.isGrabbing = true;
	state.player.x0 = state.player.x + jump;
	state.player.y0 = state.player.y + jump;
});

canvas.addEventListener('pointerup', () => {
	state.isGrabbing = false;
});

createLoop({ update, render }).start();
