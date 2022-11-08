import { useState } from "react";
import Image from "next/image";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  useAccount,
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";

import { CRYPTODEVSDAO_GOERLI_ADDRESS } from "../constants";
import CryptoDevsDAO from "../constants/CryptoDevsDAO.json";

import styles from "../styles/Home.module.css";

import { useCryptoDevs } from "../hooks/useCryptoDevs";
import { useCryptoDevsDAO } from "../hooks/useCryptoDevsDAO";
import { useHasMounted } from "../hooks/useHasMounted";

function ShowInfos({ address }) {
  const data = useCryptoDevs(address);
  const { balanceOfDAO, numProposals } = useCryptoDevsDAO();
  return (
    <>
      <div>You own {data} CryptoDevs NFTs.</div>
      <div>DAO balance is {balanceOfDAO} Ether.</div>
      <div>There is currently {numProposals} proposals</div>
    </>
  );
}

function CreateProposal() {
  const [selectedNft, setSelectedNft] = useState();
  const { config } = usePrepareContractWrite({
    address: CRYPTODEVSDAO_GOERLI_ADDRESS,
    abi: CryptoDevsDAO.abi,
    functionName: "createProposal",
    args: [selectedNft],
    enabled: Boolean(selectedNft),
  });
  const { data, write } = useContractWrite(config);
  const { isLoading, status } = useWaitForTransaction({
    hash: data?.hash,
  });
  const nfts = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const wrappedNfts = nfts.map((nft) => (
    <option key={nft} value={nft}>
      {nft}
    </option>
  ));
  return (
    <div>
      <label htmlFor="nft-select">Choose an nft:</label>
      <select
        name="nfts"
        id="nft-select"
        onChange={(event) => setSelectedNft(event.target.value)}
      >
        <option value="">---</option>
        {wrappedNfts}
      </select>
      <button className={styles.button} onClick={() => write()}>
        {isLoading ? "Loading..." : "Create a proposal"}
      </button>
      <div> tx Status : {status}</div>
      {data?.hash && (
        <div>
          Check tx on{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`https://goerli.etherscan.io//tx/${data?.hash}`}
          >
            Etherscan
          </a>
        </div>
      )}
    </div>
  );
}

function ShowProposal({ proposal, index }) {
  const { config } = usePrepareContractWrite({
    address: CRYPTODEVSDAO_GOERLI_ADDRESS,
    abi: CryptoDevsDAO.abi,
    functionName: "voteOnProposal",
    args: [0],
  });
  const { data: dataYes, write: voteYes } = useContractWrite(config);

  const { config2 } = usePrepareContractWrite({
    address: CRYPTODEVSDAO_GOERLI_ADDRESS,
    abi: CryptoDevsDAO.abi,
    functionName: "voteOnProposal",
    args: [1],
  });
  const { data: dataNo, write: voteNo } = useContractWrite(config2);

  const { isLoading, status } = useWaitForTransaction({
    hash: dataYes?.hash || dataNo?.hash,
  });

  return (
    <div key={proposal.deadline} className={styles.proposalContainer}>
      <div>PROPOSAL N°{index}</div>
      <div>Nft proposed : Nft N°{proposal.nftId}</div>
      <div>You can vote until {proposal.deadline.toLocaleString()}</div>
      <div>I'm in : {proposal.yesVotes}</div>
      <div>No, thanks : {proposal.noVotes}</div>
      <div>This proposal is {proposal.isExecuted ? "inactive" : "active"}</div>
      {/* <button className={styles.button} onClick={() => voteYes()}>
        Vote Yes
      </button>
      <button className={styles.button} onClick={() => voteNo()}>
        Vote No
      </button> */}
    </div>
  );
}

function ViewProposals() {
  const { proposals, isRefetching } = useCryptoDevsDAO();
  const wrappedProposals = proposals?.map((proposal, index) => {
    return (
      <ShowProposal key={proposal.deadline} proposal={proposal} index={index} />
    );
  });
  // console.log(isRefetching);
  return (
    <div>
      <div>List of proposals :</div>
      {wrappedProposals}
    </div>
  );
}

export default function Home() {
  const { hasMounted } = useHasMounted();
  const { isConnected, address } = useAccount();
  return (
    <div className={styles.appContainer}>
      <div className={styles.contentContainer}>
        <h1 className={styles.title}>Welcome to CryptoDevs DAO !</h1>
        <ConnectButton />
        {hasMounted && isConnected && <ShowInfos address={address} />}
        {hasMounted && isConnected && <CreateProposal />}
        {hasMounted && <ViewProposals />}
      </div>
      <div className={styles.nftContainer}>
        <Image src="/0.svg" width="423" height="532" alt="CryptoDevs Img" />
      </div>
    </div>
  );
}
