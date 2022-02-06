import { createContext, clearContext, resizeContext } from './canvas.js';
import { createLoop } from './loop.js';
import { constrain, getDistance } from './particles.js';

let canvas = document.querySelector('canvas');
let ctx = createContext(canvas);

let timeout = null;
let gravity = 0.08;
let state = createGameState();
let ropeLength = getDistance(state.dude, state.hook);

function createGameState() {
	return {
		isSwinging: false,
		isGrabbing: false,

		hook: {
			x: 150,
			y: 0,
			mass: 0,
		},

		dude: {
			x: 100,
			x0: 100,
			y: 100,
			y0: 100,
			w: 10,
			h: 30,
			mass: 1,
		},

		platformA: {
			x: 100,
			y: 120,
			w: 60,
			collides: true,
		},

		platformB: {
			x: 300,
			y: 220,
			w: 60,
			collides: true,
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

	let { x, x0, y, y0 } = state.dude;
	let vx = x - x0;
	let vy = y - y0;

	vy += gravity;

	state.dude.x = x + vx;
	state.dude.x0 = x;
	state.dude.y = y + vy;
	state.dude.y0 = y;

	if (state.isGrabbing) {
		for (let i = 3; i--; ) {
			constrain(state.dude, state.hook, { length: ropeLength });
		}
	}

	if (state.dude.y > ctx.height) {
		state = createGameState();
		return;
	}

	if (state.dude.y + state.dude.h * 0.6 < state.platformB.y) {
		return;
	}

	if (
		state.dude.x + state.dude.w * 0.5 <
		state.platformB.x - state.platformB.w * 0.5
	) {
		return;
	}

	if (
		state.dude.x - state.dude.w * 0.5 >
		state.platformB.x + state.platformB.w * 0.5
	) {
		return;
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

	renderPlatform(state.platformA);
	renderPlatform(state.platformB);
	renderRope();
	renderDude();

	ctx.restore();
}

function renderPlatform(platform) {
	ctx.save();

	ctx.translate(platform.x, platform.y);

	ctx.fillStyle = 'black';
	ctx.fillRect(platform.w * -0.5, 0, platform.w, ctx.height);

	ctx.fillStyle = 'dodgerblue';
	ctx.fillRect(platform.w * -0.5, 0, platform.w, 5);

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
	ctx.moveTo(state.hook.x, state.hook.y);
	ctx.lineTo(state.dude.x, state.dude.y);
	ctx.stroke();

	ctx.restore();
}

function renderDude() {
	ctx.save();

	ctx.translate(state.dude.x, state.dude.y);

	ctx.fillStyle = 'white';
	ctx.fillRect(
		state.dude.w * -0.5,
		state.dude.h * -0.4,
		state.dude.w,
		state.dude.h
	);

	ctx.strokeStyle = 'black';
	ctx.strokeRect(
		state.dude.w * -0.5,
		state.dude.h * -0.4,
		state.dude.w,
		state.dude.h
	);

	ctx.restore();
}

resizeContext(ctx);
addEventListener('resize', () => resizeContext(ctx), { passive: true });

canvas.addEventListener('pointerdown', () => {
	clearTimeout(timeout);
	state = createGameState();
	state.isSwinging = true;
	state.isGrabbing = true;
	state.dude.x0 = state.dude.x + 2;
	state.dude.y0 = state.dude.y + 2;
	state.platformA.collides = false;
});

canvas.addEventListener('pointerup', () => {
	state.isGrabbing = false;
});

createLoop({ update, render }).start();
