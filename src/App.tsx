import { JSX, useEffect, useState } from "react";
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
import { toast, Toaster } from "sonner"
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

function App() {
  const [pageNumber, setPageNumber] = useState(1);
  const [dashPageNumber, setDashPageNumber] = useState(1);

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [seedPhrase, setSeedPhrase] = useState<string>('');
  const [keypairs, setKeypairs] = useState<Keypair[]>([]);
  const [pathIndex, setPathIndex] = useState(0);

  const [checked, setChecked] = useState(false);

  const seed = mnemonicToSeedSync(seedPhrase);

  const [transaction, setTransaction] = useState<TransferTransaction[]>([]);

  useEffect(() => {
    const rawLocalKeypairs = JSON.parse(localStorage.getItem('keypairs')!);

    if (rawLocalKeypairs) {
      const localKeypairs = rawLocalKeypairs.map((item: { secretKey: number[] }) => Keypair.fromSecretKey(Uint8Array.from(item.secretKey)))
      setKeypairs(localKeypairs)
      setPageNumber(3);
    }

    const transactions = JSON.parse(localStorage.getItem('transactions')!)
    if (transactions) {
      setTransaction(transactions)
    }

    const seedPhrase = localStorage.getItem('seedphrase')
    if (seedPhrase) {
      setSeedPhrase(seedPhrase);
    }

    const pathIndex = parseInt(localStorage.getItem('pathIndex')!)
    if (pathIndex) {
      setPathIndex(pathIndex)
    }

    // const savedTheme = localStorage.getItem('theme') || 'light';
    // setIsDarkMode(savedTheme === 'dark');
  }, [])


  const handleGenerate = () => {
    const mnemonic = generateMnemonic(256); //generating mnemonic
    setSeedPhrase(mnemonic) //setting mnemonic to seedphrase in app.tsx
    localStorage.setItem('seedphrase', seedPhrase)
    setPageNumber(2)
  }

  const path = `m/44'/501'/${pathIndex}'/0'`

  const createAccount = () => {
    const derivedSeed = derivePath(path, seed.toString("hex")).key
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    const newKeypair = Keypair.fromSecretKey(secret);

    setKeypairs((prevKeypairs) => {
      const updated = [...prevKeypairs, newKeypair];
      localStorage.setItem('keypairs', JSON.stringify(
        updated.map((kp) => ({
          secretKey: Array.from(kp.secretKey)
        }))
      ))
      return updated
    });
    setPathIndex(pathIndex + 1);
    localStorage.setItem('pathIndex', JSON.stringify(pathIndex))
    console.log(keypairs)
  }

  const deleteAccount = (index: number) => {
    const updatedKeypairs = keypairs.filter((_, i) => i !== index)

    localStorage.setItem('keypairs', JSON.stringify(
      updatedKeypairs.map((kp) => ({
        secretKey: Array.from(kp.secretKey)
      }))
    ))

    setKeypairs(updatedKeypairs)
    console.log(keypairs)
  }

  const copyToClipboard = (copy: string) => {
    navigator.clipboard.writeText(copy)
  }

  return (
    <div className={`${isDarkMode ? '' : 'bg-white text-black'}`}>
      <Toaster theme={isDarkMode ? 'dark' : 'light'} />
      <button
        className="fixed sm:top-6 sb:top-4 right-6 z-50 text-white rounded-md cursor-pointer outline-0"
        onClick={() => {
          setIsDarkMode(!isDarkMode);
          // localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        }}
      >

        {isDarkMode ? <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
          <path d="M600-640 480-760l120-120 120 120-120 120Zm200 120-80-80 80-80 80 80-80 80ZM483-80q-84 0-157.5-32t-128-86.5Q143-253 111-326.5T79-484q0-146 93-257.5T409-880q-18 99 11 193.5T520-521q71 71 165.5 100T879-410q-26 144-138 237T483-80Zm0-80q88 0 163-44t118-121q-86-8-163-43.5T463-465q-61-61-97-138t-43-163q-77 43-120.5 118.5T159-484q0 135 94.5 229.5T483-160Zm-20-305Z" />
        </svg> : <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M480-280q-83 0-141.5-58.5T280-480q0-83 58.5-141.5T480-680q83 0 141.5 58.5T680-480q0 83-58.5 141.5T480-280ZM200-440H40v-80h160v80Zm720 0H760v-80h160v80ZM440-760v-160h80v160h-80Zm0 720v-160h80v160h-80ZM256-650l-101-97 57-59 96 100-52 56Zm492 496-97-101 53-55 101 97-57 59Zm-98-550 97-101 59 57-100 96-56-52ZM154-212l101-97 55 53-97 101-59-57Z" /></svg>}

      </button>
      <a href="https://github.com/SujalAgre/vaulta" target="_blank" className="absolute bottom-2 right-4 underline font-mono">GitHub</a>
      {pageNumber === 1 && (
        <div className={`flex sm:h-[86vh] justify-center items-center md:h-screen w-screen flex-col overflow-hidden  `}>
          <img src={`${isDarkMode ? 'wallet-icon-w.png' : 'wallet-icon-b.png'}`} draggable='false' alt="wallet" className="h-25 mb-3" />
          <p className="md:text-5xl sm:text-4xl sm:mb-1">Create Wallet</p>
          <p className="md:text-base font-mono sm:text-xs">Safe Secure Sleek</p>
          <Button className={`mt-2 font-mono cursor-pointer ${isDarkMode ? '' : 'bg-[#e9e9e9] text-black hover:bg-[#c4c4c4]'}`} onClick={handleGenerate}>
            Generate Recovery Phrase
          </Button>
        </div>
      )}

      {pageNumber === 2 && (
        <div className="w-screen sm:h-[86vh] md:h-screen flex justify-center items-center flex-col">
          <p className="md:text-6xl mb-2 sm:text-2xl">Secret recovery phrase</p>
          <p className="font-mono md:text-sm sm:text-xs text-center sm:w-80 md:w-auto mb-2 text-red-500">Note: This is the only way to recover your account if you lose your device.</p>
          <p className="font-mono md:text-sm sm:text-xs text-center mb-4">Write it down and store it in a safe place.</p>

          <table className="font-mono md:hidden">
            <tbody>
              {seedPhrase
                .split(" ")
                .reduce((rows, _, index, array) => {
                  if (index % 4 === 0) {
                    const sixWords = array.slice(index, index + 4);
                    rows.push(
                      <tr key={index}>
                        {sixWords.map((w, i) => (
                          <td
                            key={i}
                            className="border border-gray-500 w-20 h-10 text-center text-xs"
                          >
                            {w}
                          </td>
                        ))}
                      </tr>
                    );
                  }
                  return rows;
                }, [] as JSX.Element[])}
            </tbody>
          </table>

          <table className="font-mono sm:hidden md:flex">
            <tbody>
              {seedPhrase
                .split(" ")
                .reduce((rows, _, index, array) => {
                  if (index % 6 === 0) {
                    const sixWords = array.slice(index, index + 6);
                    rows.push(
                      <tr key={index}>
                        {sixWords.map((w, i) => (
                          <td
                            key={i}
                            className="border border-gray-500 w-30 h-10 text-center sm:text-xs md:text-base"
                          >
                            {w}
                          </td>
                        ))}
                      </tr>
                    );
                  }
                  return rows;
                }, [] as JSX.Element[])}
            </tbody>
          </table>

          <div className="flex items-center mt-5">
            <Checkbox className="border-[#c9c9c9]" id="saved" checked={checked} onCheckedChange={(val) => setChecked(val === true)} />
            <label htmlFor="saved" className="ml-2 sm:text-sm md:text-base font-serif">I saved my secret recovery phrase</label>
          </div>
          {/* 
            <button className="font-mono mt-5 cursor-pointer" onClick={() => {
              copyToClipboard(seedPhrase)
            }}>Copy to clipboard</button> */}

          <Button className={`font-mono mt-5 cursor-pointer ${isDarkMode ? '' : 'bg-[#e9e9e9] text-black hover:bg-[#c4c4c4]'}`} disabled={!checked} onClick={() => {
            setPageNumber(3)
          }}>Next</Button>

        </div>
      )}

      {pageNumber === 3 && (
        <div className="flex h-screen overflow-hidden">

          {/* Toggle Button */}
          <button
            className={`fixed sm:top-6 sb:top-4 left-6 z-50 ${isDarkMode ? 'text-white ' : ' text-black'} rounded-md cursor-pointer outline-0`}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Sidebar */}
          <div className={`sm:w-screen sb:w-[300px] h-full ${isDarkMode ? 'bg-zinc-950 border-[#222222]' : 'bg-[#fcfcfc] text-black'}  flex flex-col justify-between absolute sm:z-10 transition-transform duration-200 translate-y-0 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} border-r-1`}>

            <div className="sb:hidden flex w-full h-45 mt-16 pl-7 flex-col items-start justify-between">
              <button className="cursor-pointer font-mono hover:underline" onClick={() => {
                setDashPageNumber(1)
                setIsSidebarOpen(!isSidebarOpen)
              }}>Transfer Sol</button>

              <button className="cursor-pointer font-mono hover:underline" onClick={() => {
                setDashPageNumber(2)
                setIsSidebarOpen(!isSidebarOpen)
              }}>Airdrop</button>

              <button className="cursor-pointer font-mono hover:underline" onClick={() => {
                setDashPageNumber(3)
                setIsSidebarOpen(!isSidebarOpen)
              }}>Transactions</button>
            </div>

            <div className="flex w-full h-40 sb:mt-8 pl-7 flex-col items-start justify-evenly">

              <div className="flex items-center">
                <div className={`border-1 h-3 w-3 rounded-lg ${isDarkMode ? '' : ' border-black'}`}></div>
                <button className="cursor-pointer ml-5 font-mono hover:underline" onClick={() => {
                  createAccount()
                }}>Create account</button>
              </div>

              <div className="flex items-center">
                <div className={`border-1 h-3 w-3 rounded-lg ${isDarkMode ? '' : ' border-black'}`}></div>

                <AlertDialog>
                  <AlertDialogTrigger className="cursor-pointer ml-5 font-mono text-red-700 hover:underline outline-0">Purge wallet</AlertDialogTrigger>
                  <AlertDialogContent className={`font-mono ${isDarkMode ? '' : ' border-1 bg-[#f1f1f1]'}`}>
                    <AlertDialogHeader>
                      <AlertDialogTitle className={`${isDarkMode ? 'text-red-700' : 'text-red-800'}`}>Purge Wallet</AlertDialogTitle>
                      <AlertDialogDescription className={`${isDarkMode ? 'text-red-700' : 'text-red-800'}`}>
                        This will remove all accounts, transactions, and the recovery phrase stored locally.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>

                      <AlertDialogAction onClick={() => {
                      }} className={`cursor-pointer ${isDarkMode ? '' : ' border-1 bg-[#e7e7e7] text-black hover:bg-[#dbdbdb]'}`}>Cancel</AlertDialogAction>

                      <AlertDialogAction onClick={() => {
                        localStorage.clear()
                        setKeypairs([])
                        setTransaction([])
                        setPageNumber(1)
                        setChecked(false)
                        setIsSidebarOpen(false)
                      }} className={`cursor-pointer ${isDarkMode ? '' : ' border-1 bg-[#e7e7e7] text-black hover:bg-[#ebc6c6]'}`}>Proceed</AlertDialogAction>

                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>

            <div className="overflow-scroll overflow-x-hidden custom-scrollbar mb-1 h-full">

              {keypairs.length != 0 ? keypairs.map((pair, index) => (
                <Accordion key={pair.publicKey.toBase58()} type="single" collapsible className="font-mono ml-7 mr-7 mt-2">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="cursor-pointer">Account {index + 1}</AccordionTrigger>
                    <AccordionContent>

                      <Button className={`

                      w-full cursor-pointer rounded-2xl ${isDarkMode ? '' : ' border-1 bg-[#f1f1f1] text-black hover:bg-[#dbdbdb]'} outline-0

                        `} onClick={() => {
                          copyToClipboard(pair.publicKey.toBase58())
                          toast("Public key copied to clipboard ✅")
                        }}>Public Key</Button>

                      <AlertDialog>
                        <AlertDialogTrigger className={` w-full mt-2 h-9 rounded-2xl  cursor-pointer outline-0 ${isDarkMode ? 'bg-primary text-white hover:bg-primary/90' : ' border-1 bg-[#f1f1f1] text-black hover:bg-[#dbdbdb]'}`}>Private Key</AlertDialogTrigger>

                        <AlertDialogContent className={`font-mono ${isDarkMode ? 'text-amber-500' : ' border-1 bg-[#f1f1f1] text-amber-800'}`}>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Warning!</AlertDialogTitle>
                            <AlertDialogDescription className={`font-mono ${isDarkMode ? 'text-amber-500' : ' text-amber-800'}`} >
                              Do not share your private key with anyone!
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>

                            <AlertDialogAction className={`cursor-pointer ${isDarkMode ? '' : ' border-1 bg-[#e7e7e7] text-black hover:bg-[#dbdbdb]'}`}>Cancel</AlertDialogAction>

                            <AlertDialogAction onClick={() => {
                              copyToClipboard(bs58.encode(pair.secretKey))
                              toast("Private key copied to clipboard ✅")
                            }} className={`cursor-pointer ${isDarkMode ? '' : ' border-1 bg-[#e7e7e7] text-black hover:bg-[#dbdbdb]'}`}>Copy to clipboard</AlertDialogAction>

                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      <Button className={`w-full cursor-pointer rounded-2xl mt-2 text-red-700 ${isDarkMode ? '' : ' border-1 bg-[#f1f1f1] hover:bg-[#dbdbdb]'}`} onClick={() => {
                        deleteAccount(index)
                      }}>Remove account</Button>

                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )) : ''}
            </div>

          </div>

          {/* Main Content */}
          <div className={`flex-1 justify-center items-center`} onClick={() => setIsSidebarOpen(false)}>
            <Dashboard keypairs={keypairs} dashPageNumber={dashPageNumber} setDashPageNumber={setDashPageNumber} transactions={transaction} setTransaction={setTransaction} isDarkMode={isDarkMode} />
          </div>
        </div>
      )}
    </div>
  )
}

export default App
