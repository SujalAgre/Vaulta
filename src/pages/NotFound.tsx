import { Link } from "react-router-dom"
import { Button } from "../components/ui/button"


function NotFound() {
    return (
        <>
            <div className="flex justify-center items-center h-screen w-screen flex-col">
                <p className="text-7xl">404</p>
                <p className="font-mono mb-3">Page Not Found</p>
                <Link to={"/"}>
                    <Button >
                        back to home
                    </Button>
                </Link>
            </div>

        </>
    )
}

export default NotFound