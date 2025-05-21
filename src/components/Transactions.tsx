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

    const copyToClipboard = (copy: string) => {
        navigator.clipboard.writeText(copy)
    }

    return (
        <div className="flex items-center flex-col">
            {transactions.length === 0 ? (
                <div className="flex justify-center items-center md:h-130">
                    <p className="sm:text-5xl md:text-6xl sm:mt-40">No transactions</p>
                </div>

            ) : ([...transactions].reverse().map((transaction, index) => {
                return (
                    <Accordion type="single" collapsible key={index} className="sm:ml-1 flex sm:w-screen md:w-250 md:justify-center items-center md:mt-3 font-mono">
                        <AccordionItem value="item-1">
                            <AccordionTrigger className="cursor-pointer">Sent {transaction.amount} SOL on {transaction.date} at {transaction.time}</AccordionTrigger>
                            
                            <AccordionContent>
                                <div className="flex justify-center items-start flex-col font-mono sm:w-70 md:w-250">
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
