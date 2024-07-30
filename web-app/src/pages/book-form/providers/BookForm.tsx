import { createContext, useContext } from "react";
import { BookFormContextInt, init } from "./hook";

export const BookFormContext = createContext<BookFormContextInt | undefined>(undefined);
export const getContext = <K extends keyof BookFormContextInt>(keys: K[]): { [P in K]: BookFormContextInt[P] } => {
    const ctx = useContext(BookFormContext);
    if (!ctx) throw new Error("context not found!");

    const contexts = {} as { [P in K]: BookFormContextInt[P] };

    for (const k of keys) {
        contexts[k] = ctx[k];
    }

    return contexts;
};
export default function BookForm({ children }: { children: React.ReactNode }) {
    return (
        <BookFormContext.Provider value={init()}>
            {children}
        </BookFormContext.Provider>
    )
}
