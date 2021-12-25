const Product = require('../models/product');

exports.addProduct = async (req, res, next) => {
        
        const product = new Product({
                name: req.body.name.toLowerCase(),
                quantity: req.body.quantity,
                lastmodifiedby: req.user.email
        });

        await product.save( function (error) {
                
                if(error) 
                        return res.status(501).send({ message: "Error in adding the product. Check product details."});
                
                res.status(200).send({ message: "Product added successfully.", uid: product.uid, name: product.name });
                console.log("Product : " + product.name + " added to database.");
                next();
        });
};



exports.deleteProduct = async (req, res, next) => {
        
        let product;
        try{
        product = await Product.findOneAndDelete({ _id: req.body.id });
        }
        catch(e){
                return res.status(501).json({ message: "Error in deleting product. Check product details. Try Again"});
        }     
          
                
                if(!product) 
                        return res.status(400).json({ message: "Product Not Found. Check product details."});
                
                res.status(200).json({ message: "Product deleted successfully.", name: product.name });
                console.log("Product : " + product.name + " deleted from database.");
                next();
     
};



exports.updateProductQuantity = async (req, res, next) => {
        
        let productUpdateSuccess ;
        try{
        productUpdateSuccess = await Product.updateOne({ _id: req.body.id }, { quantity: req.body.quantity, lastmodifiedby: req.user.email }) ;
        }
        catch(e){
                return res.status(501).json({ "message": "Error in updating product. Check product details. Try Again"});
        }
                
        if(!productUpdateSuccess) 
                return res.status(400).json({ message: "Product Not Found. Check product details."});
                
        return res.status(200).json({ message: "Product updated successfully.", success : true});
        next();
       
        
};


exports.findProduct = async (req, res, next) => {
        
        
        var found;
        try {
         const productName =  req.query.name.trim().toLowerCase(); 
         found = await Product.findOne({ name: productName });
        }
        catch(e){
                console.log("Unable to find");
        }
        if(!found)
                return res.status(501).json({ message: "Error in fetching product. Check product name."});
                
                
        return res.status(200).json(found);
}


exports.listAllProducts = async (req, res, next) => {
        

        try{
        const all = await Product.find();
        return res.status(200).json(all);
        }
        catch(e){
                return res.status(501).send({ message: "Error in fetching products. Try again"});
        }
  
};
