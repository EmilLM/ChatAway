class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString
    }
    filter() {
         //  1. Filtering
         const queryObj = {...this.queryString};
         const excludedFields = ["page", "sort", "limit", "fields"]
         excludedFields.forEach(el => delete queryObj[el]);
        
         // 2. Advanced filtering :(add $ to sorting operators)
         let queryStr = JSON.stringify(queryObj);
         queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
 
         // for different filtering either add queryObj or queryStr as json
        this.query = this.query.find(JSON.parse(queryStr))

        return this;
    }
    sort() {
        // 3.Sorting (optional -/+ in query for order)
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy)
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
        // limit number of results
        const limit = this.queryString.limit *1 || 50;
        const skip = (page - 1) * limit;
        // /?page=2&limit=1
        this.query = this.query.skip(skip).limit(limit);
      
        return this; 
    }
        
}
module.exports = APIFeatures;