import express from 'express';
import homeController from '../controller/homeController';
let router = express.Router();
const initWebRouter = (app) => {
    router.get('/', homeController.getHomePage);

    // res.sendFile(path.join(__dirname, './index.html'))
    // res.send(`Hello World`)
    // res.render('index.ejs');
    router.get('/detail/user/:userId', homeController.getDetailPage);
    router.post('/create-new-user', homeController.createNewUser);
    router.post('/delete-user', homeController.deleteUser);
    router.get('/edit-user/:userId', homeController.editUser);
    router.post('/update-user', homeController.updateUser);

    router.get('/about', (req, res) => {
        res.send(`Hi World`)
    })
    return app.use('/abc', router)
}
export default initWebRouter;
// module.export = initWebRouter;