import axios from './utils/axios';
import { BASE_URL } from './utils/config';
import { faker } from '@faker-js/faker';

let bookId: string;
let orderId: string;

afterEach(async () => {
    // await new Promise(resolve => setTimeout(resolve, 500))
})

describe("CRU Book", () => {
    it("should be fail cause request is not admin - create endpoint", async () => {
        const response = await axios.post(`${BASE_URL}/book`, {});
        expect(response.status).toBe(401);
    });

    it("should be fail validation cause data is empty", async () => {
        const response = await axios.post(`${BASE_URL}/book`, {}, {
            headers: {
                Role: "Admin"
            }
        });
        expect(response.status).toBe(400);
    });

    it("should be fail validation cause isbn has been taken", async () => {
        const response = await axios.post(`${BASE_URL}/book`, {
            isbn: "9780141439556" // THIS DATA FROM SEEDER
        }, {
            headers: {
                Role: "Admin"
            }
        });
        expect(response.status).toBe(400);
    });

    it("should be stored only required", async () => {
        const isbn = faker.commerce.isbn();
        const response = await axios.post(`${BASE_URL}/book`, {
            title: faker.commerce.product(),
            isbn,
            author: "Elon Musk",
            category: "Tesla",
            price: Number(faker.commerce.price()),
            stock: faker.number.int({ max: 3 }),
        }, {
            headers: {
                Role: "Admin"
            }
        });

        expect(response.status).toBe(201);
        expect(response.data.isbn).toBe(isbn)

        bookId = response.data.id
    });

    it("should be stored all field", async () => {
        const isbn = faker.commerce.isbn();
        const response = await axios.post(`${BASE_URL}/book`, {
            title: faker.commerce.product(),
            isbn,
            author: "Elon Musk",
            category: "Tesla",
            price: Number(faker.commerce.price()),
            stock: faker.number.int({ max: 3 }),
            publishedDate: faker.date.anytime(),
            description: faker.word.words(),
            coverImageUrl: faker.image.avatar()
        }, {
            headers: {
                Role: "Admin"
            }
        });

        expect(response.status).toBe(201);
        expect(response.data.isbn).toBe(isbn)

        bookId = response.data.id
    });

    it("should be return selected book", async () => {
        const response = await axios.get(`${BASE_URL}/book/${bookId}`);

        expect(response.status).toBe(200);
    });

    it("should be fail cause request is not admin - update endpoint", async () => {
        const isbn = faker.commerce.isbn();
        const title = faker.commerce.product();

        const response = await axios.patch(`${BASE_URL}/book`, {
            id: bookId,
            title,
            isbn,
            author: "Elon Musk",
            category: "Tesla",
            price: Number(faker.commerce.price()),
            stock: faker.number.int({ max: 3 }),
        });

        expect(response.status).toBe(401);
    });

    it("should be updated", async () => {
        const isbn = faker.commerce.isbn();
        const title = faker.commerce.product();

        const response = await axios.patch(`${BASE_URL}/book`, {
            id: bookId,
            title,
            isbn,
            author: "Elon Musk",
            category: "Tesla",
            price: Number(faker.commerce.price()),
            stock: faker.number.int({ max: 3 }),
        }, {
            headers: {
                Role: "Admin"
            }
        });

        expect(response.status).toBe(200);
        expect(response.data.title).toBe(title)
    });
});

describe("CRU Order", () => {
    const mockupOrderItem = [
        {
            id: null,
            bookId: "68a39e89-fd96-40e6-bc55-5e1119f752af", // THIS DATA FROM SEEDER
            quantity: 1,
            unitPrice: 15.99
        },
        {
            id: null,
            bookId: "e6386786-467a-47ba-a642-d9cb851d19b0", // THIS DATA FROM SEEDER
            quantity: 1,
            unitPrice: 9.99
        },
    ];

    let storedOrderItem: any[];

    it("should be fail validation cause data is empty", async () => {
        const response = await axios.post(`${BASE_URL}/order`, {});
        expect(response.status).toBe(400);
    });

    it("should be fail validation cause customer data is empty", async () => {
        const response = await axios.post(`${BASE_URL}/order`, {
            totalAmount: 10,
            status: "Pending",
            customer: {},
            orderItems: mockupOrderItem
        });
        expect(response.status).toBe(400);
    });

    it("should be fail validation cause customer object data is empty", async () => {
        const response = await axios.post(`${BASE_URL}/order`, {
            totalAmount: 10,
            status: "Pending",
            customer: {
                firstName: "",
                lastName: ""
            },
            orderItems: mockupOrderItem
        });

        expect(response.status).toBe(400);
    });

    it("should be fail validation cause order items array field value is empty", async () => {
        const response = await axios.post(`${BASE_URL}/order`, {
            totalAmount: 10,
            status: "Pending",
            customer: {
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName()
            },
            orderItems: [
                {
                    bookId: "024704e7-c57d-48b4-a5ef-e33aa89b34fd",
                    quantity: 1,
                },
                {
                    bookId: "06f14b7b-e565-47f3-a7a4-582d77991727",
                    quantity: 1,
                    unitPrice: 13.99
                },
            ]
        });

        expect(response.status).toBe(400);
    });

    it("should be stored", async () => {
        const response = await axios.post(`${BASE_URL}/order`, {
            totalAmount: mockupOrderItem
                .map(item => item.unitPrice * item.quantity)
                .reduce((prev, total) => total + prev, 0),
            status: "Pending",
            customer: {
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName()
            },
            orderItems: mockupOrderItem
        });

        expect(response.status).toBe(201);

        orderId = response.data.id;
    });

    it("should be return selected order", async () => {
        const response = await axios.get(`${BASE_URL}/order/${orderId}`);

        expect(response.status).toBe(200);
        expect(response.data.id).toBe(orderId);

        storedOrderItem = (response.data.orderItems as any[]).map(item => ({
            id: item.id,
            bookId: item.bookId,
            quantity: item.quantity,
            unitPrice: item.unitPrice
        }));
    });

    it("should be stored even if order items is empty", async () => {
        const response = await axios.post(`${BASE_URL}/order`, {
            totalAmount: 0,
            status: "Pending",
            customer: {
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName()
            },
            orderItems: []
        });

        expect(response.status).toBe(201);
    });

    it("should be fail cause request is not admin - update endpoint", async () => {
        const newMockup = [
            ...storedOrderItem.map(item => ({ ...item, unitPrice: item.unitPrice * 2 })),
            {
                id: null,
                bookId: "aacf34a4-9de5-42ba-948b-5ffe6fb10807", // THIS DATA FROM SEEDER
                quantity: 1,
                unitPrice: 12.99
            },
        ]

        const response = await axios.patch(`${BASE_URL}/order/${orderId}`, {
            totalAmount: newMockup
                .map(item => item.unitPrice * item.quantity)
                .reduce((prev, total) => total + prev, 0),
            status: "Pending",
            customer: {
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName()
            },
            orderItems: newMockup
        });

        expect(response.status).toBe(401);
    });

    it("should be updated", async () => {
        const newMockup = [
            ...storedOrderItem.map(item => ({ ...item, unitPrice: item.unitPrice * 2 })),
            {
                id: null,
                bookId: "aacf34a4-9de5-42ba-948b-5ffe6fb10807", // THIS DATA FROM SEEDER
                quantity: 1,
                unitPrice: 12.99
            },
        ]

        const response = await axios.patch(`${BASE_URL}/order/${orderId}`, {
            totalAmount: newMockup
                .map(item => item.unitPrice * item.quantity)
                .reduce((prev, total) => total + prev, 0),
            status: "Pending",
            customer: {
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName()
            },
            orderItems: newMockup
        }, {
            headers: {
                Role: "Admin"
            }
        });

        expect(response.status).toBe(200);
    });
})

describe("Delete All Data", () => {
    it("Book should be not delete cause request is not admin", async () => {
        const response = await axios.delete(`${BASE_URL}/book/${bookId}`);

        expect(response.status).toBe(401);
    });

    it("Book should be deleted", async () => {
        const response = await axios.delete(`${BASE_URL}/book/${bookId}`, {
            headers: {
                Role: "Admin"
            }
        });

        expect(response.status).toBe(200);
    });

    it("Order should be not delete cause request is not admin", async () => {
        const response = await axios.delete(`${BASE_URL}/order/${orderId}`);

        expect(response.status).toBe(401);
    });

    it("Order should be deleted", async () => {
        const response = await axios.delete(`${BASE_URL}/order/${orderId}`, {
            headers: {
                Role: "Admin"
            }
        });

        expect(response.status).toBe(200);
    });
});