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

router.get("/", listAddresses);         
router.post("/create", createAddress);        
router.get("/:id", getAddress);         
router.put("/update/:id", updateAddress);      
router.delete("/delete/:id", deleteAddress);  

export default router;
