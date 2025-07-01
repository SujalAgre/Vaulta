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
    isDarkMode: boolean
};

function Airdrop({ keypairs, isDarkMode }: AirdropProps) {

    const [count, setCount] = useState(0);
    const [selectedAccount, setSelectedAccount] = useState<Keypair | undefined>(undefined);

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
            <div className="flex justify-center items-center flex-col">

                <p className="sm:text-[45px] sb:text-7xl">Airdrop Solana</p>
                <p className="font-mono sm:text-sm sb:text-lg">Maximum of 2 requests every 8 hours</p>
                <p className="sm:text-sm sb:text-base font-mono mt-2">Get 1 SOL in your address.</p>


                <div className="flex mt-3 font-mono items-center sm:justify-evenly sb:justify-between  sm:w-full sb:w-[80%]">
                    <Select onValueChange={handleAccountChange}>
                        <SelectTrigger className={`sm:w-[45%] sb:w-[48%] cursor-pointer rounded-xl p-5 ${isDarkMode? '' : 'data-[placeholder]:text-neutral-500'}`}>
                            <SelectValue placeholder="Account" />
                        </SelectTrigger>
                        <SelectContent className={`bg-black text-white rounded-xl font-mono cursor-pointer ${isDarkMode ? '' : 'text-black bg-white '}`}>
                            {keypairs.length === 0 ? (
                                <SelectItem value="0" className={`${isDarkMode ? '' : 'focus:text-black focus:bg-[#eeeeee]'} cursor-pointer`}>No accounts available</SelectItem>
                            ) : (
                                keypairs.map((_, index) => (
                                    <SelectItem key={index} value={index.toString()} className={`${isDarkMode ? '' : 'focus:text-black focus:bg-[#eeeeee]'} cursor-pointer`}>Account {index + 1}</SelectItem>
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

                    <Button className={`sm:w-[45%] sb:w-[48%] cursor-pointer rounded-xl p-5 border-1 ${isDarkMode ? '' : ' border-1 bg-[#ececec] text-black hover:bg-[#e6e6e6]'}`} onClick={requestAirdrop} disabled={count >= 2}>Request</Button>
                </div>


            </div>
        </>
    )
}

export default Airdrop;
