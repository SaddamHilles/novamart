import mongoose, { HydratedDocument, Schema } from 'mongoose';

export type PaymentMethod = 'Card' | 'Cash on Delivery';
export type OrderStatus = 'Processing' | 'Shipped' | 'Delivered';

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  name: string;
  image: string;
  price: number;
  qty: number;
}

export interface IOrderShipping {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface IOrder {
  user: mongoose.Types.ObjectId;
  customer: { name: string; email: string };
  orderItems: IOrderItem[];
  shippingAddress: IOrderShipping;
  paymentMethod: PaymentMethod;
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: Date;
  isDelivered: boolean;
  deliveredAt?: Date;
  status: OrderStatus;
}

export type OrderDocument = HydratedDocument<IOrder>;

const orderItemSchema = new Schema<IOrderItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    qty: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
    },
    orderItems: { type: [orderItemSchema], required: true },
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentMethod: { type: String, required: true, enum: ['Card', 'Cash on Delivery'] },
    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true },
    taxPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    isPaid: { type: Boolean, default: false },
    paidAt: Date,
    isDelivered: { type: Boolean, default: false },
    deliveredAt: Date,
    status: {
      type: String,
      enum: ['Processing', 'Shipped', 'Delivered'],
      default: 'Processing',
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model<IOrder>('Order', orderSchema);
