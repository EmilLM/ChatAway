const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/APIFeatures');


exports.getAll = Model => catchAsync(async (req, res, next) => {
    
    const features = new APIFeatures(Model.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    // .explain() for detailed query stats
    const doc = await features.query;
    
    if (!doc) {
        return next(new AppError('Documents could not be found', 404))
    }
    res.json({
        status: 'success', 
        results: doc.length,
        doc
        // users
    }) 
});


exports.createOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body)

    if (!doc) {
        return next(new AppError('Document could not be created!', 404))
    }
    res.json({ 
        status: "success",
        doc    
    }) 
});

exports.getOne = Model => catchAsync(async (req, res, next) => {
    // for populate options
    // add popOptions as a parameter then:
    // let query = Model.findById(req.params.id);
    // if (popOptions) query = query.populate(popOptions);
    // const doc = await query;
    // ADD PATH to the controller to complete populate
    const doc= await Model.findById(req.params.id);

    if (!doc) {
       return next(new AppError('No document found with that id', 404))
    }

    res.json({ 
        status: "success",
         doc    
    })
});



exports.updateOne = Model => catchAsync(async (req, res, next) => {
  
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    })
    if (!doc) {
        return next(new AppError('No document found with that ID', 404));
    }

    res.json({ 
        status: "success",
        doc   
    })
});


exports.deleteOne = Model =>  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    
    if (!doc) {
        return next(new AppError('No document found with that ID', 404));
    }
    res.status(204).json({ 
        status: "success",
        data: null
    })
});

exports.addToModel = Model => catchAsync ( async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(
        req.params.id, 
        {'$addToSet': req.body}, 
        {new: true}
    )

    if (!doc)  return next(new AppError('No document found with that ID', 404));
    
    res.json({ 
        status: 'success',
        doc   
    })
});

exports.removeFromModel = Model => catchAsync ( async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(
        req.params.id, 
        {'$pull': req.body}, 
        {new: true}
    )
    
    if (!doc) return next(new AppError('No document found with that ID', 404));
    
    res.json({ 
        status: 'success',
        doc   
    })
})