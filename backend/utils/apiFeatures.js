//! query and queryStr
/*
    query => mongoose command that we use to do any crud operation
    queryStr => Query in url (anything after ?) Eg: http://localhost:4000/products?keyword=mens so keyword=mens is Query and here we are using it as querystr
*/

class ApiFeatures {
    constructor(query, queryStr) {
        this.query = query
        this.queryStr = queryStr
    }

    search() {
        // Getting the query (Product.find()) and the queryStr (keyword that user is passing as query)

        // Check if the keyword is present or not
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: "i"
            }
        } : {}

        // Find all the products which contains the following keyword otherwise just find all the products
        this.query = this.query.find({ ...keyword })
        return this
    }

    filter() {

    }
}

module.exports = { ApiFeatures }