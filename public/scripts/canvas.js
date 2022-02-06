export function createContext(canvas) {
	return resizeContext(canvas.getContext('2d'));
}

export function clearContext(ctx) {
	ctx.save();
	ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
	ctx.clearRect(0, 0, ctx.width, ctx.height);
	ctx.restore();

	return ctx;
}

export function resizeContext(ctx) {
	let { canvas } = ctx;
	let height = canvas.clientHeight;
	let width = canvas.clientWidth;

	ctx.height = height;
	ctx.width = width;
	canvas.height = height * devicePixelRatio;
	canvas.width = width * devicePixelRatio;

	return ctx;
}
