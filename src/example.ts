import safeFetch from "./";

async function main() {
	const req1 = {
		url: "https://google.com",
		method: "get",
	};
	
	const res1 = await safeFetch(req1);
	
	console.log({
		req1,
		res1,
	});
	
	const req2 = {
		url: "hello",
		method: "get",
	};

	const res2 = await safeFetch(req2);

	console.log({
		req2,
		res2,
	});
}

main().catch(e => {
	throw e;
});