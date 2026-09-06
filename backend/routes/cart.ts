import express from 'express';
import { Product } from '../models/Product';
import { asyncHandler } from '../middleware/error';
import { protect, requireUser } from '../middleware/auth';

const router = express.Router();

router.get(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    res.json({ cart: requireUser(req).cart });
  })
);

router.post(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const user = requireUser(req);
    const { productId, qty = 1 } = req.body as { productId?: string; qty?: number };
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    if (product.countInStock < qty) {
      res.status(400).json({ message: 'Not enough stock' });
      return;
    }

    const existing = user.cart.find((item) => item.product.toString() === productId);
    if (existing) {
      existing.qty = Math.min(existing.qty + Number(qty), product.countInStock);
      existing.price = product.price;
      existing.name = product.name;
      existing.image = product.image;
    } else {
      user.cart.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        qty: Number(qty),
      });
    }

    await user.save();
    res.json({ cart: user.cart });
  })
);

router.put(
  '/:productId',
  protect,
  asyncHandler(async (req, res) => {
    const user = requireUser(req);
    const qty = Number((req.body as { qty?: number }).qty);
    const item = user.cart.find((entry) => entry.product.toString() === req.params.productId);
    if (!item) {
      res.status(404).json({ message: 'Item not in cart' });
      return;
    }
    if (qty < 1) {
      user.cart = user.cart.filter((entry) => entry.product.toString() !== req.params.productId);
    } else {
      item.qty = qty;
    }
    await user.save();
    res.json({ cart: user.cart });
  })
);

router.delete(
  '/:productId',
  protect,
  asyncHandler(async (req, res) => {
    const user = requireUser(req);
    user.cart = user.cart.filter((entry) => entry.product.toString() !== req.params.productId);
    await user.save();
    res.json({ cart: user.cart });
  })
);

export default router;
