import mongoose, { HydratedDocument, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface ICartItem {
  product: mongoose.Types.ObjectId;
  name: string;
  image: string;
  price: number;
  qty: number;
}

export interface IShippingAddress {
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
}

export interface IUser {
  name: string;
  email: string;
  password?: string;
  isAdmin: boolean;
  cart: ICartItem[];
  shippingAddress?: IShippingAddress;
  googleId?: string;
  facebookId?: string;
  githubId?: string;
  avatar?: string;
  avatarSource?: 'google' | 'facebook' | 'github' | 'upload';
  matchPassword(plain: string): Promise<boolean>;
}

export type UserDocument = HydratedDocument<IUser>;

const cartItemSchema = new Schema<ICartItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    qty: { type: Number, required: true, min: 1, max: 20 },
  },
  { _id: false }
);

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, minlength: 6, select: false },
    isAdmin: { type: Boolean, default: false },
    cart: { type: [cartItemSchema], default: [] },
    shippingAddress: {
      address: String,
      city: String,
      postalCode: String,
      country: String,
    },
    googleId: { type: String, index: true, sparse: true },
    facebookId: { type: String, index: true, sparse: true },
    githubId: { type: String, index: true, sparse: true },
    avatar: String,
    avatarSource: { type: String, enum: ['google', 'facebook', 'github', 'upload'] },
  },
  { timestamps: true }
);

userSchema.pre('save', async function hashPassword() {
  if (!this.password || !this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.matchPassword = function matchPassword(this: UserDocument, plain: string) {
  if (!this.password) return Promise.resolve(false);
  return bcrypt.compare(plain, this.password);
};

export const User = mongoose.model<IUser>('User', userSchema);
