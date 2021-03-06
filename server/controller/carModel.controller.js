const db = require('../config/db.config.js');
const CarModel = db.carModel;
const Section = db.section;
const Gallery = db.gallery;
const KeyFeatures = db.keyFeatures;
const ExtrafeaturesJointable = db.extrafeaturesJointable;
const Extrafeatures = db.extrafeatures;
const keyFeaturesService = require('../service/keyFeatures.service');
const videoService = require('../service/video.service.js');
// Post a carBrand
exports.create = (req, res, next) => {	
	// Save to MySQL database
	var model = req.body;
	if(!model.usedCar)
		model.usedCar = null;
	if(!model.exchange)
		model.exchange = false;
	console.log(model);
	var keyFeatures = model.keyFeatures;
	CarModel.create({  
		name: model.name,
		arName: model.arName,
		mainImageId: req.body.mainImage,
		carBrandId: model.brandId,
		firstParagraph: model.firstParagraph,
		arFirstParagraph: model.arFirstParagraph,
		usedCar:model.usedCar,
		price:model.price,
		userId:model.userId,
		isPublished:model.isPublished,
		exchange:model.exchange
	}).then(carModel => {
		model.extraFeatures.forEach(option => {
			ExtrafeaturesJointable.create({carModelId:carModel.id,extraFeaturesId:option})
		});

		Section.create({firstHeader:"slider",carModelId: carModel.id}).then(section=>{
			Section.create({firstHeader:"body",carModelId: carModel.id}).then(section=>{
				Section.create({firstHeader:"brochures",carModelId: carModel.id}).then(section=>{
					if(keyFeatures){
						keyFeatures.carModelId = carModel.id;
						KeyFeatures.create(keyFeatures).then(()=>{
							res.send(carModel);
						})
					}else{
						res.send(carModel);
					}
				})
			})
		}).catch(next);
	}).catch(next);
	
};
 
exports.findBycarBrandId = (req, res, next) => {
	const carBrandId = req.params.carBrandId;
	CarModel.findAll({include: [
		{ model: db.file, as: 'mainImage' }
	],
	where:{carBrandId:carBrandId,usedCar:null}}).then((carModels)=>{
		// next();
		var jsonResult = [];
		if(carModels.length ==0){
			res.status(200).send(jsonResult);
		}
		for (let index = 0; index < carModels.length; index++) {
			const element = carModels[index];
			
			jsonElement = element.toJSON();
			keyFeaturesService.getKeyFeatures(jsonElement.id,jsonElement,function(jsonElement){
				
				jsonResult.push(jsonElement);

				if(index == carModels.length - 1){
					res.status(200).send(jsonResult);
		
				}
			})
		}
	}).catch(next);
};


exports.findAllcars = (req, res, next) => {
	var filterObject = {};
	filterObject.isPublished = true;
	filterObject.exchange = false;
	if(req.body.carBrandId)
		filterObject.carBrandId = req.body.carBrandId;

	if(req.body.usedCar){
		filterObject.usedCar = req.body.usedCar;
		filterObject.isPublished = req.body.isPublished;
	}
	else
		filterObject.usedCar = null;

	if(req.body.exchange){
		filterObject.exchange = req.body.exchange;
	}

	CarModel.findAll({include: [
		{ model: db.file, as: 'mainImage' },
		{ model: db.carbrand, as:'car_brand'},
		{ model: db.users,}
	],where:filterObject}).then((carModels)=>{
		// next();
		var jsonResult = [];
		if(carModels.length ==0){
			res.status(200).send([]);
		}
		for (let index = 0; index < carModels.length; index++) {
			const element = carModels[index];
			
			jsonElement = element.toJSON();
			keyFeaturesService.getKeyFeatures(jsonElement.id,jsonElement,function(jsonElement){
				
				jsonResult.push(jsonElement);

				if(index == carModels.length - 1){
					res.status(200).send(jsonResult);
		
				}
			})
		}
	}).catch(next);
};

exports.getExtraFeaturesByCar = (req, res, next) => {
	carId = req.params.carModelId;
	ExtrafeaturesJointable.findAll({include: [
		{ model: db.extrafeatures, as: 'extraFeatures' }
	], where:{carModelId:carId},order:[['createdAt', 'DESC']]}).then(extraFeatures =>{
		jsonExtraFeatures = [];
		for (let index = 0; index < extraFeatures.length; index++) {
			jsonExtraFeatures.push(extraFeatures[index].extraFeatures.toJSON());
		}
		res.send(jsonExtraFeatures);
	}).catch(next);
};
exports.findByName = (req, res, next) => {
	CarModel.findAll({where:{name:req.params.modelName}}).then(carModel => {
		// next()
		model = carModel[0];
		var jsonResult = model.toJSON();

		KeyFeatures.findAll({where:{carModelId:model.id},order:[['createdAt', 'DESC']]}).then(keyFeatures =>{
			keyFeatures = keyFeatures[0];
			jsonResult.keyFeatures = keyFeatures.toJSON();

			ExtrafeaturesJointable.findAll({include: [
				{ model: db.extrafeatures, as: 'extraFeatures' }
			], where:{carModelId:model.id},order:[['createdAt', 'DESC']]}).then(extraFeatures =>{
				
				jsonResult.extraFeatures = [];
				for (let index = 0; index < extraFeatures.length; index++) {
					jsonResult.extraFeatures.push(extraFeatures[index].extraFeatures.toJSON());
				}
			Section.findAll({where:{carModelId:model.id} ,order:[['firstHeader', 'DESC']] }).then(sections =>{
				jsonResult.sections = [];
				for (let index = 0; index < sections.length; index++) {
					jsonResult.sections.push(sections[index].toJSON());
					Gallery.findAll({include: [
						{ model: db.file, as: 'file' }
					], where:{sectionId:jsonResult.sections[index].id}}).then(files =>{
						jsonResult.sections[index].files = [];
						for (let index2 = 0; index2 < files.length; index2++) {
							const element = files[index2].toJSON();
							jsonResult.sections[index].files.push(element);
						}
						if(index === jsonResult.sections.length - 1){
							res.send(jsonResult);
						}
					})
					
				}
			})
		})
	})
	}).catch(next);
};
exports.findAllExtraFeatures = (req, res, next)=>{
	Extrafeatures.findAll().then(extrafeatures => {
		res.send(extrafeatures);
	}).catch(next);
}
exports.update = (req, res, next) => {
	const id = req.params.carModelId;
	carModelObject = req.body
	carModelObject.carBrandId = carModelObject.brandId
	CarModel.update( carModelObject, 
					 { where: {id: req.params.carModelId} }
					 ).then(() => {
						if(carModelObject.extraFeatures && carModelObject.extraFeatures.length > 0 ){
							ExtrafeaturesJointable.destroy({
								where: { carModelId: id }
							  }).then(() => {
								carModelObject.extraFeatures.forEach(option => {
									ExtrafeaturesJointable.create({carModelId:carModelObject.id,extraFeaturesId:option})
								});
							  })
						}
						if(carModelObject.keyFeatures){
							KeyFeatures.update(carModelObject.keyFeatures,{
								where: {id: carModelObject.keyFeatures.id}
							}).then((updated) =>{
								console.log(updated);
								if(updated[0] == 0){
									carModelObject.keyFeatures.carModelId = carModelObject.id
									KeyFeatures.create(carModelObject.keyFeatures).then((created) =>{
									
									});
								}
								
								res.status(200).send("updated successfully a carBrand with id = " + id);
							})
						}else{
							res.status(200).send("updated successfully a carBrand with id = " + id);
						}
						// next()
				   }).catch(next);
};

// Delete a carBrand by Id
exports.delete = (req, res, next) => {
	const id = req.params.carModelId;
	CarModel.destroy({
	  where: { id: id }
	}).then(() => {
		// next()
	  res.status(200).send('deleted successfully a carModel with id = ' + id);
	}).catch(next);
};

exports.createExtraFeature=(req,res,next)=>{
	extraFeatureObject = req.body;
	Extrafeatures.create(extraFeatureObject).then( (created)=>{
		res.send(created);
	}).catch(next);

}