class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }


    filter() {
        const queryObj = { ...this.queryString };
        const excluedFields = ['page', 'sort', 'limit', 'fields'];
        excluedFields.forEach(el => delete queryObj[el])

        // 1B) : Advance filtering
        //converting queryObj object in string 
        let qureyStr = JSON.stringify(queryObj);
        qureyStr = qureyStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        console.log(JSON.parse(qureyStr))

        this.query = this.query.find(JSON.parse(qureyStr))
        return this;
    };


    // 2).
    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            console.log(sortBy)
            this.query = this.query.sort(sortBy)
        } else {
            this.query = this.query.sort('-createdAt');
        }

        return this;
    }

    // 3).
    fieldLimiting() {

        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v');
        }
        return this;
    }

    //4)Pagination
    paginate() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 100;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit)
        return this;
    }
}

module.exports = APIFeatures;