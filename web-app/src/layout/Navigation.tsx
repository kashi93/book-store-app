import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom';
import ApplicationLogo from '../components/ApplicationLogo';
import NavLink from '../components/NavLink';
import ResponsiveNavLink from '../components/ResponsiveNavLink';
import Dropdown from '../components/DropDown';
import DropDownLink from '../components/DropDownLink';
import { useAppSelector } from '@/store';
import { createId } from '@paralleldrive/cuid2';
import SwitchUser from './SwitchUser';

export default function Navigation() {
    const { role, user } = useAppSelector(s => s.auth);

    const location = useLocation();
    const navigate = useNavigate();

    const { pathname } = location;
    const splitLocation = pathname.split("/");
    const [open, setOpen] = useState(false);
    const [dropDownKey, setDropDownKey] = useState(createId());
    const [switchUserMode, setSwitchUserMode] = useState(false);

    const getUser = () => {
        if (user) return `${user.firstName} ${user.lastName}`
        if (role == "admin") return "Admin";
        if (role == "guest") return "Guest";
    }

    return (
        <>
            <nav className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="shrink-0 flex items-center">
                                <Link to="/">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                                </Link>
                            </div>
                            <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                                <NavLink active={splitLocation[1] == "" || splitLocation[1] == "book-form"} onClick={(e: Event) => { e.preventDefault(); navigate("/") }}>
                                    Book
                                </NavLink>
                                <NavLink active={splitLocation[1] == "order" || splitLocation[1] == "order-form"} onClick={(e: Event) => { e.preventDefault(); navigate("/order") }}>
                                    Order
                                </NavLink>
                            </div>
                        </div>

                        <div className="hidden sm:flex sm:items-center sm:ml-6">
                            <Dropdown align="right" width="48" key={dropDownKey}>
                                <Dropdown.Trigger>
                                    <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150">
                                        <div className='capitalize'>{getUser()}</div>
                                        <div className="ml-1">
                                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </button>
                                </Dropdown.Trigger>
                                <Dropdown.Content>
                                    <DropDownLink
                                        onClick={(e: Event) => {
                                            e.preventDefault();
                                            setSwitchUserMode(true)
                                            setDropDownKey(createId())
                                        }}
                                    >
                                        Switch User
                                    </DropDownLink>

                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                        <div className="-mr-2 flex items-center sm:hidden">
                            <button onClick={(e) => {
                                e.preventDefault();
                                setOpen((current) => current = !current)
                            }} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out">
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path className={!open ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                    <path className={open ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
                <div className={`sm:hidden ${!open ? 'hidden' : ''}`}>
                    <div className="pt-2 pb-3 space-y-1">
                        <ResponsiveNavLink active={splitLocation[1] == "" || splitLocation[1] == "book-form"} onClick={(e: Event) => { e.preventDefault(); navigate("/") }}>
                            Book
                        </ResponsiveNavLink>
                        <ResponsiveNavLink active={splitLocation[1] == "order" || splitLocation[1] == "order-form"} onClick={(e: Event) => { e.preventDefault(); navigate("/order") }}>
                            Order
                        </ResponsiveNavLink>
                    </div>
                </div>
            </nav>
            {switchUserMode && <SwitchUser close={() => setSwitchUserMode(false)} />}
        </>
    )
}
