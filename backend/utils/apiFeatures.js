class ApiFeatures {
  constructor(query, queryStr) {
    // get query (mongoose command) and queryStr (query name to find item)
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    // check if the keyword is provided by the user or not
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};

    // find the products with the query
    this.query = this.query.find({ ...keyword });

    // return the query and queryStr
    return this;
  }

  filter() {
    // copy the queryStr
    const queryStrCopy = { ...this.queryStr };
    console.log(queryStrCopy);

    // set the fields to remove from the query
    const removeFields = ["keyword", "limit", "page"];

    // remove the following query from queryStrCopy
    removeFields.forEach((key) => delete queryStrCopy[key]);
    console.log(queryStrCopy);

    // convert the query to string and modify it for query
    let queryStr = JSON.stringify(queryStrCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);
    console.log(queryStr)

    // find the products with the query
    this.query = this.query.find(JSON.parse(queryStr))

    // return the query and queryStr
    return this
  }

  pagination() {}
}

module.exports = { ApiFeatures };
