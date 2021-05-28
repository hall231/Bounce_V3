import { makeToken } from "./utils";

import { WETH9 } from "./weth9";

const tokenCache = {};

export const getEtherChain = (chainId: number) => {
	if (!tokenCache[chainId]) {
		tokenCache[chainId] = makeToken(
			chainId,
			"0x0000000000000000000000000000000000000000",
			18,
			"ETH",
			"Ether"
		);
	}

	return tokenCache[chainId];
};

export const getEtherChainWrapped = (chainId: number) => {
	return WETH9[chainId];
};
