import { Link } from "react-router-dom"
import { Button } from "../components/ui/button"


function NotFound() {
    return (
        <>
            <div className="flex justify-center items-center h-screen w-screen flex-col">
                    <p className="text-6xl">Page Not Found</p>
                    <Link to={"/"}>
                        <Button className="p-5 mt-10 text-xl font-mono">Home</Button>
                    </Link>
            </div>

        </>
    )
}

export default NotFound