import { Book as BookType } from '@/types'
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import NotFound from "@/assets/not-found.jpg";

export default function Book({ data }: { data: BookType }) {
    const [loading, setLoading] = useState(true);
    const [imgUrl, setImgUrl] = useState<any>(undefined);

    const testConnection = async () => {
        try {
            if (data.coverImageUrl == null) {
                setImgUrl(NotFound);
                return;
            }

            const response = await fetch(data.coverImageUrl)
                .catch(err => err);

            if (!response.ok) {
                setImgUrl(NotFound);
                return;
            }

            setImgUrl(data.coverImageUrl)
        } catch (error) {

        }
    }

    useEffect(() => {
        testConnection()
            .finally(() => setLoading(false));
    }, [])

    return (
        <div className='flex gap-3 items-center'>
            <div className='w-8 h-12 bg-gray-300 rounded flex justify-center items-center'>
                {
                    loading
                        ? <FontAwesomeIcon className='text-white' spin icon={faCircleNotch} />
                        :
                        <img
                            className='object-cover rounded w-8 h-12'
                            src={imgUrl}
                        />
                }
            </div>
            <div className="">
                <div>
                    {data.title} ({data.category})
                </div>
                <div className='text-xs text-slate-500'>
                    {data.author}
                </div>
            </div>
        </div>

    )
}
