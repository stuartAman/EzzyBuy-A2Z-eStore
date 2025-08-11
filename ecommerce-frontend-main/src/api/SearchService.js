import client from "./HttpClient";

class SearchService {
    searchByCategory({keyword, pageNumber}) {
        // Fix capitalization
        keyword = keyword.replace(/\w[^\s\\\/]*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));

        if (keyword && pageNumber)
            return client.get(`/search/category?keyword=${keyword}&pageNumber=${pageNumber}`)
                .then(response => response.data);

        return new Promise(resolve => resolve({page: 1, pages: 1, products: []}))
    }

    searchBySubCategory({keyword, pageNumber}) {
        // Fix capitalization
        keyword = keyword.replace(/\w[^\s\\\/]*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));

        if (keyword && pageNumber)
            return client.get(`/search/sub-category?keyword=${keyword}&pageNumber=${pageNumber}`)
                .then(response => response.data);

        return new Promise(resolve => resolve({page: 1, pages: 1, products: []}))
    }

    searchByQuery({keyword, pageNumber}) {
        if (keyword && pageNumber)
            return client.get(`/search?keyword=${keyword}&pageNumber=${pageNumber}`)
                .then(response => response.data);

        return new Promise(resolve => resolve({page: 1, pages: 1, products: []}))
    }
}

export default new SearchService();