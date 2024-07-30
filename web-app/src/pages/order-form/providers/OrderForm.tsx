import { createContext, useContext } from "react";
import { OrderFormContextInt, init } from "./hook";

export const OrderFormContext = createContext<OrderFormContextInt | undefined>(undefined);
export const getContext = <K extends keyof OrderFormContextInt>(keys: K[]): { [P in K]: OrderFormContextInt[P] } => {
    const ctx = useContext(OrderFormContext);
    if (!ctx) throw new Error("context not found!");

    const contexts = {} as { [P in K]: OrderFormContextInt[P] };

    for (const k of keys) {
        contexts[k] = ctx[k];
    }

    return contexts;
};
export default function OrderForm({ children }: { children: React.ReactNode }) {
    return (
        <OrderFormContext.Provider value={init()}>
            {children}
        </OrderFormContext.Provider>
    )
}
