import { describe, expect, it } from "vitest";
import { {{className}} } from "../src";
import { AlgorandClient } from "@algorandfoundation/algokit-utils";

describe("{{className}}", () => {
  it("should say hello", async () => {
    const algorand = AlgorandClient.defaultLocalNet();
    const sender = await algorand.account.dispenserFromEnvironment();
    const client = await {{className}}.create(algorand, sender);
    expect(await client.hello(sender)).toBe("Hello, world!");
  });
});
