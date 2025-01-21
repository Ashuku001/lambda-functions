import { handler } from ".";

const main = async () => {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const res = await handler({} as any)

    console.log(res)
}

main()