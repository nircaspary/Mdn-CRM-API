class APIFeatures {
  constructor(query, queryString, mode) {
    this.query = query;
    this.queryString = queryString;
    this.mode = mode;
  }

  filter() {
    // 1A) Filtering
    const queryObj = { ...this.queryString };
    const exludedFields = ['page', 'sort', 'limit', 'fields'];
    exludedFields.forEach((e) => delete queryObj[e]);

    // 1B) Advanced Filtering
    let queryStr = JSON.stringify(queryObj);

    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    if (this.mode !== 'search') {
      this.query = this.query.find(JSON.parse(queryStr));
      return this;
    }

    // 1C) Search on string contains

    const key = Object.keys(JSON.parse(queryStr)).join('');
    const value = Object.values(JSON.parse(queryStr)).join('');
    this.query = this.query.find({ [key]: new RegExp(value) });
    return this;
  }

  sort() {
    // 2) Sorting
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
