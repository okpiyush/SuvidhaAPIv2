const router = require("express").Router();
const Cart = require("../models/Cart");
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");


//CREATE and add new product 
router.post("/", verifyTokenAndAuthorization, async (req, res) => {
    const newProduct = new Cart(req.body);
    console.log(req.body);
    try {
        const saved = await newProduct.save();
        res.status(200).json(saved);
    } catch (Err) {
        res.status(500).json(Err);
    }
})


// update cart
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {

    try {
        console.log("update cart hit");
        const updatedCart = await Cart.findOneAndUpdate(
            { "userId": req.params.id },
            {
                $set: { products: req.body }

            },
            { new: true }
        );
        res.status(200).json(updatedCart);
    } catch (err) {
        res.status(500).json(err);
    }
});


//delete Cart
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json("Cart has been deleted");
    } catch (err) {
        res.status(500).json(err);
    }
})

//add to cart
router.put("/add", verifyTokenAndAuthorization, async (req, res) => {
    const { userId, product } = req.body;
    try {
        const cart = await Cart.findOne({ userId });
        if (cart) {
            const productIndex = cart.products.findIndex((p) => p.productId === product.productId);
            if (productIndex !== -1) {
                cart.products[productIndex].quantity += product.quantity;
            } else {
                cart.products.push({ productId: product.productId, quantity: product.quantity });
            }
            await cart.save();
            console.log("added");
            res.status(200).json({ message: "Cart updated successfully", cart });
        } else {
            const newCart = new Cart({
                userId, products: [{ productId: product.productId, quantity: product.quantity }]
            });
            await newCart.save();
            res.status(200).json({ message: "Cart created successfully", cart: newCart });
        }
    } catch (err) {
        res.status(500).send("Not added");
    }

})

//remove from cart
router.put("/remove", verifyTokenAndAuthorization, async (req, res) => {
    const { userId, productId } = req.body;
    try {
        const cart = await Cart.findOne({ userId });
        if (cart) {
            cart.products = cart.products.filter(p => p.productId !== productId);
            await cart.save();
            res.status(200).json({ message: "Item removed from cart", cart });
        } else {
            res.status(404).json("Cart not found");
        }
    } catch (err) {
        res.status(500).json(err);
    }
})





// get a cart and its details
router.get("/find/:id", verifyTokenAndAuthorization, async (req, res) => {
    const userId = req.params.id;
    console.log(userId);
    try {
        const cart = await Cart.findOne({ "userId": userId });
        if (cart) {
            console.log("i worked");
            res.status(200).json(cart);
        } else {
            const newcart = new Cart({ userId, products: [] });
            await newcart.save();
            res.status(200).json(newcart);
        }

    } catch (err) {
        res.status(500).json(err);
    }
})


//get all cart
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        let carts = await Cart.find();
        res.status(200).json(carts);
    } catch (err) {
        res.status(500).json(err);
    }
})


// //get cart stats 


router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
    try {
        const data = await Cart.aggregate([
            {
                $match:
                {
                    createdAt:
                    {
                        $gte: lastYear
                    }
                }
            },
            {
                $project:
                {
                    month:
                    {
                        $month: "$createdAt"
                    },
                },
            },
            {
                $group:
                {
                    _id: "$month",
                    total:
                    {
                        $sum: 1
                    }
                }
            }
        ])
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router;