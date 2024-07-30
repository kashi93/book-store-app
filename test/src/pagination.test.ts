// THIS DATA FROM SEEDER
// MAKE SURE RUN SEEDER FIRST BEFORE RUNNING THIS TEST

import axios from "./utils/axios"
import { BASE_URL } from "./utils/config"

afterEach(async () => {
    // await new Promise(resolve => setTimeout(resolve, 500))
})

describe("Book pagination", () => {
    const size = 10;
    let cap: string;

    it("should be return first page", async () => {
        const response = await axios.get(`${BASE_URL}/book`);

        expect(response.status).toBe(200);
        expect(response.data.currentPage).toBe(1);
        expect(response.data.data.length).toBe(size);
    })

    it("should be return first page set size", async () => {
        const response = await axios.get(`${BASE_URL}/book`, {
            params: {
                pageSize: 20
            }
        });

        expect(response.status).toBe(200);
        expect(response.data.currentPage).toBe(1);
        expect(response.data.data.length).toBe(20);
    })

    it("should be return second page", async () => {
        const response = await axios.get(`${BASE_URL}/book`, {
            params: {
                page: 2
            }
        });

        expect(response.status).toBe(200);
        expect(response.data.currentPage).toBe(2);
        expect(response.data.data.length).toBe(size);

        cap = JSON.stringify(response.data.data);
    });

    it("should be return first page with search specific book", async () => {
        const response = await axios.get(`${BASE_URL}/book`, {
            params: {
                search: "en"
            }
        });

        expect(response.status).toBe(200);
        expect(response.data.currentPage).toBe(1);
        expect(response.data.data.length).toBe(10);
        expect(JSON.stringify(response.data.data)).not.toBe(cap);

        cap = JSON.stringify(response.data.data);
    });

    it("should be return first page with search specific ISBN", async () => {
        const response = await axios.get(`${BASE_URL}/book`, {
            params: {
                search: "9780"
            }
        });

        expect(response.status).toBe(200);
        expect(response.data.currentPage).toBe(1);
        expect(response.data.data.length).toBe(10);
        expect(JSON.stringify(response.data.data)).not.toBe(cap);

        cap = JSON.stringify(response.data.data);
    });

    it("should be return first page with search specific Author", async () => {
        const response = await axios.get(`${BASE_URL}/book`, {
            params: {
                search: "Yūki Tabata"
            }
        });

        expect(response.status).toBe(200);
        expect(response.data.currentPage).toBe(1);
        expect(response.data.data.length).toBe(1);
        expect(JSON.stringify(response.data.data)).not.toBe(cap);

        cap = JSON.stringify(response.data.data);
    });

    it("should be return first page with search specific Category", async () => {
        const response = await axios.get(`${BASE_URL}/book`, {
            params: {
                search: "comic"
            }
        });

        expect(response.status).toBe(200);
        expect(response.data.currentPage).toBe(1);
        expect(response.data.data.length).toBe(3);
        expect(JSON.stringify(response.data.data)).not.toBe(cap);

        cap = JSON.stringify(response.data.data);
    });
})

describe("Order pagination", () => {
    const size = 10;
    let cap: string;

    it("should be return first page", async () => {
        const response = await axios.get(`${BASE_URL}/order`);

        expect(response.status).toBe(200);
        expect(response.data.currentPage).toBe(1);
        expect(response.data.data.length).toBe(size);
    })

    it("should be return first page set size", async () => {
        const response = await axios.get(`${BASE_URL}/order`, {
            params: {
                pageSize: 20
            }
        });

        expect(response.status).toBe(200);
        expect(response.data.currentPage).toBe(1);
        expect(response.data.data.length).toBe(20);
    })

    it("should be return second page", async () => {
        const response = await axios.get(`${BASE_URL}/order`, {
            params: {
                page: 2
            }
        });

        expect(response.status).toBe(200);
        expect(response.data.currentPage).toBe(2);
        expect(response.data.data.length).toBe(size);

        cap = JSON.stringify(response.data.data);
    });

    it("should be return first page with search specific status", async () => {
        const response = await axios.get(`${BASE_URL}/order`, {
            params: {
                search: "Pending"
            }
        });

        expect(response.status).toBe(200);
        expect(response.data.currentPage).toBe(1);
        expect(response.data.data.length).toBeGreaterThan(1)
        expect(Array.from(Array(response.data.data.length), () => "Pending")).toEqual(response.data.data.map((item: any) => item.status))
    });

    // Sometime this test will fail due to dynamic seeder data
    it("should be return first page with search specific price", async () => {
        const response = await axios.get(`${BASE_URL}/order`, {
            params: {
                search: "124.9"
            }
        });

        expect(response.status).toBe(200);
        expect(response.data.currentPage).toBe(1);
        expect(response.data.data.length).toBeGreaterThanOrEqual(1)
    });

    // Sometime this test will fail due to dynamic seeder data
    it("should be return first page with search specific customer first name", async () => {
        const name = "Zoe";
        const response = await axios.get(`${BASE_URL}/order`, {
            params: {
                search: name
            }
        });

        expect(response.status).toBe(200);
        expect(response.data.currentPage).toBe(1);
        expect(response.data.data.length).toBeGreaterThanOrEqual(1)
        expect(Array.from(Array(response.data.data.length), () => name))
            .toEqual(response.data.data.map((item: any) => `${item.customer.firstName}`))
    });

    // Sometime this test will fail due to dynamic seeder data
    it("should be return first page with search specific customer full name", async () => {
        const name = "Zoe Nelson";
        const response = await axios.get(`${BASE_URL}/order`, {
            params: {
                search: name
            }
        });

        expect(response.status).toBe(200);
        expect(response.data.currentPage).toBe(1);
        expect(response.data.data.length).toBeGreaterThanOrEqual(1)
        expect(Array.from(Array(response.data.data.length), () => name))
            .toEqual(response.data.data.map((item: any) => `${item.customer.firstName} ${item.customer.lastName}`))
    });

    // Sometime this test will fail due to dynamic seeder data
    it("should be return first page with search specific book title", async () => {
        const name = "Naruto";
        const response = await axios.get(`${BASE_URL}/order`, {
            params: {
                search: name
            }
        });

        expect(response.status).toBe(200);
        expect(response.data.currentPage).toBe(1);
        expect(response.data.data.length).toBeGreaterThanOrEqual(1)

    });

    // Sometime this test will fail due to dynamic seeder data
    it("should be return first page with search specific book category name", async () => {
        const name = "Comic";
        const response = await axios.get(`${BASE_URL}/order`, {
            params: {
                search: name
            }
        });

        expect(response.status).toBe(200);
        expect(response.data.currentPage).toBe(1);
        expect(response.data.data.length).toBeGreaterThanOrEqual(1)

    });
})



