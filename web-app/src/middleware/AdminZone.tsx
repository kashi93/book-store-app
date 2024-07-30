import { useAppSelector } from "@/store"
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminZone({ children }: { children: React.ReactNode }) {
    const { role } = useAppSelector(s => s.auth);
    const navigate = useNavigate()

    useEffect(() => {
        if (role != "admin") {
            navigate("/");
        }
    }, [role])

    return children;
}
