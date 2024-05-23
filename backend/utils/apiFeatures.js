//! query and queryStr
/*
    query => mongoose command that we use to do any crud operation
    queryStr => Query in url (anything after ?) Eg: http://localhost:4000/products?keyword=mens so keyword=mens is Query and here we are using it as querystr
*/

class ApiFeatures {
    constructor(query, queryStr) {
        // Get the query and queryStr
        this.query = query
        this.queryStr = queryStr
    }

    search() {
        // check if the query is sent by the user or not
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: "i"
            }
        } : {}

        // find all the products with the query
        this.query = this.query.find({...keyword})
        return this
    }

    filter() {
        // copying the queryStr (query sent by user)
        const queryStrCopy = {...this.queryStr}
        
        // fields to remove for category from queryStr{}
        const removeFields = ["keyword", "page", "limit"]
        
        // removing the queries from queryStr{}
        removeFields.forEach(key => delete queryStrCopy[key])
        
        // Filter for price and rating
        let queryStr = JSON.stringify(queryStrCopy)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`)

        // find all the products with the query
        this.query = this.query.find(JSON.parse(queryStr))
        return this
    }

    pagination(resultPerPage){
        const currentPage = Number(this.queryStr.page) || 1

        // 1st page => 5 then skip => (5 * 1 - 1) => 0
        // 2nd page => 5 then skip => (5 * 2 - 1) => 5
        // 3rd page => 5 then skip => (5 * 3 - 1) => 10
        const skip = resultPerPage * (currentPage - 1)

        this.query = this.query.limit(resultPerPage).skip(skip)
        return this
    }
}

module.exports = { ApiFeatures }