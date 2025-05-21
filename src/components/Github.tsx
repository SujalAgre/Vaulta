import { GithubIcon, TwitterIcon } from "lucide-react";
import { Link } from "react-router-dom";

function Github() {
    return (
        <>
        <div className="md:flex flex-row gap-2 text-gray-400 sm:hidden">
            <Link to="https://github.com/SujalAgre/Vaulta" target="_blank">
                <GithubIcon className="w-7 h-7"/>
            </Link>
            <Link to="https://x.com/SujalAgre" target="_blank">
                <TwitterIcon className="w-7 h-7"/>
            </Link>
        </div>
        </>
        
    )
}

export default Github;
