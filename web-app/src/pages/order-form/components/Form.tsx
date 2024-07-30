import TextInput from '@/components/TextInput';
import { getContext } from '../providers/OrderForm';
import OrderItemForm from './order-item-form';
import { orderStatus } from '../providers/hook';

export default function Form() {
    const {
        formData,
        setFormData
    } = getContext([
        "formData",
        "setFormData"
    ]);

    return (
        <div className="grid gap-5">
            <div className="grid md:grid-cols-2 gap-5">
                <TextInput
                    label="Customer First Name"
                    required
                    value={formData.customer.firstName}
                    onChange={(val) => setFormData(cur => ({ ...cur, customer: { ...cur.customer, firstName: val } }))}
                    readonly={formData.id == null && formData.customer.id != null}
                />
                <TextInput
                    label="Customer Last Name"
                    required
                    value={formData.customer.lastName}
                    onChange={(val) => setFormData(cur => ({ ...cur, customer: { ...cur.customer, lastName: val } }))}
                    readonly={formData.id == null && formData.customer.id != null}
                />
                <TextInput
                    label="Customer Address"
                    type='text-area'
                    style={{ height: 132 }}
                    value={formData.customer.address}
                    onChange={(val) => setFormData(cur => ({ ...cur, customer: { ...cur.customer, address: val } }))}
                    readonly={formData.id == null && formData.customer.id != null}
                />
                <div className="grid gap-5">
                    <TextInput
                        label="Customer Postal Code"
                        value={formData.customer.postalCode}
                        onChange={(val) => setFormData(cur => ({ ...cur, customer: { ...cur.customer, postalCode: val } }))}
                        readonly={formData.id == null && formData.customer.id != null}
                    />
                    <TextInput
                        label="Customer City"
                        value={formData.customer.city}
                        onChange={(val) => setFormData(cur => ({ ...cur, customer: { ...cur.customer, city: val } }))}
                        readonly={formData.id == null && formData.customer.id != null}
                    />

                </div>
                <TextInput
                    label="Customer Country"
                    value={formData.customer.country}
                    onChange={(val) => setFormData(cur => ({ ...cur, customer: { ...cur.customer, country: val } }))}
                    readonly={formData.id == null && formData.customer.id != null}
                />
                <TextInput
                    label="Order Status"
                    type='drop-down'
                    list={orderStatus.map(s => ({ value: s, label: s }))}
                    value={formData.status}
                    onChange={({ val }) => setFormData(cur => ({ ...cur, status: val }))}
                    required
                />
            </div>
            <div className="relative overflow-x-auto">
                <OrderItemForm />
            </div>
        </div>
    )
}
