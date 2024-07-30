import { Outlet } from 'react-router-dom'
import Navigation from './Navigation';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function index() {
    return (
        <>
            <div className="min-h-screen bg-gray-100">
                <Navigation />
                <main>
                    <div className="py-12">
                        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6 text-gray-900">
                                    <Outlet />
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            <ToastContainer closeButton={false} />
        </>
    )
}
