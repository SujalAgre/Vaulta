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

type Props = {
    keypairs: Keypair[];
    dashPageNumber: number;
    setDashPageNumber: (page: number) => void;
    transactions: TransferTransaction[];
    setTransaction: (transaction: TransferTransaction[] | ((prev: TransferTransaction[]) => TransferTransaction[])) => void;
    isDarkMode: boolean
};

function Dashboard({ keypairs, dashPageNumber, setDashPageNumber, transactions, setTransaction, isDarkMode }: Props) {


    return (
        <>
            <div className="sm:hidden sb:flex justify-evenly flex-row pt-4 pb-4 ">

                <button className="cursor-pointer font-mono hover:underline" onClick={() => {
                    setDashPageNumber(1)
                }}>Transfer Sol</button>

                <button className="cursor-pointer font-mono hover:underline" onClick={() => {
                    setDashPageNumber(2)
                }}>Airdrop</button>

                <button className="cursor-pointer font-mono hover:underline" onClick={() => {
                    setDashPageNumber(3)

                }}>Transactions</button>

            </div>

            {dashPageNumber === 1 && (
                <div className="sm:h-screen sb:h-[85%] justify-center items-center flex">
                    <Transfer keypairs={keypairs} transaction={transactions} setTransaction={setTransaction} isDarkMode={isDarkMode} />
                </div>
            )}

            {dashPageNumber === 2 && (
                <div className="sm:h-screen sb:h-[85%] justify-center items-center flex">
                    <Airdrop keypairs={keypairs} isDarkMode={isDarkMode}/>
                </div>
            )}

            {dashPageNumber === 3 && (
                <div className="sm:h-screen sb:h-[85%] justify-center flex">
                    <Transactions transactions={transactions} />
                </div>
            )}

        </>
    )
}


export default Dashboard