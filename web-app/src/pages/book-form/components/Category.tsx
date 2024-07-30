import TextInput from '@/components/TextInput';
import { getContext } from '../providers/BookForm';

export default function Category() {
    const {
        selectIsLoading,
        categories,
        setCategories,
        formData,
        setFormData
    } = getContext([
        "selectIsLoading",
        "categories",
        "setCategories",
        "formData",
        "setFormData"
    ]);

    return (
        <TextInput
            label="Category"
            required
            type="drop-down"
            createAble
            loading={selectIsLoading}
            list={categories.map(a => ({ label: a, value: a }))}
            onCreated={(opt) => {
                setCategories(cur => ([opt.label, ...cur]))
                setFormData(cur => ({
                    ...cur,
                    category: {
                        label: opt.label,
                        value: opt.label
                    }
                }))
            }}
            value={formData.category}
            onChange={(option) => {
                setFormData(cur => ({
                    ...cur,
                    category: {
                        label: option.val.value,
                        value: option.val.value
                    }
                }))
            }}
        />
    )
}
