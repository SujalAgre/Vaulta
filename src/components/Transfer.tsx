import { useState, useEffect } from "react";
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction } from "@solana/web3.js";

import { toast } from "sonner";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../components/ui/select"

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

type TransferProps = {
    keypairs: Keypair[];
    transaction: TransferTransaction[]
    setTransaction: (transaction: TransferTransaction[] | ((prev: TransferTransaction[]) => TransferTransaction[])) => void;
    isDarkMode: boolean
};

function Transfer({ keypairs, transaction, setTransaction, isDarkMode }: TransferProps) {

    const [url, setUrl] = useState("https://api.devnet.solana.com");
    const [publicKey, setPublicKey] = useState("");
    const [selectedAccount, setSelectedAccount] = useState<Keypair | undefined>(undefined);
    const [solAmt, setSolAmt] = useState<number>(0);
    const [balance, setBalance] = useState<number>(0);

    useEffect(() => {
        localStorage.setItem('transactions', JSON.stringify(transaction));
    }, [transaction]);


    useEffect(() => {
        getBalance();
    }, [selectedAccount, url]);

    async function getBalance() {
        if (selectedAccount) {
            const connection = new Connection(url, 'confirmed');
            const bal = await connection.getBalance(selectedAccount.publicKey);
            setBalance(bal / LAMPORTS_PER_SOL);
        }
    };

    const transferSol = async () => {
        if (!selectedAccount) {
            toast.error("Please select an account first");
            return "No account selected";
        }

        if (!publicKey) {
            toast.error("Please enter a public key");
            return "No public key provided";
        }

        if (!solAmt) {
            toast.error("Please enter an amount");
            return "No amount provided";
        }

        if (solAmt >= balance) {
            toast.error("Insufficient balance");
            return "Insufficient balance";
        }

        const connection = new Connection(url, 'confirmed')
        const from = Keypair.fromSecretKey(selectedAccount.secretKey);
        const to = new PublicKey(publicKey);

        const solTransaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: from.publicKey,
                toPubkey: to,
                lamports: solAmt * LAMPORTS_PER_SOL,
            })
        )

        const signature = await sendAndConfirmTransaction(connection, solTransaction, [from]);

        if (signature) {
            toast.success("Transaction successful");
        }

        const newTransaction: TransferTransaction = {
            signature: signature,
            from: from.publicKey.toBase58(),
            to: to.toBase58(),
            amount: solAmt,
            status: "success",
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString(),
            rpcURL: url
        };

        setTransaction((prevTransaction: TransferTransaction[]) => [...prevTransaction, newTransaction]);


        return signature;
    }

    const rpcURL = (value: string) => {

        switch (value) {
            case "Main NET":
                setUrl('https://api.mainnet-beta.solana.com')
                toast("RPC URL: api.mainnet-beta.solana.com ✅")
                break;
            case "Dev NET":
                setUrl('https://api.devnet.solana.com')
                toast("RPC URL: api.devnet.solana.com ✅")
                break;
            case "Test NET":
                setUrl('https://api.testnet.solana.com')
                toast("RPC URL: api.testnet.solana.com ✅")
                break;
            default:
                break;
        }
    }


    function handleAccountChange(value: string) {
        const index = parseInt(value);
        setSelectedAccount(keypairs[index]);
    }

    return (

        <div className="flex justify-center items-center flex-col">
            <p className="sm:text-[45px] sb:text-7xl leading-none">Transfer Sol</p>
            <p className="sm:text-sm md:text-lg font-mono">Transfer Sol to any Solana Address</p>


            <div className="flex w-full justify-between mt-3 font-mono">

                <Select onValueChange={handleAccountChange}>
                    <SelectTrigger className={`w-[48%] cursor-pointer rounded-xl p-5 ${isDarkMode? '' : 'data-[placeholder]:text-neutral-500'}`}>
                        <SelectValue placeholder="Account"/>
                    </SelectTrigger>
                    <SelectContent className={`bg-black text-white rounded-xl font-mono cursor-pointer ${isDarkMode ? '' : 'text-black bg-white '}`}>
                        {keypairs.length === 0 ? (
                            <SelectItem value="0" className={`${isDarkMode ? '' : 'focus:text-black focus:bg-[#eeeeee]'} cursor-pointer`}>No accounts</SelectItem>
                        ) : (
                            keypairs.map((_, index) => (
                                <SelectItem key={index} value={index.toString()} className={`${isDarkMode ? '' : 'focus:text-black focus:bg-[#eeeeee]'} cursor-pointer`}>Account {index + 1}</SelectItem>
                            ))
                        )}
                    </SelectContent>
                </Select>

                <Select onValueChange={rpcURL}>
                    <SelectTrigger className={`w-[48%] cursor-pointer rounded-xl p-5 ${isDarkMode? '' : 'data-[placeholder]:text-neutral-500'}`}>
                        <SelectValue placeholder="Network" />
                    </SelectTrigger>

                    <SelectContent className={`bg-black text-white rounded-xl font-mono cursor-pointer ${isDarkMode ? '' : 'text-black bg-white '}`}>
                        <SelectItem value="Main NET" className={`${isDarkMode ? '' : 'focus:text-black focus:bg-[#eeeeee]'} cursor-pointer`}>Main NET</SelectItem>
                        <SelectItem value="Dev NET" className={`${isDarkMode ? '' : 'focus:text-black focus:bg-[#eeeeee]'} cursor-pointer`}>Dev NET</SelectItem>
                        <SelectItem value="Test NET" className={`${isDarkMode ? '' : 'focus:text-black focus:bg-[#eeeeee]'} cursor-pointer`}>Test NET</SelectItem>
                    </SelectContent>
                </Select>

            </div>

            <div className="flex justify-center items-center flex-col w-full mt-4">

                <Input value={publicKey} className="rounded-xl p-5 font-mono" placeholder="Recipient's Address" onChange={(event) => {

                    setPublicKey(event.target.value)

                }} />



                {/* <label>Enter Amount</label> */}

                <div className="mt-4 flex w-full">
                    <Input className="rounded-xl p-5 font-mono" placeholder="Amount" onChange={(event) => {
                        setSolAmt(parseFloat(event.target.value))
                    }} />


                    <Button onClick={async () => {
                        const result = await transferSol();

                        if (result === "No account selected") {
                            toast.error("Please select an account first");
                        } else if (result === "No public key provided") {
                            toast.error("Please enter a public key");
                        } else if (result === "No amount provided") {
                            toast.error("Please enter an amount");
                        } else if (result === "Insufficient balance") {
                            toast.error("Insufficient balance");
                        }

                    }} className={`ml-3 p-5 border-1 font-mono rounded-xl flex cursor-pointer ${isDarkMode ? '' : ' border-1 bg-[#ececec] text-black hover:bg-[#e6e6e6]'}`}>Send</Button>
                </div>

            </div>

            <div className="mt-4 font-mono justify-center items-center">
                <p>{!selectedAccount ? "" : `Bal: ${balance} SOL`}</p>
            </div>

        </div>

    )
}

export default Transfer