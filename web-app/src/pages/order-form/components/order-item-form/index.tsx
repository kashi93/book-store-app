import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { getContext } from "../../providers/OrderForm";
import Row from "./Row";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function index() {
    const {
        formData
    } = getContext([
        "formData"
    ])

    return (
        <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-gray-700 uppercase bg-gray-200">
                <tr>
                    <th scope="col" className="px-6 py-3 text-center border-b border-white" colSpan={3}>
                        order item list
                    </th>
                    <th scope="col" className="px-6 py-3 border-b border-white">
                        <div className="flex w-full justify-center items-center gap-2">
                            <svg
                                className='text-indigo-500'
                                height={16}
                                viewBox="0 0 1024 1024"
                                width={16}
                                xmlns="http://www.w3.org/2000/svg"

                            >
                                <path fill='currentColor' d="m904 768h-784c-4.4 0-8 3.6-8 8v80c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-80c0-4.4-3.6-8-8-8zm-25.3-608h-733.4c-18.4 0-33.3 14.3-33.3 32v464c0 17.7 14.9 32 33.3 32h733.3c18.4 0 33.3-14.3 33.3-32v-464c.1-17.7-14.8-32-33.2-32zm-518.7 456h-176v-160h176zm0-224h-176v-160h176zm240 224h-176v-160h176zm0-224h-176v-160h176zm240 224h-176v-160h176zm0-224h-176v-160h176z" />
                            </svg>
                            <svg
                                className='text-green-500'
                                height={16}
                                viewBox="0 0 1024 1024"
                                width={16}
                                xmlns="http://www.w3.org/2000/svg"

                            >
                                <path fill='currentColor' d="m878.7 336h-733.4c-18.4 0-33.3 14.3-33.3 32v464c0 17.7 14.9 32 33.3 32h733.3c18.4 0 33.3-14.3 33.3-32v-464c.1-17.7-14.8-32-33.2-32zm-518.7 456h-176v-160h176zm0-224h-176v-160h176zm240 224h-176v-160h176zm0-224h-176v-160h176zm240 224h-176v-160h176zm0-224h-176v-160h176zm64-408h-784c-4.4 0-8 3.6-8 8v80c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-80c0-4.4-3.6-8-8-8z" />
                            </svg>
                            <FontAwesomeIcon
                                className='text-red-500'
                                icon={faTrash}

                            />
                        </div>
                    </th>
                </tr>
                <tr>
                    <th scope="col" className="px-6 py-3 text-center">
                        Book
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Quantity
                    </th>
                    <th scope="col" className="px-6 py-3 text-center">
                        Unit Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-center">
                        total
                    </th>
                </tr>
            </thead>
            <tbody>
                {
                    formData.orderItems
                        .filter(item => !item.deleted)
                        .map(item => <Row key={item.id} item={item} />)
                }
            </tbody>
            <tfoot>
                <tr className="border">
                    <th scope="col" className="px-6 py-3 text-end">
                        Total
                    </th>
                    <th scope="col" className="px-6 py-3 text-center">
                        {
                            formData.orderItems
                                .filter(item => !item.deleted && item.book)
                                .reduce((prev, oi) => (+(oi.quantity || 0)) + prev, 0)
                                .toFixed(2)
                        }
                    </th>
                    <th scope="col" className="px-6 py-3 text-center">
                        {
                            formData.orderItems
                                .filter(item => !item.deleted && item.book)
                                .reduce((prev, oi) => (+(oi.unitPrice || 0)) + prev, 0)
                                .toFixed(2)
                        }
                    </th>
                    <th scope="col" className="px-6 py-3 text-center">
                        {
                            formData.orderItems
                                .filter(item => !item.deleted && item.book)
                                .map(oi => {
                                    const total = (+(oi.unitPrice || 0)) * (+(oi.quantity || 0));
                                    if (isNaN(total)) return 0.00;
                                    return total;
                                }).reduce((a, b) => a + b, 0)
                                .toFixed(2)
                        }
                    </th>
                </tr>
            </tfoot>
        </table>
    )
}
