import {Router} from "express";
import {
  listAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  getAddress,
} from "./address.controller.js";
import { authenticated } from "../../middlewares/authentication.js";

const router = Router();

router.use(authenticated);

router.get("/",authenticated, listAddresses);         
router.post("/create",authenticated, createAddress);        
router.get("/:id",authenticated, getAddress);         
router.put("/update/:id",authenticated, updateAddress);      
router.delete("/delete/:id",authenticated, deleteAddress);  

export default router;
