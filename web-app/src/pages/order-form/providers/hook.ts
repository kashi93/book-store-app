import axios from "@/helpers/axios";
import { useEffect, useState } from "react";
import type { Option } from "@/components/TextInput"
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { createId, isCuid } from '@paralleldrive/cuid2';
import { Book, Order } from "@/types";
import { useAppSelector } from "@/store";

export interface OrderFormContextInt {
    formData: FormData
    setFormData: React.Dispatch<React.SetStateAction<FormData>>
    submit: () => Promise<void>
    formErrors: string[]
    formSubmitting: boolean
    selectIsLoading: boolean
    books: Book[]
    orderItemAddRowAbove: (id: string) => void
    orderItemAddRowBelow: (id: string) => void
    orderItemDeleteRow: (id: string) => void
}

interface CustomerForm {
    id?: string
    firstName: string
    lastName: string
    address: string
    city: string
    country: string
    postalCode: string
}

export interface OrderItemForm {
    id: string
    deleted: boolean
    book?: Option
    quantity: string
    unitPrice: string
}

interface FormData {
    id?: number
    totalAmount: string
    status: Option
    customer: CustomerForm
    orderItems: OrderItemForm[]
}

export const orderStatus = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled", "Returned"];
const initialFormData = (): FormData => ({
    id: undefined,
    totalAmount: "",
    status: { value: "Pending", label: "Pending" },
    customer: {
        id: undefined,
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        country: "",
        postalCode: "",
    },
    orderItems: [initialOrderItem()]
})
const initialOrderItem = (): OrderItemForm => ({
    id: createId(),
    deleted: false,
    book: undefined,
    quantity: "",
    unitPrice: "",
})

export const init = (): OrderFormContextInt => {
    let timer: NodeJS.Timeout;

    const navigate = useNavigate();
    const { user } = useAppSelector(s => s.auth)
    const { id } = useParams();

    const [selectIsLoading, setSelectIsLoading] = useState(true);
    const [formData, setFormData] = useState(initialFormData());
    const [formErrors, setFormErrors] = useState<string[]>([]);
    const [formSubmitting, setFormSubmitting] = useState(false);
    const [books, setBooks] = useState<Book[]>([])

    const submit = async () => {
        setFormSubmitting(true)
        setFormErrors([]);
        const data = {
            id: formData.id || null,
            totalAmount: +formData.orderItems
                .filter(item => !item.deleted && item.book)
                .map(oi => {
                    const total = (+(oi.unitPrice || 0)) * (+(oi.quantity || 0));
                    if (isNaN(total)) return 0.00;
                    return total;
                }).reduce((a, b) => a + b, 0).toFixed(2),
            status: formData.status.value,
            customer: {
                id: formData.customer.id || null,
                firstName: formData.customer.firstName,
                lastName: formData.customer.lastName,
                address: formData.customer.address || null,
                city: formData.customer.city || null,
                country: formData.customer.country || null,
                postalCode: formData.customer.postalCode || null,
            },
            orderItems: formData
                .orderItems.map(oi => {
                    if (id == null) {
                        if (!oi.deleted && oi.book) {
                            return {
                                id: null,
                                bookId: oi.book.value,
                                quantity: +(oi.quantity || 0),
                                unitPrice: +(oi.unitPrice || 0),
                            }
                        }
                    }

                    if (id != null) {
                        if (oi.book) {
                            if (isCuid(oi.id)) {
                                if (!oi.deleted) {
                                    return {
                                        id: null,
                                        bookId: oi.book.value,
                                        quantity: +(oi.quantity || 0),
                                        unitPrice: +(oi.unitPrice || 0),
                                    }
                                }
                            } else {
                                return {
                                    id: oi.id,
                                    deleted: oi.deleted,
                                    bookId: oi.book.value,
                                    quantity: +(oi.quantity || 0),
                                    unitPrice: +(oi.unitPrice || 0),
                                }
                            }
                        }
                    }

                    return false;
                }).filter(item => item)
        }

        const response = await axios[id != null ? "patch" : "post"](`${window.location.origin}/api/order${id != null ? `/${id}` : ""}`, data, {
            headers: id != null ? {
                Role: "Admin"
            } : undefined
        })

        setFormSubmitting(false)

        switch (response.status) {
            case 400:
                if (Array.isArray(response.data.message)) {
                    setFormErrors(response.data.message)
                }
                return;
            default:
                toast(`Order has been ${id == null ? 'saved' : 'updated'}`, { type: "success", position: "top-center" });
                return navigate("/order")
        }
    }

    const getBooks = async () => {
        let page = 1;
        let lastPage = 2;

        while (page <= lastPage) {
            const response = await axios.get(`/api/book`, {
                params: {
                    search: "",
                    page,
                    pageSize: 50
                }
            });

            if (response.status != 200) {
                return;
            }

            page = response.data.currentPage + 1;
            lastPage = response.data.lastPage;

            await new Promise((res) => setTimeout(() => {
                res(true)
            }, 500))

            setBooks(cur => ([...cur, ...response.data.data]))
        }
    }

    const init = async () => {
        if (id != null && formData.id == null) {
            const response = await axios.get(`${window.location.origin}/api/order/${id}`);

            if (response.status != 200) {
                toast("Order not found", { type: "error", position: "top-center" });
                return navigate("/order")
            }

            const order = response.data as Order;

            setFormData({
                id: order.id,
                totalAmount: order.totalAmount.toFixed(2),
                customer: {
                    id: order.customer.id,
                    firstName: order.customer.firstName,
                    lastName: order.customer.lastName,
                    address: order.customer.address || "",
                    city: order.customer.city || "",
                    country: order.customer.country || "",
                    postalCode: order.customer.postalCode || "",
                },
                status: { value: order.status, label: order.status },
                orderItems: order.orderItems.length > 0
                    ?
                    order.orderItems.map(oi => {
                        return {
                            id: oi.id,
                            deleted: false,
                            book: { value: oi.book.id, label: oi.book.title },
                            quantity: String(oi.quantity),
                            unitPrice: oi.unitPrice.toFixed(2),
                        }
                    })
                    :
                    [initialOrderItem()]
            })

        } else {
            if (user) {
                setFormData(cur => ({
                    ...cur,
                    customer: {
                        id: user.id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        address: user.address || "",
                        city: user.city || "",
                        country: user.country || "",
                        postalCode: user.postalCode || "",
                    },
                }));
            } else {
                setFormData(cur => ({
                    ...cur,
                    customer: {
                        ...cur.customer,
                        id: undefined,
                    },
                }));
            }
        }
    }

    const orderItemAddRowAbove = (id: string) => {
        const i = formData.orderItems.findIndex(oi => oi.id == id);

        if (i == -1) return;

        setFormData(cur => ({
            ...cur,
            orderItems: [
                ...cur.orderItems.slice(0, i),
                initialOrderItem(),
                ...cur.orderItems.slice(i, cur.orderItems.length),
            ]
        }))
    }

    const orderItemAddRowBelow = (id: string) => {
        const i = formData.orderItems.findIndex(oi => oi.id == id);

        if (i == -1) return;

        setFormData(cur => ({
            ...cur,
            orderItems: [
                ...cur.orderItems.slice(0, i + 1),
                initialOrderItem(),
                ...cur.orderItems.slice(i + 1, cur.orderItems.length),
            ]
        }))
    }

    const orderItemDeleteRow = (id: string) => {
        setFormData(cur => ({
            ...cur,
            orderItems: cur.orderItems.map(oi => {
                if (oi.id == id) {
                    return {
                        ...oi,
                        deleted: true
                    }
                }

                return oi;
            })
        }))
    }

    const reintializeOrderItem = () => {
        if (formData.orderItems.filter(oi => oi.deleted).length == formData.orderItems.length) {
            setFormData(cur => ({
                ...cur,
                orderItems: [
                    initialOrderItem(),
                    ...cur.orderItems
                ]
            }))
        }
    }

    useEffect(() => {
        if (timer != null) {
            clearTimeout(timer)
        }

        timer = setTimeout(() => {
            Promise.all([
                init(),
                getBooks()
            ]).finally(() => setSelectIsLoading(false))
        }, 500);

        return () => {
            if (timer != null) {
                clearTimeout(timer)
            }
        }
    }, []);

    useEffect(() => {
        init()
    }, [JSON.stringify(user)]);

    useEffect(() => {
        reintializeOrderItem()
    }, [formData.orderItems.filter(oi => oi.deleted).length])

    return {
        formData,
        setFormData,
        submit,
        formErrors,
        formSubmitting,
        selectIsLoading,
        books,
        orderItemAddRowAbove,
        orderItemAddRowBelow,
        orderItemDeleteRow
    };
}