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

	canvas.height = height * devicePixelRatio;
	canvas.width = width * devicePixelRatio;

	ctx.height = height;
	ctx.width = width;

	ctx.scale(devicePixelRatio, devicePixelRatio);
	ctx.translate(ctx.width / 2, ctx.height / 2);

	return ctx;
}
