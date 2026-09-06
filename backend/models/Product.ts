import mongoose, { HydratedDocument, Schema } from 'mongoose';

export interface IReview {
  user: mongoose.Types.ObjectId;
  name: string;
  rating: number;
  comment: string;
}

export interface IProduct {
  name: string;
  brand: string;
  category: string;
  description: string;
  image: string;
  price: number;
  countInStock: number;
  rating: number;
  numReviews: number;
  reviews: IReview[];
  featured: boolean;
}

export type ProductDocument = HydratedDocument<IProduct>;

const reviewSchema = new Schema<IReview>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    countInStock: { type: Number, required: true, min: 0, default: 0 },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    reviews: { type: [reviewSchema], default: [] },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', brand: 'text', description: 'text' });
productSchema.index({ category: 1, featured: 1 });

export const Product = mongoose.model<IProduct>('Product', productSchema);
