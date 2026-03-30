import { SendingAddress } from "@algorandfoundation/algokit-utils/transact";
import {
  {{className}}Client,
  {{className}}Factory,
} from "../contracts/clients/{{className}}Client";
import {
  AlgorandClient,
  ReadableAddress,
} from "@algorandfoundation/algokit-utils";

export class {{className}} {
  appClient: {{className}}Client;

  constructor(algorand: AlgorandClient, appId: bigint) {
    this.appClient = algorand.client.getTypedAppClientById({{className}}Client, {
      appId,
    });
  }

  static async create(algorand: AlgorandClient, creator: SendingAddress) {
    const factory = algorand.client.getTypedAppFactory({{className}}Factory, {});

    const result = await factory.send.create.bare({ sender: creator });

    return new {{className}}(algorand, result.appClient.appId);
  }

  async hello(sender: SendingAddress): Promise<string> {
    const { return: message } = await this.appClient.send.hello({
      sender,
      args: {},
    });

    if (message === undefined) {
      throw new Error("Contract returned undefined");
    }

    return message;
  }
}
