import axios from "./utils/axios";
import { BASE_URL } from "./utils/config";

test("Checking cors", async () => {
    const response = await axios.get(BASE_URL);

    expect(response.status).toBe(200);
    expect(response.headers['access-control-allow-origin']).toBe('*');
});