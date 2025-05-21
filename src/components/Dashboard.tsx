import { useState } from "react";
import { Button } from "./ui/button";
import Transfer from "./Transfer";
import Transactions from "./Transactions"
import { Keypair } from "@solana/web3.js";
import Airdrop from "./Airdrop";

type TransferTransaction = {
    signature: string;
    from: string;
    to: string;
    amount: number;
    status: string;
    date: string;
    time: string;
    rpcURL: string;
};

type WalletListProps = {
    keypairs: Keypair[];
};

function Dashboard({ keypairs }: WalletListProps) {

    const [pageNumber, setPageNumber] = useState(1);
    const [selectedAccount, setSelectedAccount] = useState<Keypair | undefined>(undefined);
    const [transaction, setTransaction] = useState<TransferTransaction[]>([]);

    return (
        <>
            <div className="flex justify-evenly sm:flex-col md:flex-row">

                <Button className="cursor-pointer font-mono sm:w-86 md:w-xs opacity-40 hover:opacity-100 transition-opacity duration-200 mb-2" onClick={() => {
                    setPageNumber(1)
                }}>Transfer Sol</Button>

                <Button className="cursor-pointer font-mono sm:w-86 md:w-xs opacity-40 hover:opacity-100 transition-opacity duration-200 mb-2" onClick={() => {
                    setPageNumber(2)
                }}>Airdrop</Button>

                <Button className="cursor-pointer font-mono sm:w-86 md:w-xs opacity-40 hover:opacity-100 transition-opacity duration-200 mb-2" onClick={() => {
                    setPageNumber(3)
                }}>Transactions</Button>

            </div>

            {pageNumber === 1 && (
                <div>
                    <Transfer keypairs={keypairs} setTransaction={setTransaction} selectedAccount={selectedAccount} setSelectedAccount={setSelectedAccount}/>
                </div>
            )}

            {pageNumber === 2 && (
                <div>
                    <Airdrop keypairs={keypairs} selectedAccount={selectedAccount} setSelectedAccount={setSelectedAccount}/>
                </div>
            )}

            {pageNumber === 3 && (
                <div>
                    <Transactions transactions={transaction}/>
                </div>
            )}

        </>
    )
}

export default Dashboard