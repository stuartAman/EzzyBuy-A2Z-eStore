import client from './HttpClient';

class CategoryService {
    // Get list of categories with all subcategories
    getCategoryList() {
        return client.get("/categories/all")
            .then(response => response.data);
    }
}

export default new CategoryService();