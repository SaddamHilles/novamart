import express from 'express';
import type { FilterQuery } from 'mongoose';
import { Product, type IProduct } from '../models/Product';
import { asyncHandler } from '../middleware/error';
import { admin, protect, requireUser } from '../middleware/auth';

const router = express.Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const search = typeof req.query.search === 'string' ? req.query.search : '';
    const category = typeof req.query.category === 'string' ? req.query.category : '';
    const filter: FilterQuery<IProduct> = {};

    if (category && category !== 'All') {
      filter.category = category;
    }
    if (search.trim()) {
      const q = new RegExp(search.trim(), 'i');
      filter.$or = [{ name: q }, { brand: q }, { description: q }];
    }

    const products = await Product.find(filter).sort({ featured: -1, createdAt: -1 });
    const categories = await Product.distinct('category');
    res.json({ products, categories });
  })
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.json(product);
  })
);

router.post(
  '/:id/reviews',
  protect,
  asyncHandler(async (req, res) => {
    const user = requireUser(req);
    const { rating, comment } = req.body as { rating?: number; comment?: string };
    if (!rating || !comment) {
      res.status(400).json({ message: 'Rating and comment are required' });
      return;
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    const alreadyReviewed = product.reviews.some(
      (review) => review.user.toString() === user._id.toString()
    );
    if (alreadyReviewed) {
      res.status(400).json({ message: 'You already reviewed this product' });
      return;
    }

    product.reviews.push({
      user: user._id,
      name: user.name,
      rating: Number(rating),
      comment,
    });
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length;

    await product.save();
    res.status(201).json(product);
  })
);

router.post(
  '/',
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  })
);

router.put(
  '/:id',
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.json(product);
  })
);

router.delete(
  '/:id',
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.json({ message: 'Product removed' });
  })
);

export default router;
