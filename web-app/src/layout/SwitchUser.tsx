import TextInput, { Option } from '@/components/TextInput';
import axios from '@/helpers/axios';
import { useAppDispatch, useAppSelector } from '@/store';
import { setRole, setUser } from '@/store/slices/authSlice';
import { Customer } from '@/types';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { useEffect, useRef, useState } from 'react'

interface SwitchUserProps {
    close: () => void
}

export default function SwitchUser({ close }: SwitchUserProps) {
    let timer: NodeJS.Timeout;

    const { role, user } = useAppSelector(s => s.auth);
    const dispatch = useAppDispatch();
    const r = useRef<HTMLDivElement>(null);

    const [selectIsLoading, setSelectIsLoading] = useState(true);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [users, setUsers] = useState<Option[]>([
        {
            value: "admin",
            label: "Admin"
        },
        {
            value: "guest",
            label: "Guest"
        },
    ]);


    const getCustomers = async () => {
        let page = 1;
        let lastPage = 2;

        while (page <= lastPage) {
            const response = await axios.get(`/api/customer`, {
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

            setCustomers(cur => ([...cur, ...response.data.data]))
            setUsers(cur => ([...cur, ...response.data.data.map((cust: Customer) => ({ value: cust.id, label: `${cust.firstName} ${cust.lastName}` }))]))
        }
    }

    useEffect(() => {
        if (timer != null) {
            clearTimeout(timer)
        }

        timer = setTimeout(() => {
            Promise.all([
                getCustomers(),
            ]).finally(() => setSelectIsLoading(false))
        }, 500);

        return () => {
            if (timer != null) {
                clearTimeout(timer)
            }
        }
    }, []);

    return (
        <Dialog open={true} as="div" className="relative z-10 focus:outline-none" onClose={() => false}>
            <DialogBackdrop className="fixed inset-0 bg-black/30" />
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto" ref={r}>
                <div className="flex min-h-full items-center justify-center p-4">
                    <DialogPanel
                        transition
                        className="w-full max-w-md rounded-xl bg-white backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
                    >
                        <div className="relative">
                            <TextInput
                                type='drop-down'
                                list={users}
                                onChange={({ val }) => {
                                    if (val.value == "admin" || val.value == "guest") {
                                        dispatch(setRole(val.value))
                                    } else {
                                        dispatch(setRole("guest"))
                                    }

                                    const user = customers.find(cust => cust.id == val.value);

                                    dispatch(setUser(user));
                                    close()
                                }}
                                menuPortalTarget={r.current as HTMLDivElement}
                                loading={selectIsLoading}
                                value={
                                    users.find(u => u.value == (user?.id || "-1")) ||
                                    users.find(u => u.value == role)
                                }
                            />
                            <FontAwesomeIcon
                                className='absolute -top-6 w-6 h-6 text-red-500 -right-5 cursor-pointer'
                                icon={faCircleXmark}
                                onClick={() => close()}
                            />
                        </div>


                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    )
}
