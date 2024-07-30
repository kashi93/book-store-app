import TextInput from '@/components/TextInput'
import { getContext } from '../providers/BookForm'

export default function Author() {
    const {
        selectIsLoading,
        authors,
        setAuthors,
        formData,
        setFormData
    } = getContext([
        "selectIsLoading",
        "authors",
        "setAuthors",
        "formData",
        "setFormData"
    ]);

    return (
        <TextInput
            label="Author"
            required
            type="drop-down"
            createAble
            loading={selectIsLoading}
            list={authors.map(a => ({ label: a, value: a }))}
            onCreated={(opt) => {
                setAuthors(cur => ([opt.label, ...cur]))
                setFormData(cur => ({
                    ...cur,
                    author: {
                        label: opt.label,
                        value: opt.label
                    }
                }))
            }}
            value={formData.author}
            onChange={(option) => {
                setFormData(cur => ({
                    ...cur,
                    author: {
                        label: option.val.value,
                        value: option.val.value
                    }
                }))
            }}
        />
    )
}
