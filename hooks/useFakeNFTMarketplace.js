import { useContractRead } from "wagmi";
import FAKENFTMARKETPLACE_GOERLI_ADDRESS from "../constants";
import FakeNFTMarketplace from "../constants/FakeNFTMarketplace.json";

export function useFakeNFTMarketplace(nft) {
  const {
    data: priceNFT,
    error,
    status,
  } = useContractRead({
    address: FAKENFTMARKETPLACE_GOERLI_ADDRESS,
    abi: FakeNFTMarketplace.abi,
    functionName: "getPrice",
    select: (data) => data.toNumber(),
  });
  const { data: isAvailable, error: error2 } = useContractRead({
    address: FAKENFTMARKETPLACE_GOERLI_ADDRESS,
    abi: FakeNFTMarketplace.abi,
    functionName: "available",
    enabled: Boolean(nft),
    args: [nft],
  });

  return { priceNFT, isAvailable };
}
