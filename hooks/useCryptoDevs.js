import { useContractRead } from "wagmi";
import CryptoDevs from "../constants/CryptoDevs.json";
import { CRYPTODEVS_GOERLI_ADDRESS } from "../constants";

export function useCryptoDevs(address) {
  const { data } = useContractRead({
    address: CRYPTODEVS_GOERLI_ADDRESS,
    abi: CryptoDevs.abi,
    functionName: "balanceOf",
    args: address ? [address] : [],
    enabled: Boolean(address),
    select: (data) => data.toNumber(),
  });

  return data;
}
