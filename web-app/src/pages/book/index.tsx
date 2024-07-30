import { useEffect, useState } from 'react'
import { initialPaginate, initialPaginateParams } from '@/helpers/contants';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import axios from '@/helpers/axios';
import { Book as BookType } from '@/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import Book from './components/Book';
import { useAppSelector } from '@/store';

const MySwal = withReactContent(Swal)

export default function index() {
    let timer: NodeJS.Timeout;

    const { role } = useAppSelector(s => s.auth)

    const [book, setBook] = useState(initialPaginate<BookType>());
    const [pages, setPages] = useState([1]);
    const [sizes] = useState([10, 20, 30, 40, 50]);
    const [payload, setPayload] = useState(initialPaginateParams);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        const { data, status } = await axios.get(`/api/book`, {
            params: payload
        }).finally(() => setLoading(false))

        if (status != 200) return setBook(initialPaginate());
        setBook(data);
    }

    const onDelete = async (id: string) => {
        const { isConfirmed } = await MySwal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        })

        if (isConfirmed) {
            MySwal.fire({
                title: 'Please Wait !',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading()
                },
            });

            const { status } = await axios.delete(`/api/book/${id}`, {
                headers: {
                    Role: "Admin"
                }
            });

            if (status == 200) {
                if (book.data.length > 1) {
                    await fetchData();
                } else {
                    if (book.currentPage > 1) {
                        setPayload(c => ({ ...c, page: book.currentPage - 1 }))
                    } else {
                        await fetchData();
                    }
                }
            }

            MySwal.close();
        }

    }

    const reintialize = () => {
        try {
            const numShown = Math.min(5, book.lastPage);
            let first = book.currentPage - Math.floor(numShown / 2);
            first = Math.max(first, 1);
            first = Math.min(first, book.lastPage - numShown + 1);
            setPages([...Array(numShown)].map((_, i) => i + first))
        } catch (error) {
            setPages([1]);
        }
    }

    useEffect(() => {
        fetchData()
    }, [JSON.stringify(payload)])

    useEffect(() => {
        reintialize()
    }, [JSON.stringify(book)])

    return (
        <div className='grid'>
            <div className="md:flex grid md:justify-between justify-center items-center mb-5 gap-2">
                <ul className="flex items-center -space-x-px h-8 text-sm">
                    <li>
                        <span
                            className={`flex items-center justify-center px-3 h-8 ms-0 leading-tight bg-white border border-e-0 border-gray-300 rounded-s-lg text-gray-500`}
                        >
                            Size
                        </span>
                    </li>
                    {sizes.map((s, i) => {
                        const style = {
                            active: "z-10 flex items-center justify-center px-3 h-8 leading-tight text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 cursor-default",
                            deactive: "flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 cursor-pointer"
                        };

                        return (
                            <li
                                key={s}
                                onClick={() => setPayload(c => ({ ...c, pageSize: s }))}
                            >
                                <span className={`${s == book.perPage ? style.active : style.deactive} ${(i + 1) == sizes.length && "rounded-e-lg"}`}>{s}</span>
                            </li>
                        )
                    })}

                </ul>
                <div className="flex gap-2">
                    <div className="flex items-center max-w-sm h-8">
                        <div className="relative w-full h-8">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none h-8">
                                <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 h-8"
                                placeholder="Search..."
                                onChange={(e) => {
                                    if (timer) {
                                        clearTimeout(timer);
                                    }

                                    timer = setTimeout(() => {
                                        setLoading(true);
                                        setPayload(c => ({ ...c, search: e.target.value, page: 1 }))
                                    }, 500);
                                }}
                            />
                        </div>
                    </div>
                    {role == "admin" &&
                        <Link to={"/book-form"} className="flex items-center">
                            <FontAwesomeIcon className='h-6 w-6 text-green-600 hover:text-green-500' icon={faCirclePlus} />
                        </Link>
                    }
                </div>
            </div>
            <div className="relative overflow-x-auto sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Title
                            </th>
                            <th scope="col" className="px-6 py-3 text-center">
                                isbn
                            </th>
                            <th scope="col" className="px-6 py-3 text-center">
                                published
                            </th>
                            <th scope="col" className="px-6 py-3 text-center">
                                price
                            </th>
                            <th scope="col" className="px-6 py-3 text-center">
                                stock
                            </th>
                            {role == "admin" &&
                                <th scope="col" className="px-6 py-3 text-center">
                                    Action
                                </th>
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {loading
                            ?
                            Array.from(Array(payload.pageSize), (_, i) => {
                                return (
                                    <tr key={i} className="odd:bg-white even:bg-gray-50 border-b">
                                        <td className="p-1 animate-pulse" colSpan={6}>
                                            <div className="px-6 py-4 bg-gray-200"></div>
                                        </td>
                                    </tr>
                                )
                            })
                            :
                            book.data.length > 0
                                ?
                                book.data.map((book) => {
                                    return (
                                        <tr key={book.id} className="odd:bg-white even:bg-gray-50 border-b">
                                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap capitalize">
                                                <Book data={book} />
                                            </th>
                                            <td className="px-6 py-4 capitalize text-center">
                                                {book.isbn}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {(book.publishedDate || false) ? new Date(book.publishedDate).toLocaleDateString() : "-"}
                                            </td>
                                            <td className="px-6 py-4 capitalize text-center">
                                                {book.price.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 capitalize text-center">
                                                {book.stock}
                                            </td>
                                            {role == "admin" &&
                                                <td className="px-6 py-4">
                                                    <div className="flex justify-center gap-2">
                                                        <Link to={`/book-form/${book.id}`}>
                                                            <FontAwesomeIcon className='text-yellow-400 hover:text-yellow-300' icon={faPen} />
                                                        </Link>
                                                        <FontAwesomeIcon
                                                            className='text-red-500 hover:text-red-400 cursor-pointer'
                                                            icon={faTrash}
                                                            onClick={() => onDelete(book.id)}
                                                        />
                                                    </div>
                                                </td>
                                            }
                                        </tr>
                                    )
                                })
                                :
                                <tr className="odd:bg-white even:bg-gray-50 border-b">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap capitalize text-center" colSpan={5}>
                                        No Data Found!
                                    </th>
                                </tr>
                        }
                    </tbody>
                </table>
            </div>
            <div className="md:flex grid gap-2 md:justify-between justify-center items-center mt-5 px-2 select-none">
                <div className="flex items-center border border-gray-300 px-3 h-8 rounded">
                    <span className="text-sm text-gray-700">
                        Showing <span className="font-semibold text-gray-900">{book.currentPage}</span> to <span className="font-semibold text-gray-900">{book.lastPage}</span> of <span className="font-semibold text-gray-900">{book.total}</span> Entries
                    </span>
                </div>
                <nav>
                    <ul className="flex items-center -space-x-px h-8 text-sm">
                        <li>
                            <span
                                className={`flex items-center justify-center px-3 h-8 ms-0 leading-tight bg-white border border-e-0 border-gray-300 rounded-s-lg ${book.currentPage == 1 ? "text-gray-200 cursor-default" : "hover:bg-gray-100 hover:text-gray-700 text-gray-500 cursor-pointer"}`}
                                onClick={() => {
                                    if (book.currentPage > 1) {
                                        setPayload(c => ({ ...c, page: book.currentPage - 1 }))
                                    }
                                }}
                            >
                                <svg className="w-2.5 h-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 1 1 5l4 4" />
                                </svg>
                            </span>
                        </li>
                        {pages.map((p) => {
                            const style = {
                                active: "z-10 flex items-center justify-center px-3 h-8 leading-tight text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 cursor-default",
                                deactive: "flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 cursor-pointer"
                            };

                            return (
                                <li
                                    key={p}
                                    onClick={() => setPayload(c => ({ ...c, page: p }))}
                                >
                                    <span className={p == book.currentPage ? style.active : style.deactive}>{p}</span>
                                </li>
                            )
                        })}
                        <li>
                            <span
                                className={`flex items-center justify-center px-3 h-8 leading-tight bg-white border border-gray-300 rounded-e-lg ${book.currentPage >= book.lastPage ? "text-gray-200 cursor-default" : "hover:bg-gray-100 hover:text-gray-700 text-gray-500 cursor-pointer"}`}
                                onClick={() => {
                                    if (book.currentPage < book.lastPage) {
                                        setPayload(c => ({ ...c, page: book.currentPage + 1 }))
                                    }
                                }}
                            >
                                <svg className="w-2.5 h-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m1 9 4-4-4-4" />
                                </svg>
                            </span>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>

    )
}
