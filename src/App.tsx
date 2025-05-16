import { useState } from "react";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { Keypair } from "@solana/web3.js";
import { derivePath } from "ed25519-hd-key";
import nacl from "tweetnacl";
import bs58 from "bs58"

import { Checkbox } from "./components/ui/checkbox";
import { Button } from "./components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./components/ui/accordion"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./components/ui/alert-dialog"

import Dashboard from "./components/Dashboard";

type Dashboard = {
  keypair: Keypair[];
};

function App() {
  const [pageNumber, setPageNumber] = useState(1);

  const [seedPhrase, setSeedPhrase] = useState<string>('');
  const [recoveryPhrase, setRecoveryPhrase] = useState(['']);

  const [keypairs, setKeypairs] = useState<Keypair[]>([]);
  const [walletIndex, setWalletIndex] = useState(0);

  const [checked, setChecked] = useState(false);

  const seed = mnemonicToSeedSync(seedPhrase);

  const handleGenerate = () => {
    const mnemonic = generateMnemonic(256); //generating mnemonic
    setRecoveryPhrase(mnemonic.split(" "));
    setSeedPhrase(mnemonic) //setting mnemonic to seedphrase in app.tsx
    setPageNumber(2)
  }

  const path = `m/44'/501'/${walletIndex}'/0'`

  const createWallet = async () => {
    const derivedSeed = derivePath(path, seed.toString("hex")).key
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    const newKeypair = Keypair.fromSecretKey(secret);
    setKeypairs(newKeypair ? (prevKeypairs) => [...prevKeypairs, newKeypair] : newKeypair);

    setWalletIndex(walletIndex + 1);
  }

  const copyToClipboard = (copy: string) => {
    navigator.clipboard.writeText(copy)
  }

  return (
    <>
      {pageNumber === 1 && (
        <div className="flex justify-center items-center h-screen w-screen flex-col">
          <img src="/wallet-only.png" alt="wallet" className="w-18 h-15" />
          <p className="text-6xl">Create a new wallet</p>
          <p className="text-base font-mono">Do not share recovery phrase with anyone.</p>
          <Button className="mt-4 font-mono" onClick={handleGenerate}>
            Generate Recovery Phrase
          </Button>
        </div>
      )}

      {pageNumber === 2 && (
        <div className="w-screen h-screen flex justify-center items-center flex-col">
          <p className="text-6xl mb-2">Secret recovery phrase</p>
          <p className="font-mono text-sm">This is the only way to recover your account if you lose your device.</p>
          <p className="font-mono text-sm mb-4">Write it down and store it in a safe place.</p>

          <table className="font-mono">
            <tbody>
              <tr>
                <td className="border border-gray-500 w-30 h-10 text-center">1. {recoveryPhrase[0]}</td>
                <td className="border border-gray-500 w-30 h-10 text-center">2. {recoveryPhrase[1]}</td>
                <td className="border border-gray-500 w-30 h-10 text-center">3. {recoveryPhrase[2]}</td>
                <td className="border border-gray-500 w-30 h-10 text-center">4. {recoveryPhrase[3]}</td>
                <td className="border border-gray-500 w-30 h-10 text-center">5. {recoveryPhrase[4]}</td>
                <td className="border border-gray-500 w-30 h-10 text-center">6. {recoveryPhrase[5]}</td>
              </tr>
              <tr>
                <td className="border border-gray-500 w-30 h-10 text-center">7. {recoveryPhrase[6]}</td>
                <td className="border border-gray-500 w-30 h-10 text-center">8. {recoveryPhrase[7]}</td>
                <td className="border border-gray-500 w-30 h-10 text-center">9. {recoveryPhrase[8]}</td>
                <td className="border border-gray-500 w-30 h-10 text-center">10. {recoveryPhrase[9]}</td>
                <td className="border border-gray-500 w-30 h-10 text-center">11. {recoveryPhrase[10]}</td>
                <td className="border border-gray-500 w-30 h-10 text-center">12. {recoveryPhrase[11]}</td>
              </tr>
              <tr>
                <td className="border border-gray-500 w-30 h-10 text-center">13. {recoveryPhrase[12]}</td>
                <td className="border border-gray-500 w-30 h-10 text-center">14. {recoveryPhrase[13]}</td>
                <td className="border border-gray-500 w-30 h-10 text-center">15. {recoveryPhrase[14]}</td>
                <td className="border border-gray-500 w-30 h-10 text-center">16. {recoveryPhrase[15]}</td>
                <td className="border border-gray-500 w-30 h-10 text-center">17. {recoveryPhrase[16]}</td>
                <td className="border border-gray-500 w-30 h-10 text-center">18. {recoveryPhrase[17]}</td>
              </tr>
              <tr>
                <td className="border border-gray-500 w-30 h-10 text-center">19. {recoveryPhrase[18]}</td>
                <td className="border border-gray-500 w-25 h-10 text-center">20. {recoveryPhrase[19]}</td>
                <td className="border border-gray-500 w-30 h-10 text-center">21. {recoveryPhrase[20]}</td>
                <td className="border border-gray-500 w-30 h-10 text-center">22. {recoveryPhrase[21]}</td>
                <td className="border border-gray-500 w-30 h-10 text-center">23. {recoveryPhrase[22]}</td>
                <td className="border border-gray-500 w-30 h-10 text-center">24. {recoveryPhrase[23]}</td>
              </tr>
            </tbody>
          </table>
          <div className="flex items-center mt-5">
            <Checkbox id="saved" checked={checked} onCheckedChange={(val) => setChecked(val === true)} />
            <label htmlFor="saved" className="ml-2">I saved my secret recovery phrase</label>
          </div>
          <Button className="font-mono mt-5" disabled={!checked} onClick={() => {
            setPageNumber(3)
          }}>Next</Button>
        </div>
      )}

      {pageNumber === 3 && (
        
        <div className="flex h-screen w-screen">
          <div className="w-64 bg-zinc-950 text-white flex flex-col p-4">
            <Button className="text-lg" onClick={() => {
              createWallet()
            }}>Create new account</Button>

            {keypairs.map((pair, index) => (
              <Accordion key={pair.publicKey.toBase58()} type="single" collapsible className="font-mono mt-1">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="ml-2">Account {index + 1}</AccordionTrigger>
                  <AccordionContent>

                    <Button className="w-full" onClick={() => {
                      copyToClipboard(pair.publicKey.toBase58())
                      toast("Public key copied to clipboard ✅")
                    }}>Public Key</Button>

                    <AlertDialog>
                      <AlertDialogTrigger className="bg-primary text-white w-full mt-2 h-9 px-4 py-2 rounded-md hover:bg-primary/90">Private Key</AlertDialogTrigger>
                      <AlertDialogContent className="font-mono">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Warning!</AlertDialogTitle>
                          <AlertDialogDescription>
                            Do not share your private key with anyone!
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogAction onClick={() => {
                            copyToClipboard(bs58.encode(pair.secretKey))
                            toast("Private key copied to clipboard ✅")
                          }}>Copy to clipboard</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              
            ))}

          </div>
          

          {/* Main Content */}
          <div className="flex-1 p-4">
            <Dashboard keypairs={keypairs}/>
          </div>
        </div>
        
      )}
    </>
  )
}

export default App
