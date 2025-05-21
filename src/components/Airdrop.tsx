import { Keypair, Connection, clusterApiUrl, LAMPORTS_PER_SOL } from "@solana/web3.js";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../components/ui/select"
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useState } from "react";
type AirdropProps = {
    keypairs: Keypair[];
    selectedAccount: Keypair | undefined;
    setSelectedAccount: (account: Keypair | undefined) => void;
};

function Airdrop({ keypairs, selectedAccount, setSelectedAccount }: AirdropProps) {

    const [count, setCount] = useState(0);

    function handleAccountChange(value: string) {
        const index = parseInt(value);
        setSelectedAccount(keypairs[index]);
    }

    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

    async function requestAirdrop() {
        if (!selectedAccount) return;

        setCount(count + 1);
        console.log(count);

        const airdropSignature = await connection.requestAirdrop(
            selectedAccount.publicKey,
            LAMPORTS_PER_SOL
        );
        await connection.confirmTransaction(airdropSignature);
        toast.success('Airdrop requested successfully');
    }

    return (
        <>
            <div className="flex justify-center items-start flex-col md:h-140 sm:mt-13">
                <div className="md:ml-8">
                    <p className="sm:text-5xl md:text-6xl">Airdrop Solana</p>
                    <p className="font-mono sm:text-base md:text-lg">Maximum of 2 requests every 8 hours</p>
                    <p className="text-base text-neutral-300 font-mono mt-2">Get 1 SOL in your address.</p>
                </div>

                <div className="flex md:ml-8 mt-3 font-mono">
                    <Select onValueChange={handleAccountChange}>
                        <SelectTrigger className="w-[140px] cursor-pointer">
                            <SelectValue placeholder="Account" />
                        </SelectTrigger>
                        <SelectContent className="bg-black text-white font-mono cursor-pointer">
                            {keypairs.length === 0 ? (
                                <SelectItem value="0" className="cursor-pointer">No accounts available</SelectItem>
                            ) : (
                                keypairs.map((_, index) => (
                                    <SelectItem key={index} value={index.toString()} className="cursor-pointer">Account {index + 1}</SelectItem>
                                ))
                            )}
                        </SelectContent>
                    </Select>

                    {/* <div className="ml-2">
                        <Select onValueChange={(value) => {
                            setAmt(parseInt(value));
                            console.log(Amt);
                        }}>
                            <SelectTrigger className="w-[100px]">
                                <SelectValue placeholder="Amout" />
                            </SelectTrigger>
                            <SelectContent className="bg-black text-white font-mono">
                                <SelectItem value="1">1 SOL</SelectItem>
                                <SelectItem value="2">2 SOL</SelectItem>
                                <SelectItem value="5">5 SOL</SelectItem>
                                <SelectItem value="10">10 SOL</SelectItem>
                            </SelectContent>
                        </Select>
                    </div> */}

                </div>

                <Button className="md:ml-8 mt-3 font-mono cursor-pointer" onClick={requestAirdrop} disabled={count >= 2}>Request Airdrop</Button>

            </div>
        </>
    )
}

export default Airdrop;
