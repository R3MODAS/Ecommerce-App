class ApiFeatures {
  constructor(query, queryStr) {
    // get the query (Product.find()) and queryStr (req.query)
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    // check if keyword is present inside the req.query or not
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};

    // find the product with the query
    this.query = this.query.find({ ...keyword });

    // return query and queryStr
    return this;
  }

  filter() {
    // copy the queryStr
    const queryStrCopy = { ...this.queryStr };

    // set the fields to remove from the queryStr we copied
    const removeFields = ["keyword", "limit", "page"];

    // remove the query from the copied queryStr
    removeFields.forEach((key) => delete queryStrCopy[key]);

    // convert the queryStr to string and modify it for providing it as query
    let queryStr = JSON.stringify(queryStrCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

    // find the product with the query
    this.query = this.query.find(JSON.parse(queryStr));

    // return query and queryStr
    return this;
  }

  pagination(resultPerPage) {
    /*
      Total - 50 || Result -> 10
      page: 1 -> 10 || skip = 0
      page: 2 -> 10 || skip = 10
      page: 3 -> 10 || skip = 20
    */

    // get the current no of pages
    const currentPage = Number(this.queryStr.page) || 1;

    // skip the no of products
    const skip = resultPerPage * (currentPage - 1);

    // find the product with the query
    this.query = this.query.limit(resultPerPage).skip(skip);

    // return query and queryStr
    return this;
  }
}

module.exports = { ApiFeatures };
