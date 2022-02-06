import { createContext, clearContext, resizeContext } from './canvas.js';
import { createLoop } from './loop.js';
import { constrain, getDistance } from './particles.js';

let canvas = document.querySelector('canvas');
let ctx = createContext(canvas);

let timeout = null;
let gravity = 0.08;
let state = createGameState();
let ropeLength = getDistance(state.player, state.anchor);

function createGameState() {
	return {
		isSwinging: false,
		isGrabbing: false,

		anchor: {
			x: 150,
			y: 0,
			mass: 0,
		},

		player: {
			x: 100,
			x0: 100,
			y: 100,
			y0: 100,
			w: 10,
			h: 20,
			mass: 1,
		},

		platformA: {
			x: 100,
			y: 120,
			w: 60,
		},

		platformB: {
			x: 300 + Math.round(Math.random() * 150),
			y: 200 + Math.round(Math.random() * 100),
			w: 20 + Math.round(Math.random() * 100),
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
		state.player.x0 -= 0.04;

		for (let i = 3; i--; ) {
			constrain(state.player, state.anchor, { length: ropeLength });
		}
	}

	if (state.player.y > ctx.height) {
		state.reset();
		return;
	}

	if (state.player.y + state.player.h < state.platformB.y) {
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

	if (state.player.y + state.player.h * 0.5 < state.platformB.y) {
		state.player.y = state.platformB.y - state.player.h;
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

	ctx.fillStyle = 'black';
	ctx.fillRect(w * -0.5, 0, w, ctx.height * 2);

	ctx.fillStyle = 'dodgerblue';
	ctx.fillRect(w * -0.5, 0, w, 5);

	ctx.fillStyle = 'deeppink';
	ctx.fillRect(-15, 0, 30, 5);

	ctx.fillStyle = 'yellow';
	ctx.fillRect(-5, 0, 10, 5);

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
	ctx.stroke();

	ctx.restore();
}

function renderPlayer() {
	ctx.save();

	let { x, y, h, w } = state.player;
	let head = 10;

	ctx.translate(x, y - head);

	ctx.fillStyle = 'white';
	ctx.fillRect(w * -0.5, 0, w, h + head);

	ctx.strokeStyle = 'black';
	ctx.strokeRect(w * -0.5, 0, w, h + head);

	ctx.restore();
}

resizeContext(ctx);
addEventListener('resize', () => resizeContext(ctx), { passive: true });

canvas.addEventListener('pointerdown', () => {
	clearTimeout(timeout);
	state.reset();
	state.isSwinging = true;
	state.isGrabbing = true;
	state.player.x0 = state.player.x + 2;
	state.player.y0 = state.player.y + 1;
});

canvas.addEventListener('pointerup', () => {
	state.isGrabbing = false;
});

createLoop({ update, render }).start();
