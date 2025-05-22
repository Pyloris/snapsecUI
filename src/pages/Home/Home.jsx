import { Card } from "@/components/ui/card";
import { ScanEye } from "lucide-react";
import { useNavigate } from "react-router";

function Home() {

    const navigate = useNavigate();
    const handleVisit = (route) => {
        navigate(route);
    }

    return (
        <div className="w-full h-full flex items-center justify-center">

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <Card className="p-4 min-w-[300px] flex items-center justify-center">
                    <ScanEye className="w-12 h-12" />
                    <p>Vulnerability Scanner</p>
                    <p onClick={() => handleVisit("/home")}>Visit</p>
                </Card>
            </div>
        </div>
    )
}


export default Home;