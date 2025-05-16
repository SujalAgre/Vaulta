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
    setTransaction: (transaction: TransferTransaction[] | ((prev: TransferTransaction[]) => TransferTransaction[])) => void;
    selectedAccount: Keypair | undefined;
    setSelectedAccount: (account: Keypair | undefined) => void;
};

function Transfer({ keypairs, setTransaction, selectedAccount, setSelectedAccount }: TransferProps) {

    const [url, setUrl] = useState("https://api.devnet.solana.com");
    const [publicKey, setPublicKey] = useState("");
    const [solAmt, setSolAmt] = useState<number>(0);
    const [balance, setBalance] = useState<number>(0);

    useEffect(() => {
        const getBalance = async () => {
            if (selectedAccount) {
                const connection = new Connection(url, 'confirmed');
                const bal = await connection.getBalance(selectedAccount.publicKey);
                setBalance(bal / LAMPORTS_PER_SOL);
            }
        };
        getBalance();
    }, [selectedAccount, url]);

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

        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: from.publicKey,
                toPubkey: to,
                lamports: solAmt * LAMPORTS_PER_SOL,
            })
        )

        const signature = await sendAndConfirmTransaction(connection, transaction, [from]);

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
        <>
            <div className="flex justify-center items-start flex-col h-152">
                <div className=" ml-8">
                    <p className="text-6xl">Transfer Sol</p>
                    <p className="text-lg text-neutral-300 font-mono">Transfer Sol to any Solana Address</p>
                </div>

                <div className="flex mt-4 ml-8 font-mono">
                    <div>
                        <Select onValueChange={handleAccountChange}>
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Account" />
                            </SelectTrigger>
                            <SelectContent className="bg-black text-white font-mono">
                                {keypairs.length === 0 ? (
                                    <SelectItem value="0">No accounts available</SelectItem>
                                ) : (
                                    keypairs.map((_, index) => (
                                        <SelectItem key={index} value={index.toString()}>Account {index + 1}</SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    </div>


                    <div className="ml-2">
                        <Select onValueChange={rpcURL}>
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Dev NET" />
                            </SelectTrigger>

                            <SelectContent className="bg-black text-white font-mono">
                                <SelectItem value="Main NET">Main NET</SelectItem>
                                <SelectItem value="Dev NET">Dev NET</SelectItem>
                                <SelectItem value="Test NET">Test NET</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex ml-5 justify-center items-center">
                        <p>{!selectedAccount ? "" : `Bal: ${balance} SOL`}</p>
                    </div>
                </div>

                <div className="flex justify-center items-center">
                    <div className="ml-8 mt-4 font-mono">

                        <div>
                            <label >Enter Solana Address</label>

                            <Input value={publicKey} className="w-lg mt-1" onChange={(event) => {

                                setPublicKey(event.target.value)

                            }} />
                        </div>

                        <div className="mt-4">
                            <label>Enter Amount</label>

                            <Input className="w-lg mt-1" onChange={(event) => {
                                setSolAmt(parseFloat(event.target.value))
                            }} />
                        </div>

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

                        }} className="mt-4">Send</Button>

                    </div>
                </div>

            </div>
        </>
    )
}

export default Transfer