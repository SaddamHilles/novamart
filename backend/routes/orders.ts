import express from 'express';
import { Product } from '../models/Product';
import { Order, type IOrderItem, type IOrderShipping, type PaymentMethod } from '../models/Order';
import { asyncHandler } from '../middleware/error';
import { protect, requireUser } from '../middleware/auth';

const router = express.Router();

function totals(items: IOrderItem[]) {
  const itemsPrice = Number(items.reduce((sum, item) => sum + item.price * item.qty, 0).toFixed(2));
  const shippingPrice = itemsPrice > 100 ? 0 : 8;
  const taxPrice = Number((itemsPrice * 0.08).toFixed(2));
  const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));
  return { itemsPrice, shippingPrice, taxPrice, totalPrice };
}

router.post(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const user = requireUser(req);
    const { shippingAddress, paymentMethod } = req.body as {
      shippingAddress?: IOrderShipping;
      paymentMethod?: PaymentMethod;
    };
    if (!user.cart.length) {
      res.status(400).json({ message: 'Your cart is empty' });
      return;
    }
    if (
      !shippingAddress?.address ||
      !shippingAddress.city ||
      !shippingAddress.postalCode ||
      !shippingAddress.country
    ) {
      res.status(400).json({ message: 'Complete shipping address is required' });
      return;
    }

    const orderItems: IOrderItem[] = [];
    for (const item of user.cart) {
      const product = await Product.findById(item.product);
      if (!product || product.countInStock < item.qty) {
        res.status(400).json({ message: `${item.name} is out of stock` });
        return;
      }
      product.countInStock -= item.qty;
      await product.save();
      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        qty: item.qty,
      });
    }

    const prices = totals(orderItems);
    const method: PaymentMethod = paymentMethod === 'Card' ? 'Card' : 'Cash on Delivery';
    const order = await Order.create({
      user: user._id,
      customer: { name: user.name, email: user.email },
      orderItems,
      shippingAddress,
      paymentMethod: method,
      ...prices,
      isPaid: method === 'Card',
      paidAt: method === 'Card' ? new Date() : undefined,
    });

    user.cart = [];
    user.shippingAddress = shippingAddress;
    await user.save();

    res.status(201).json(order);
  })
);

router.get(
  '/mine',
  protect,
  asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: requireUser(req)._id }).sort({ createdAt: -1 });
    res.json(orders);
  })
);

router.get(
  '/:id',
  protect,
  asyncHandler(async (req, res) => {
    const user = requireUser(req);
    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }
    if (order.user.toString() !== user._id.toString() && !user.isAdmin) {
      res.status(403).json({ message: 'Not authorized to view this order' });
      return;
    }
    res.json(order);
  })
);

export default router;
