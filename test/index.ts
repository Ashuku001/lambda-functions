import { describe, it, afterEach } from "mocha";
import { handler, storage, type Input, type Output } from "..";
import {stub, restore } from "sinon"
import axios from "axios";
import { strictEqual } from "node:assert";

const executableLambda = async (url: string, name: string): Promise<Output | null> => {
    const output = await handler({
        queryStringParameters: { url, name },
        version: "",
        routeKey: "",
        rawPath: "",
        rawQueryString: "",
        headers: {},
        requestContext: {
            accountId: "",
            apiId: "",
            domainName: "",
            domainPrefix: "",
            http: {
                method: "",
                path: "",
                protocol: "",
                sourceIp: "",
                userAgent: ""
            },
            requestId: "",
            routeKey: "",
            stage: "",
            time: "",
            timeEpoch: 0
        },
        isBase64Encoded: false
    });
    let ouputBody: Output | null = null
    if (output) {
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        ouputBody = JSON.parse(output.body!)
    }
    return ouputBody
}
const title = "This is the title of example.col"
const s3UrlFile = "https://s3file.com"
const name = "__file_name___"

afterEach(restore); //  reset each stub after the test rn


// 2 tests
describe("handler", () => {
    it("should get the html from a url", async () => {
        stub(axios, "get").resolves({data: `<html><head><title>${title}</title></head></html>`})
        stub(storage, "storeHtmlFile").resolves(s3UrlFile)
        const output = await executableLambda('http://example.com', name)
        strictEqual(output?.title, title)
    });
    it("should extract and return the page title of a url", async () => {
        const html = `<html><head><title>${title}</title></head></html>`
        stub(axios, "get").resolves({data:  html})
        const storeHtmlFileStub = stub(storage, "storeHtmlFile").resolves(s3UrlFile)
        const output = await executableLambda('http://example.com', name)
        strictEqual(output?.title, title)
        strictEqual(storeHtmlFileStub.calledOnceWith(html, name), true)
    })
})