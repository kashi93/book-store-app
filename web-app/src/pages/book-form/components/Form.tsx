import TextInput from '@/components/TextInput';
import Category from './Category';
import Author from './Author';
import { getContext } from '../providers/BookForm';
import { faRotate } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from '@/helpers/axios';
import { useState } from 'react';

export default function Form() {
    const {
        formData,
        setFormData
    } = getContext([
        "formData",
        "setFormData"
    ]);

    const [loading, setLoading] = useState(false);

    const getrandomIsBn = async () => {
        try {
            const response = await axios.get(`${window.location.origin}/api/book/random-isbn`, {
                headers: {
                    Role: "Admin"
                }
            })

            if (response.status == 200) {
                setFormData(cur => ({ ...cur, isbn: response.data }));
            }

        } catch (error) {

        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="grid gap-5">
            <div className="grid md:grid-cols-2 gap-5">
                <TextInput
                    label="Title"
                    required
                    value={formData.title}
                    onChange={(val) => setFormData(cur => ({ ...cur, title: val }))}
                />
                <TextInput
                    label="International Standard Book Number (ISBN)"
                    required
                    value={formData.isbn}
                    onChange={(val) => setFormData(cur => ({ ...cur, isbn: val }))}
                    suffix={(
                        <>
                            <FontAwesomeIcon
                                className='cursor-pointer text-blue-500 hover:text-blue-400'
                                icon={faRotate}
                                spin={loading}
                                onClick={() => getrandomIsBn()}
                            />
                        </>
                    )}
                />
            </div>
            <div className="grid md:grid-cols-3 gap-5">
                <Author />
                <Category />
                <TextInput
                    label="Unit Price"
                    required
                    type="number"
                    value={formData.price}
                    onChange={(val) => setFormData(cur => ({ ...cur, price: val }))}
                />
                <TextInput
                    label="Stock"
                    required
                    type="number"
                    value={formData.stock}
                    onChange={(val) => setFormData(cur => ({ ...cur, stock: val }))}
                />
                <TextInput
                    label="Published Date"
                    type="date"
                    value={formData.publishedDate}
                    onChange={(val) => setFormData(cur => ({ ...cur, publishedDate: val }))}
                />
                <TextInput
                    label="Cover Image URL"
                    value={formData.coverImageUrl || ""}
                    onChange={(val) => setFormData(cur => ({ ...cur, coverImageUrl: val }))}
                />
            </div>
            <TextInput
                label="Description"
                type="text-area"
                value={formData.description || ""}
                onChange={(val) => setFormData(cur => ({ ...cur, description: val }))}
            />
        </div>
    )
}
