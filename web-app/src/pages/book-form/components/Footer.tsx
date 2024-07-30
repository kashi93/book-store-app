import PrimaryButton from '@/components/PrimaryButton'
import { getContext } from '../providers/BookForm'

export default function Footer() {
    const {
        submit,
        formSubmitting,
        formData
    } = getContext([
        "submit",
        "formSubmitting",
        "formData"
    ])
    return (
        <div className="flex justify-end">
            <PrimaryButton
                label={formData.id ? "Update" : "Create"}
                onClick={submit}
                loading={formSubmitting}
            />
        </div>
    )
}
