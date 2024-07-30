import { faArrowLeft, faCircleDot, faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { getContext } from '../providers/OrderForm'

export default function Header() {
    const {
        formErrors,
        formSubmitting,
        formData
    } = getContext([
        "formErrors",
        "formSubmitting",
        "formData"
    ])

    return (
        <div className="flex justify-between items-center">
            <Link to={!formSubmitting ? "/order" : ""}>
                <FontAwesomeIcon icon={faArrowLeft} />
            </Link>
            <div>
                {formData.id != null ? "Update" : "Create new"}  Order
            </div>
            <div>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <FontAwesomeIcon className={formErrors.length > 0 ? 'text-red-500' : 'text-blue-500'} beat={formErrors.length > 0} icon={faCircleInfo} />
                        </TooltipTrigger>
                        <TooltipContent>
                            {formErrors.length == 0 ?
                                "Please fill out this form"
                                :
                                <div className="grid gap-2">
                                    <div className="font-bold w-full text-center">Invalid Input</div>
                                    <div className="grid">
                                        {formErrors.map((err, i) => {
                                            return (
                                                <div key={i} className="flex gap-2 items-center">
                                                    <FontAwesomeIcon className='text-red-500' icon={faCircleDot} />
                                                    <span className='capitalize'>
                                                        {err}
                                                    </span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            }

                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    )
}
