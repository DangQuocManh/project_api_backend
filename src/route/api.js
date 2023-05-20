import express from 'express';
import apiController from '../controller/ApiController';
let router = express.Router();
import pool from "../configs/connectDB";

const multer = require('multer')
const path = require('path')

//

const initApiRouter = (app) => {
    router.get('/getAllProducts', apiController.getAllProducts)
    router.get('/getAllUsers', apiController.getAllUsers)
    router.post('/createNewUser', apiController.createNewUser)
    router.post('/loginUser', apiController.userLogin)
    router.post('/insertCart', apiController.insertCart)
    router.post('/insertFavoriteProduct', apiController.insertFavoriteProduct)
    router.post('/getDataCart', apiController.getDataCart)
    router.post('/getDataFavorite', apiController.getDataFavorite)

    router.post('/getDataProductFromId', apiController.getDataProductFromId)
    router.post('/updateCart', apiController.updateCart)
    router.post('/deleteItemCart', apiController.deleteItemCart)
    router.post('/getDataUser', apiController.getDataUser)
    router.post('/updateInforUser', apiController.updateInforUser)
    router.post('/updatePassword', apiController.updatePassword)
    router.post('/getDataSearch', apiController.getDataSearch)
    router.post('/addComments', apiController.addComments)
    router.post('/getDataComments', apiController.getDataComments)
    router.post('/addDetailOrder', apiController.addDetailOrder)
    router.post('/addDetailOrderZalo', apiController.addDetailOrderZalo)
    router.post('/getFromProductCode', apiController.getFromProductCode)

    router.get('/getAllOrderAdmin', apiController.getAllOrder)
    router.post('/getOneOrder', apiController.getOneOrder)
    router.post('/updateOrder', apiController.updateOrder)

    router.post('/updateTokenZaloPay', apiController.updateTokenZaloPay)

    router.get('/getAllUsersAdmin', apiController.getAllUsersAdmin)
    router.get('/getAllProductAdmin', apiController.getAllProductAdmin)

    router.post('/getOneUserFromId', apiController.getOneUserFromId)
    router.post('/getOneProductFromId', apiController.getOneProductFromId)

    router.get('/getTopAccount', apiController.getTopAccount)
    router.get('/getTopLatestOrder', apiController.getTopLatestOrder)

    router.post('/getOrderStatistical', apiController.getOrderStatistical)
    router.post('/getAccountStatistical', apiController.getAccountStatistical)

    //Update account/image
    //! Use of Multer
    var storage = multer.diskStorage({
        destination: (req, file, callBack) => {
            callBack(null, './src/public/images/')     // './public/images/' directory name where save the file
        },
        filename: (req, file, callBack) => {
            callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
        }
    })

    var upload = multer({
        storage: storage
    });

    //! Routes start
    //route for Home page
    // router.get('/img', (req, res) => {
    //     res.sendFile(__dirname + '/index.html');
    // });

    //@type   POST
    //route for post data
    router.post("/updateAccount", upload.single('images'), (req, res) => {
        if (!req.file) {
            console.log("No file upload");
            let { idUser, username, password, email, phone, address, type } = req.body;
            var updateData = "UPDATE users SET username=?, password=?, email=?, phone=?, address=?, type=? WHERE id_user=?"
            pool.query(updateData, [username, password, email, phone, address, type, idUser], (err, result) => {
                if (err) throw err
                console.log("file uploaded")
            })
        } else {
            console.log(req.file.filename)
            var images = req.file.filename
            var imgsrc = 'http://localhost:8000/images/' + images
            // var insertData = "INSERT INTO users_file(file_src)VALUES(?)"
            let { idUser, username, password, email, phone, address, type } = req.body;

            var updateData = "UPDATE users SET avatar=?, username=?, password=?, email=?, phone=?, address=?, type=? WHERE id_user=?"
            pool.query(updateData, [imgsrc, username, password, email, phone, address, type, idUser], (err, result) => {
                if (err) throw err
                console.log("file uploaded")
            })
        }
    });

    router.post("/updateProduct", upload.single('images'), (req, res) => {
        if (!req.file) {
            console.log("No file upload");
            let { idPro, product_code, brand_code, name_product, price, product_parameters, description } = req.body;
            var updateData = "UPDATE product SET product_code=?, brand_code=?, name_product=?, price=?, product_parameters=?, description=? WHERE id=?"
            pool.query(updateData, [product_code, brand_code, name_product, price, product_parameters, description, idPro], (err, result) => {
                if (err) throw err
                console.log("file uploaded")
            })
        } else {
            console.log(req.file.filename)
            var images = req.file.filename
            var imgsrc = 'http://localhost:8000/images/' + images
            // var insertData = "INSERT INTO users_file(file_src)VALUES(?)"
            let { idPro, product_code, brand_code, name_product, price, product_parameters, description } = req.body;

            var updateData = "UPDATE product SET product_code=?, brand_code=?, name_product=?, image=?, price=?, product_parameters=?, description=? WHERE id=?"
            pool.query(updateData, [product_code, brand_code, name_product, imgsrc, price, product_parameters, description, idPro], (err, result) => {
                if (err) throw err
                console.log("file uploaded")
            })
        }
    });


    router.post('/deleteAccountByAdmin', apiController.deleteAccountByAdmin)
    router.post('/deleteProductByAdmin', apiController.deleteProductByAdmin)

    router.post("/createAccountByAdmin", upload.single('images'), (req, res) => {
        if (!req.file) {
            console.log("No file upload");
            // let { idUser, username, password, email, phone, address, type } = req.body;
            // var updateData = "UPDATE users SET username=?, password=?, email=?, phone=?, address=?, type=? WHERE id_user=?"
            // pool.query(updateData, [username, password, email, phone, address, type, idUser], (err, result) => {
            //     if (err) throw err
            //     console.log("file uploaded")
            // })
        } else {
            console.log(req.file.filename)
            var images = req.file.filename
            var imgsrc = 'http://localhost:8000/images/' + images
            // var insertData = "INSERT INTO users_file(file_src)VALUES(?)"
            let { username, password, email, phone, address, type } = req.body;

            var updateData = "INSERT INTO users(avatar, username, password, email, phone, address, type) values (?,?,?,?,?,?,?)"
            pool.query(updateData, [imgsrc, username, password, email, phone, address, type], (err, result) => {
                if (err) throw err
                console.log("file uploaded")
            })
        }
    });

    router.post("/createProductByAdmin", upload.single('images'), (req, res) => {
        if (!req.file) {
            console.log("No file upload");
            // let { idUser, username, password, email, phone, address, type } = req.body;
            // var updateData = "UPDATE users SET username=?, password=?, email=?, phone=?, address=?, type=? WHERE id_user=?"
            // pool.query(updateData, [username, password, email, phone, address, type, idUser], (err, result) => {
            //     if (err) throw err
            //     console.log("file uploaded")
            // })
        } else {
            console.log(req.file.filename)
            var images = req.file.filename
            var imgsrc = 'http://localhost:8000/images/' + images
            // var insertData = "INSERT INTO users_file(file_src)VALUES(?)"
            let { product_code, brand_code, name_product, price, product_parameters, description } = req.body;

            var updateData = "INSERT INTO product(product_code, brand_code, name_product, image, price, product_parameters, description) values (?,?,?,?,?,?,?)"
            pool.query(updateData, [product_code, brand_code, name_product, imgsrc, price, product_parameters, description], (err, result) => {
                if (err) throw err
                console.log("file uploaded")
            })
        }
    });

    router.post("/changeAvatarUser", upload.single('images'), (req, res) => {
        if (!req.file) {
            console.log("No file upload");
            // let { idUser, username, password, email, phone, address, type } = req.body;
            // var updateData = "UPDATE users SET username=?, password=?, email=?, phone=?, address=?, type=? WHERE id_user=?"
            // pool.query(updateData, [username, password, email, phone, address, type, idUser], (err, result) => {
            //     if (err) throw err
            //     console.log("file uploaded")
            // })
        } else {
            console.log(req.file.filename)
            var images = req.file.filename
            var imgsrc = 'http://localhost:8000/images/' + images
            let { idUser } = req.body;

            var updateData = "UPDATE users SET avatar=? WHERE id_user=?"
            pool.query(updateData, [imgsrc, idUser], (err, result) => {
                if (err) throw err
                console.log("file uploaded")
            })
        }
    });

    router.post("/getAvatarFromId", apiController.getAvatarFromId)
    router.get("/getAllPost", apiController.getAllPost)

    router.post("/addPost", upload.single('images'), (req, res) => {
        if (!req.file) {
            console.log("No file upload");
        } else {
            console.log(req.file.filename)
            var images = req.file.filename
            var imgsrc = 'http://192.168.0.5:8000/images/' + images
            let { title, content, time, idUser } = req.body;

            var updateData = "INSERT INTO post(image_post, title, content, time_create, id_user) values (?,?,?,?,?)"
            pool.query(updateData, [imgsrc, title, content, time, idUser], (err, result) => {
                if (err) throw err
                console.log("file uploaded")
            })
        }
    })

    router.post("/addPostFavorite", apiController.addPostFavorite)

    router.post("/getListOrderFromName", apiController.getListOrderFromName)

    router.post("/getNewsFavoriteFromIdUser", apiController.getNewsFavoriteFromIdUser)
    return app.use('/api/v1', router);
}
export default initApiRouter;