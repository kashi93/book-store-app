import { faCircleNotch } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

interface PrimaryButtonProps {
    label: string
    type?: "button" | "reset" | "submit"
    onClick: React.MouseEventHandler<HTMLButtonElement>
    loading?: boolean
}

export default function PrimaryButton({ type = "button", label, onClick, loading = false }: PrimaryButtonProps) {
    return (
        <button
            type={type}
            className={`text-white ${loading ? "bg-blue-400" : "bg-blue-700"} hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center`}
            onClick={!loading ? onClick : undefined}
        >
            {label} {loading && <FontAwesomeIcon spin icon={faCircleNotch} />}
        </button>
    )
}
