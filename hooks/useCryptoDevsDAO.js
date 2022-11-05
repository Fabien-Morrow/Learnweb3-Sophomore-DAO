import {
  useContractRead,
  useBalance,
  useContractInfiniteReads,
  useContractEvent,
} from "wagmi";
import {
  CRYPTODEVSDAO_GOERLI_ADDRESS,
  CRYPTODEVS_GOERLI_ADDRESS,
} from "../constants";
import CryptoDevsDAO from "../constants/CryptoDevsDAO.json";

const contractConfig = {
  address: CRYPTODEVSDAO_GOERLI_ADDRESS,
  abi: CryptoDevsDAO.abi,
};

export function useCryptoDevsDAO() {
  const { data: _balanceOfDAO } = useBalance({
    addressOrName: CRYPTODEVS_GOERLI_ADDRESS,
  });
  const balanceOfDAO = _balanceOfDAO?.formatted;

  const { data: numProposals } = useContractRead({
    ...contractConfig,
    functionName: "numProposals",
    select: (data) => data.toNumber(),
  });

  const {
    data: proposals,
    isRefetching,
    refetch,
  } = useContractInfiniteReads({
    enabled: Boolean(numProposals),
    contracts() {
      let proposals = [];
      for (let i = 0; i < numProposals; i++) {
        const proposal = {
          ...contractConfig,
          functionName: "proposals",
          args: [i],
        };
        proposals.push(proposal);
      }
      return proposals;
    },
    select: (rawData) => {
      console.log("je suis dans select");
      const rawProposals = rawData?.pages[0];
      const proposals = rawProposals.map((rawProposal) => {
        let date = new Date(0);
        date.setUTCSeconds(rawProposal[1]);
        let proposal = {
          nftId: rawProposal[0].toNumber(),
          deadline: date,
          yesVotes: rawProposal[2].toNumber(),
          noVotes: rawProposal[3].toNumber(),
          isExecuted: rawProposal[4],
        };
        return proposal;
      });
      return proposals;
    },
  });
  console.log("isRefetching :", isRefetching);

  useContractEvent({
    ...contractConfig,
    eventName: "NewProposal",
    listener(node, label, owner) {
      refetch();
    },
  });

  return { balanceOfDAO, numProposals, proposals, refetch };
}
