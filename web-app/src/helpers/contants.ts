import { Paginate } from "../types";

export const initialPaginate = <T>(): Paginate<T> => ({
    currentPage: 1,
    data: [],
    lastPage: 1,
    perPage: 10,
    to: 1,
    total: 0,
});

export const initialPaginateParams = {
    search: "",
    page: 1,
    pageSize: 10
};