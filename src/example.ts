import safeHttp from "./";

async function main() {
	const req1 = {
		url: "https://google.com",
		method: "get",
	};
	
	const res1 = await safeHttp(req1);
	
	console.log({
		req1,
		res1,
	});
	
	const req2 = {
		url: "hello",
		method: "get",
	};

	const res2 = await safeHttp(req2);

	console.log({
		req2,
		res2,
	});
}

main().catch(e => {
	throw e;
});