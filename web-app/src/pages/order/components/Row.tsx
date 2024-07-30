import Book from "@/pages/book/components/Book";
import { useAppSelector } from "@/store";
import { Order } from "@/types";
import { faChevronDown, faChevronUp, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Link } from "react-router-dom";

interface RowProps {
    order: Order
    onDelete: (id: number) => Promise<void>
}

export default function Row({ order, onDelete }: RowProps) {
    const { role } = useAppSelector(s => s.auth)
    const [open, setOpen] = useState(false);

    return (
        <>
            <tr className="odd:bg-white even:bg-gray-50 border-b">
                <td className="px-6 py-4 capitalize text-center">
                    <div className="flex justify-between items-center text-blue-500 cursor-pointer" onClick={() => setOpen(cur => !cur)}>
                        <div className="font-bold" >
                            #{order.id}
                        </div>
                        <FontAwesomeIcon className="text-xs" icon={open ? faChevronUp : faChevronDown} />
                    </div>
                </td>
                <td className="px-6 py-4 capitalize">
                    {order.customer.firstName}
                    {" "}
                    {order.customer.lastName}
                </td>
                <td className="px-6 py-4 capitalize text-center">
                    {order.orderItems.map(oi => oi.quantity).reduce((a, b) => a + b, 0)}
                </td>
                <td className="px-6 py-4 capitalize text-center">
                    {order.totalAmount.toFixed(2)}
                </td>
                <td className="px-6 py-4 capitalize text-center font-semibold">
                    {order.status}
                </td>
                {role == "admin" &&
                    <td className="px-6 py-4">
                        <div className="flex justify-center items-center gap-2">
                            <Link to={`/order-form/${order.id}`}>
                                <FontAwesomeIcon className='text-yellow-400 hover:text-yellow-300' icon={faPen} />
                            </Link>
                            <FontAwesomeIcon
                                className='text-red-500 hover:text-red-400 cursor-pointer'
                                icon={faTrash}
                                onClick={() => onDelete(order.id)}
                            />
                        </div>
                    </td>
                }
            </tr>
            {open &&
                <tr className="odd:bg-white even:bg-gray-50 border-b">
                    <td className="px-6 py-4 capitalize" colSpan={6}>
                        <div className="grid gap-5">
                            <div className="flex justify-between gap-3">
                                <div className="w-full text-xs text-gray-700">
                                    <div className="uppercase bg-slate-200 p-2 text-center font-bold">Customer</div>
                                    <div className="flex border-t border-l border-r">
                                        <div className="p-2 capitalize font-bold border-b flex-1">first name</div>
                                        <div className="p-2 capitalize text-left border-b flex-1">{order.customer.firstName}</div>
                                    </div>
                                    <div className="flex border-l border-r">
                                        <div className="p-2 capitalize font-bold border-b flex-1">last name</div>
                                        <div className="p-2 capitalize text-left border-b flex-1">{order.customer.lastName}</div>
                                    </div>
                                    <div className="flex border-l border-r">
                                        <div className="p-2 capitalize font-bold border-b flex-1">address</div>
                                        <div className="p-2 capitalize text-left border-b flex-1">{order.customer.address || "-"}</div>
                                    </div>
                                    <div className="flex border-l border-r">
                                        <div className="p-2 capitalize font-bold border-b flex-1">postal code</div>
                                        <div className="p-2 capitalize text-left border-b flex-1">{order.customer.postalCode || "-"}</div>
                                    </div>
                                    <div className="flex border-l border-r">
                                        <div className="p-2 capitalize font-bold border-b flex-1">City</div>
                                        <div className="p-2 capitalize text-left border-b flex-1">{order.customer.city || "-"}</div>
                                    </div>
                                    <div className="flex border-l border-r border-b">
                                        <div className="p-2 capitalize font-bold flex-1">Country</div>
                                        <div className="p-2 capitalize text-left flex-1">{order.customer.country || "-"}</div>
                                    </div>
                                </div>
                                <div className="w-full text-xs text-gray-700">
                                    <div className="uppercase bg-slate-200 p-2 text-center font-bold">Order</div>
                                    <div className="flex border-t border-l border-r">
                                        <div className="p-2 capitalize font-bold border-b flex-1">Ref No</div>
                                        <div className="p-2 capitalize text-left border-b flex-1">#{order.id}</div>
                                    </div>
                                    <div className="flex border-l border-r">
                                        <div className="p-2 capitalize font-bold border-b flex-1">Date</div>
                                        <div className="p-2 capitalize text-left border-b flex-1">{new Date(order.createdAt).toLocaleDateString()}</div>
                                    </div>
                                    <div className="flex border-l border-r">
                                        <div className="p-2 capitalize font-bold border-b flex-1">Status</div>
                                        <div className="p-2 capitalize text-left border-b flex-1">{order.status}</div>
                                    </div>
                                </div>
                            </div>
                            <table className="w-full text-xs text-left text-gray-700">
                                <thead className="uppercase bg-slate-200">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">
                                            Book
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-center">
                                            qty
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-center">
                                            unit price
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-center">
                                            total
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.orderItems.map(oi => {
                                        return (
                                            <tr key={oi.id} className="bg-white border-b">
                                                <td className="px-6 py-4 capitalize">
                                                    <Book data={oi.book} />
                                                </td>
                                                <td className="px-6 py-4 capitalize text-center">
                                                    {oi.quantity}
                                                </td>
                                                <td className="px-6 py-4 capitalize text-center">
                                                    {oi.unitPrice}
                                                </td>
                                                <td className="px-6 py-4 capitalize text-center">
                                                    {oi.unitPrice * oi.quantity}
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                                <tfoot>
                                    <tr className="bg-white border-b">
                                        <th scope="col" className="px-6 py-3">
                                            Total
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-center">
                                            {order.orderItems.reduce((prev, oi) => oi.quantity + prev, 0).toFixed(2)}
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-center">
                                            {order.orderItems.reduce((prev, oi) => oi.unitPrice + prev, 0).toFixed(2)}
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-center">
                                            {order.orderItems.reduce((prev, oi) => (oi.unitPrice * oi.quantity) + prev, 0).toFixed(2)}
                                        </th>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </td>
                </tr>
            }
        </>
    )
}
