let CACHE = 'offline';

async function toCache(event, response) {
	let clone = response.clone();
	let cache = await caches.open(CACHE);

	return cache.put(event.request, clone);
}

async function fromCache(event) {
	let cache = await caches.open(CACHE);

	return cache.match(event.request);
}

async function fromNetwork(event) {
	let response = await fetch(event.request);

	event.waitUntil(toCache(event, response));

	return response;
}

async function load(event) {
	try {
		return await fromNetwork(event);
	} catch (e) {
		return await fromCache(event);
	}
}

addEventListener('fetch', (event) => {
	event.respondWith(load(event));
});
