export class ProductFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    // Search for products with the following query string
    search() {
        // get the query string (keyword) if it exists
        const keyword = this.queryStr.keyword
            ? {
                  name: {
                      $regex: this.queryStr.keyword,
                      $options: "i",
                  },
              }
            : {};

        // find the product with the following query string
        this.query = this.query.find({ ...keyword });

        // return the query and query string
        return this;
    }

    // Filter out products with the following query string
    filter() {
        // copy the current query string
        const queryStrCopy = this.queryStr;

        // set the query strings to remove
        const removeQueries = ["page", "limit", "keyword"];

        // remove the following query strings (only keeping category and price query strings)
        removeQueries.forEach((query) => delete queryStrCopy[query]);

        // convert the copied queryStr to string and modify it
        let queryStr = JSON.stringify(queryStrCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

        // find the product with the following query string
        this.query = this.query.find(JSON.parse(queryStr));

        // return the query and query string
        return this;
    }

    // Show a certain no of products in a single page
    pagination(resultsPerPage) {
        /*
            Page | Products | Skip
              1  |     8    |   0
              2  |    16    |   8
              3  |    24    |   16  

              8 * (1 - 1) = 0
              8 * (2 - 1) = 8
              8 * (3 - 1) = 16
        */

        //  get the current page
        const currentPage = this.queryStr.page || 1;

        // no of products to skip per page
        const skip = resultsPerPage * (currentPage - 1);

        // find the products with the following query
        this.query = this.query.limit(resultsPerPage).skip(skip);

        // return the query and query string
        return this;
    }
}
