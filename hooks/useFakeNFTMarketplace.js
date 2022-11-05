import { useContractRead } from "wagmi";
import FAKENFTMARKETPLACE from "../constants";
import FakeNFTMarketplace from "../constants/FakeNFTMarketplace.json";

export function useFakeNFTMarketplace(nft) {
  const { data: priceNFT } = useContractRead({
    address: FAKENFTMARKETPLACE,
    abi: FakeNFTMarketplace.abi,
    functionName: "getPrice",
    select: (data) => data.toNumber(),
  });

  console.log(priceNFT);
  return priceNFT;
}
