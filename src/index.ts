import fetch from "cross-fetch";

type Headers = { [name: string]: string };

interface Options {
	url: string;
	method: string;
	
	headers?: Headers;
	body?: any;
}

interface SafeResponse<ResponseBody> {
	error?: any;
	
	status: number;
	headers: Headers;
	body: ResponseBody | undefined;
}

function normalizeRequestBody(body: any): { body: string 
	| undefined, contentTypeHeader: string | undefined } {
	if (body === null || body === undefined) {
		return {
			body: undefined,
			contentTypeHeader: undefined,
		};
	}
	else if (typeof body === "object") {
		return {
			body: JSON.stringify(body),
			contentTypeHeader: "application/json",
		}
	}
	else if (typeof body === "string") {
		return {
			body: body,
			contentTypeHeader: "text/plain",
		};
	}
	
	// todo
	throw new Error("test");
}

function getResHeaders(res: Response): Headers {
	const headers: Headers = {};

	res.headers.forEach((value, key) => {
		headers[key] = value;
	});
	
	return headers;
}

async function getResBody(res: Response): Promise<any> {
	const contentType = res.headers.get("content-type") || "";

	if (contentType.startsWith("application/json")) {
		return res.json();
	}
	
	// todo: blob types
	
	return res.text();
}

function getReqHeaders(opts: Options, contentTypeHeader: string | undefined) {
	const headers: Headers = {
		...opts.headers,
	};

	if (contentTypeHeader !== undefined && headers["content-type"] === undefined) {
		headers["content-type"] = contentTypeHeader;
	}
	
	return headers;
}

async function safeHttp<ResponseBody extends any>(opts: Options): Promise<SafeResponse<ResponseBody>> {
	const { url, method } = opts;
	
	const {
		body,
		contentTypeHeader,
	} = normalizeRequestBody(opts.body);
	
	const headers = getReqHeaders(opts, contentTypeHeader);
	
	let fetchRes;
	
	try {
		fetchRes = await fetch(url, {
			method,
			headers,
			body,
		});
	}
	catch (e) {
		return {
			error: {
				name: e.name,
				message: e.message,
			},
			status: -1,
			headers: {},
			body: undefined,
		}
	}
	
	const resHeaders = getResHeaders(fetchRes);
	const resBody = await getResBody(fetchRes);
	
	const res: SafeResponse<ResponseBody> = {
		status: fetchRes.status,
		headers: resHeaders,
		body: resBody,
	};
	
	return res;
}

export default safeHttp;