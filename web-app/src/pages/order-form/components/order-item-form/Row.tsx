import TextInput from '@/components/TextInput'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { OrderItemForm } from '../../providers/hook'
import { getContext } from '../../providers/OrderForm'
import { useAppSelector } from '@/store'

export default function Row({ item }: { item: OrderItemForm }) {
    const { role } = useAppSelector(s => s.auth)
    const {
        selectIsLoading,
        books,
        setFormData,
        orderItemAddRowAbove,
        orderItemAddRowBelow,
        orderItemDeleteRow
    } = getContext([
        "selectIsLoading",
        "books",
        "setFormData",
        "orderItemAddRowAbove",
        "orderItemAddRowBelow",
        "orderItemDeleteRow"
    ])

    const getTotal = () => {
        const total = +item.unitPrice * +item.quantity;

        if (isNaN(total)) return 0.00;

        return total;
    }

    return (
        <tr>
            <td className='border border-slate-200'>
                <TextInput
                    type='drop-down'
                    list={books.map(b => ({ value: b.id, label: b.title }))}
                    noBorder
                    loading={selectIsLoading}
                    value={item.book}
                    onChange={({ val }) => {
                        const book = books.find(b => b.id == val.value);

                        setFormData(cur => ({
                            ...cur,
                            orderItems: cur.orderItems.map(oi => {
                                if (oi.id == item.id) {
                                    return {
                                        ...oi,
                                        book: val,
                                        unitPrice: book != null ? String(book.price) : "",
                                        quantity: "1"
                                    }
                                }
                                return oi;
                            })
                        }))

                    }}
                />
            </td>
            <td className='border border-slate-200' width={150}>
                <TextInput
                    type='number'
                    noBorder
                    value={item.quantity}
                    onChange={(val) => {
                        setFormData(cur => ({
                            ...cur,
                            orderItems: cur.orderItems.map(oi => {
                                if (oi.id == item.id) {
                                    return {
                                        ...oi,
                                        quantity: val
                                    }
                                }
                                return oi;
                            })
                        }))
                    }}
                />
            </td>
            <td className={`border border-slate-200 ${role == "guest" ? "px-6 py-3 text-center" : ""}`} width={150}>
                {role == "admin"
                    ?
                    <TextInput
                        type='number'
                        noBorder
                        value={item.unitPrice}
                        onChange={(val) => {
                            setFormData(cur => ({
                                ...cur,
                                orderItems: cur.orderItems.map(oi => {
                                    if (oi.id == item.id) {
                                        return {
                                            ...oi,
                                            unitPrice: val
                                        }
                                    }
                                    return oi;
                                })
                            }))
                        }}
                    />
                    : (+(item.unitPrice || 0)).toFixed(2)
                }
            </td>
            <td className='border border-slate-200 px-6 py-3 text-center group' width={150}>
                <span className='group-hover:hidden block'>{getTotal().toFixed(2)}</span>
                <div className="group-hover:flex hidden justify-center items-center gap-2">
                    <svg
                        className='cursor-pointer text-indigo-500 hover:text-indigo-400'
                        height={16}
                        viewBox="0 0 1024 1024"
                        width={16}
                        xmlns="http://www.w3.org/2000/svg"
                        onClick={() => orderItemAddRowBelow(item.id)}
                    >
                        <path fill='currentColor' d="m904 768h-784c-4.4 0-8 3.6-8 8v80c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-80c0-4.4-3.6-8-8-8zm-25.3-608h-733.4c-18.4 0-33.3 14.3-33.3 32v464c0 17.7 14.9 32 33.3 32h733.3c18.4 0 33.3-14.3 33.3-32v-464c.1-17.7-14.8-32-33.2-32zm-518.7 456h-176v-160h176zm0-224h-176v-160h176zm240 224h-176v-160h176zm0-224h-176v-160h176zm240 224h-176v-160h176zm0-224h-176v-160h176z" />
                    </svg>
                    <svg
                        className='cursor-pointer text-green-500 hover:text-green-400'
                        height={16}
                        viewBox="0 0 1024 1024"
                        width={16}
                        xmlns="http://www.w3.org/2000/svg"
                        onClick={() => orderItemAddRowAbove(item.id)}
                    >
                        <path fill='currentColor' d="m878.7 336h-733.4c-18.4 0-33.3 14.3-33.3 32v464c0 17.7 14.9 32 33.3 32h733.3c18.4 0 33.3-14.3 33.3-32v-464c.1-17.7-14.8-32-33.2-32zm-518.7 456h-176v-160h176zm0-224h-176v-160h176zm240 224h-176v-160h176zm0-224h-176v-160h176zm240 224h-176v-160h176zm0-224h-176v-160h176zm64-408h-784c-4.4 0-8 3.6-8 8v80c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-80c0-4.4-3.6-8-8-8z" />
                    </svg>
                    <FontAwesomeIcon
                        className='text-red-500 hover:text-red-400 cursor-pointer'
                        icon={faTrash}
                        onClick={() => orderItemDeleteRow(item.id)}
                    />
                </div>
            </td>
        </tr>
    )
}
