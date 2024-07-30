import axios from "@/helpers/axios";
import { useEffect, useState } from "react";
import type { Option } from "@/components/TextInput"
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Book } from "@/types";

export interface BookFormContextInt {
    selectIsLoading: boolean
    authors: string[]
    setAuthors: React.Dispatch<React.SetStateAction<string[]>>
    categories: string[]
    setCategories: React.Dispatch<React.SetStateAction<string[]>>
    formData: FormData
    setFormData: React.Dispatch<React.SetStateAction<FormData>>
    submit: () => Promise<void>
    formErrors: string[]
    formSubmitting: boolean
}

interface FormData {
    id?: string
    author?: Option
    category?: Option
    title: string
    isbn: string
    price: string
    stock: string
    publishedDate: string
    description?: string
    coverImageUrl?: string
}

const initialFormData: FormData = {
    id: undefined,
    author: undefined,
    category: undefined,
    title: "",
    isbn: "",
    price: "",
    stock: "",
    publishedDate: "",
    description: undefined,
    coverImageUrl: undefined
}

export const init = (): BookFormContextInt => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [selectIsLoading, setSelectIsLoading] = useState(true);
    const [authors, setAuthors] = useState<string[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [formData, setFormData] = useState(initialFormData);
    const [formErrors, setFormErrors] = useState<string[]>([]);
    const [formSubmitting, setFormSubmitting] = useState(false);

    const getAuthors = async () => {
        const response = await axios.get(`${window.location.origin}/api/book/get-authors`, {
            headers: {
                Role: "Admin"
            }
        })

        if (response.status == 200) {
            setAuthors(response.data.map((a: any) => a.author))
        }
    }

    const getCategories = async () => {
        const response = await axios.get(`${window.location.origin}/api/book/get-categories`, {
            headers: {
                Role: "Admin"
            }
        })

        if (response.status == 200) {
            setCategories(response.data.map((a: any) => a.category))
        }
    }

    const submit = async () => {
        setFormSubmitting(true)
        setFormErrors([]);
        const data = {
            ...formData,
            isbn: String(formData.isbn),
            publishedDate: formData.publishedDate || null,
            price: !isNaN(+formData.price) ? +formData.price : "",
            stock: !isNaN(+formData.stock) ? +formData.stock : "",
            author: formData.author?.value,
            category: formData.category?.value,
        }
        const response = await axios[id != null ? "patch" : "post"](`${window.location.origin}/api/book`, data, {
            headers: {
                Role: "Admin"
            }
        })

        setFormSubmitting(false)

        switch (response.status) {
            case 400:
                if (Array.isArray(response.data.message)) {
                    setFormErrors(response.data.message)
                }
                return;
            default:
                toast(`Book has been ${id == null ? 'saved' : 'updated'}`, { type: "success", position: "top-center" });
                return navigate("/")
        }
    }

    const init = async () => {
        if (id != null) {
            setFormData(cur => ({ ...cur, id }))
            const response = await axios.get(`${window.location.origin}/api/book/${id}`);

            if (response.status != 200) {
                toast("Book not found", { type: "error", position: "top-center" });
                return navigate("/")
            }

            const book = response.data as Book

            setFormData({
                id,
                author: { label: book.author, value: book.author },
                category: { label: book.category, value: book.category },
                title: book.title,
                isbn: book.isbn,
                price: String(book.price),
                stock: String(book.stock),
                publishedDate: book.publishedDate || "",
                description: book.description,
                coverImageUrl: book.coverImageUrl
            })
        }
    }

    useEffect(() => {
        Promise.all([
            init(),
            getAuthors(),
            getCategories()
        ]).finally(() => setSelectIsLoading(false))
    }, []);

    return {
        selectIsLoading,
        authors,
        setAuthors,
        formData,
        setFormData,
        categories,
        setCategories,
        submit,
        formErrors,
        formSubmitting
    };
}