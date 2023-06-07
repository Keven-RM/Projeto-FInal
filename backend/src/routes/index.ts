import { Router } from "express"; 
import PostController from "../controllers/PostController";
import UserController from "../controllers/UserController";

const router = Router();

router.get('/post/feed/', PostController.getAllPosts);
router.get('/post', PostController.getPostById);
router.post('/post/create', PostController.create);
router.put('/post/interaction', PostController.updatePost);
router.delete('/post/remove', PostController.removePost);


router.get('/user', UserController.listUser);
router.get('/user/:userid', UserController.getUser);
router.post('/user/create', UserController.createUser);
router.put('/user/update', UserController.updateUser);
router.delete('/user/delete', UserController.removeUser);

export default router;