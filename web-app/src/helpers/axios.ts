import defaultAxios from "axios";

const axios = defaultAxios.create({
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
    }
});

axios.interceptors.response.use(
    (res) => res,
    (err) => err.response
);

export default axios;