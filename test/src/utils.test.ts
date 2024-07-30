import axios from "./utils/axios"
import { BASE_URL } from "./utils/config"

afterEach(async () => {
    // await new Promise(resolve => setTimeout(resolve, 500))
})

describe("Utils Testing", () => {
    it("should be not change order status cause request is not admin", async () => {
        const response = await axios.post(`${BASE_URL}/order/change-status`, {
            id: "1",
            status: "Delivered"
        });

        expect(response.status).toBe(401);
    })

    it("should be changed order status", async () => {
        const response = await axios.post(`${BASE_URL}/order/change-status`, {
            id: "1",
            status: "Delivered"
        }, {
            headers: {
                Role: "Admin"
            }
        });

        expect(response.status).toBe(201);
        expect(response.data.id).toBe(1);
        expect(response.data.status).toBe("Delivered");
    })

    it("should not get random isbn cause request is not admin", async () => {
        const response = await axios.get(`${BASE_URL}/book/random-isbn`);

        expect(response.status).toBe(401);
    })

    it("should get random isbn", async () => {
        const response = await axios.get(`${BASE_URL}/book/random-isbn`, {
            headers: {
                Role: "Admin"
            }
        });

        expect(response.status).toBe(200);
    })
})