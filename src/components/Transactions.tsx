import { Link } from "react-router-dom";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "../components/ui/accordion"

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

type TransactionsProps = {
    transactions: TransferTransaction[];
};

function Transactions({ transactions }: TransactionsProps) {


    return (
        <div className="flex items-center flex-col overflow-scroll transaction-custom-scrollbar">
            {transactions.length === 0 ? (
                <div className="h-[98%] w-full justify-center items-center flex">
                    <p className="sm:text-4xl sb:text-7xl">No transactions</p>
                </div>

            ) : ([...transactions].reverse().map((transaction, index) => {
                return (
                    <Accordion type="single" collapsible key={index} className="flex font-mono mt-4">
                        <AccordionItem value="item-1">
                            <AccordionTrigger className="cursor-pointer sm:hidden md:flex">Sent {transaction.amount} SOL on {transaction.date} at {transaction.time}</AccordionTrigger>
                            <AccordionTrigger className="cursor-pointer sm:flex md:hidden">Sent {transaction.amount} SOL on {transaction.date}</AccordionTrigger>

                            <AccordionContent>
                                <div className="flex items-start flex-col font-mono">
                                    <Link className="sm:flex md:hidden" to={`https://explorer.solana.com/tx/${transaction.signature}${transaction.rpcURL === "https://api.devnet.solana.com" ? "?cluster=devnet" : transaction.rpcURL === "https://api.testnet.solana.com" ? "?cluster=testnet" : ""}`} target="_blank">
                                        <p className="text-blue-500">Explorer.solana.com</p>
                                    </Link>

                                    <Link className="sm:hidden md:flex" to={`https://explorer.solana.com/tx/${transaction.signature}${transaction.rpcURL === "https://api.devnet.solana.com" ? "?cluster=devnet" : transaction.rpcURL === "https://api.testnet.solana.com" ? "?cluster=testnet" : ""}`} target="_blank">
                                        Signature:
                                        <p className="text-blue-500 ml-2">
                                            {transaction.signature}

                                        </p>

                                    </Link>
                                    <p className="sm:hidden md:block">From: {transaction.from}</p>
                                    <p className="sm:hidden md:block">To: {transaction.to}</p>
                                    <p >Amount: {transaction.amount}</p>
                                    <p >Status: {transaction.status}</p>
                                    <p >RPC URL: {transaction.rpcURL}</p>
                                </div>

                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>



                )
            }))
            }
        </div>
    )
}

export default Transactions;
