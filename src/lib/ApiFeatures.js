function ApiFeatures(query, queryString) {
    this.query = query;
    this.queryString = queryString;

    this.paginating = () => {
        const page = this.queryString.page || 1;
        const limit = this.queryString.limit || 10;
        const skip = limit * (page - 1);
        this.query = this.query.limit(limit).skip(skip);
        return this;
    };

    this.sorting = () => {
        const sort = this.queryString.sort || '-createdAt';
        this.query = this.query.sort(sort);
        return this;
    };

    this.searching = () => {
        const search = this.queryString.search;

        if (search) {
            this.query = this.query.find({
                $text: { $search: search },
            });
        }
        return this;
    };

    this.filtering = () => {
        const queryObj = { ...this.queryString };
        const excludeField = ['page', 'limit', 'sort', 'search'];

        excludeField.forEach((field) => queryObj.delete(field));

        const queryStr = JSON.stringify(queryObj);

        queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g, (match) => '$' + match);

        this.query = this.query.find(JSON.parse(queryStr));

        return this;
    };
}

module.exports = ApiFeatures;
