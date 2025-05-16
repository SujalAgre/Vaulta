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
        <div className="flex items-center flex-col h-full mt-10">
            {transactions.length === 0 ? (
                <div className="flex justify-center items-center h-130">
                    <p className="text-6xl">No transactions</p>
                </div>

            ) : ([...transactions].reverse().map((transaction, index) => {
                return (
                    <Accordion type="single" collapsible key={index} className="flex w-250 justify-center items-center mt-3 font-mono">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>Sent {transaction.amount} SOL on {transaction.date} at {transaction.time}</AccordionTrigger>
                            <AccordionContent>
                                <div className="flex justify-center items-start flex-col font-mono w-250">

                                    <Link to={`https://explorer.solana.com/tx/${transaction.signature}${transaction.rpcURL === "https://api.devnet.solana.com" ? "?cluster=devnet" : transaction.rpcURL === "https://api.testnet.solana.com" ? "?cluster=testnet" : ""}`} className="flex" target="_blank">
                                            Signature:
                                            <p className="text-blue-500 ml-2">
                                                {transaction.signature}
                                            </p>
                                        
                                    </Link>
                                    <p>From: {transaction.from}</p>
                                    <p>To: {transaction.to}</p>
                                    <p>Amount: {transaction.amount}</p>
                                    <p>Status: {transaction.status}</p>
                                    <p>RPC URL: {transaction.rpcURL}</p>
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
