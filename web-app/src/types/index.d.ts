export interface Paginate<T> {
    currentPage: number
    data: T[]
    lastPage: number
    perPage: number
    to: number
    total: number
}

enum OrderStatus {
    Pending = "Pending",
    Processing = "Processing",
    Shipped = "Shipped",
    Delivered = "Delivered",
    Cancelled = "Cancelled",
    Returned = "Returned"
}

export interface Book {
    id: string;
    title: string;
    isbn: string; // International Standard Book Number
    author: string;
    category: string;
    price: number;
    stock: number;
    publishedDate?: string;
    description?: string;
    coverImageUrl?: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;

    orderItems: OrderItem[];
}

export interface Customer {
    id: string;
    firstName: string;
    lastName: string;
    address?: string;
    city?: string;
    country?: string;
    postalCode?: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;

    orders: Order[];
}

export interface Order {
    id: number;
    customerId: string;
    totalAmount: number;
    status: OrderStatus;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;

    customer: Customer;
    orderItems: OrderItem[];
}

export interface OrderItem {
    id: string;
    orderId: number;
    bookId: string;
    quantity: number;
    unitPrice: number;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;

    order: Order;
    book: Book;
}
