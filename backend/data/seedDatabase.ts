import { User } from '../models/User';
import { Product } from '../models/Product';
import { Order } from '../models/Order';
import { catalog } from './products';

type SeedUser = {
  name: string;
  email: string;
  password: string;
  isAdmin?: boolean;
};

async function ensureUser(doc: SeedUser) {
  const existing = await User.findOne({ email: doc.email });
  if (existing) return existing;
  return User.create(doc);
}

export async function seedDatabase({ reset = false } = {}) {
  const productCount = await Product.countDocuments();
  if (productCount && !reset) {
    return { seeded: false };
  }

  if (reset) {
    await Promise.all([User.deleteMany({}), Product.deleteMany({}), Order.deleteMany({})]);
  }

  const admin = await ensureUser({
    name: 'Nova Admin',
    email: 'admin@novamart.dev',
    password: 'Admin123!',
    isAdmin: true,
  });
  const demo = await ensureUser({
    name: 'Alex Rivera',
    email: 'demo@novamart.dev',
    password: 'Demo123!',
  });

  const created = await Product.insertMany(catalog);

  created[0].reviews = [
    { user: demo._id, name: demo.name, rating: 5, comment: 'The sound is rich without being muddy. I wear these all afternoon.' },
    { user: admin._id, name: admin.name, rating: 4, comment: 'Great comfort. Wish the case was a little slimmer.' },
  ];
  created[1].reviews = [
    { user: demo._id, name: demo.name, rating: 5, comment: 'Silent, bright, and the battery actually lasts a full studio day.' },
  ];
  created[2].reviews = [
    { user: demo._id, name: demo.name, rating: 4, comment: 'Looks better in person. Sleep tracking has been surprisingly useful.' },
  ];
  created[3].reviews = [
    { user: admin._id, name: admin.name, rating: 4, comment: 'Warm light, solid brass. A quiet upgrade for any desk.' },
  ];
  created[4].reviews = [
    { user: demo._id, name: demo.name, rating: 5, comment: 'Cream switches are perfect. Typing on this feels like a treat.' },
  ];
  created[5].reviews = [
    { user: admin._id, name: admin.name, rating: 4, comment: 'Louder than it looks. Took it to the park and it held up.' },
  ];
  created[6].reviews = [
    { user: demo._id, name: demo.name, rating: 5, comment: 'Fits a camera and a water bottle without looking bulky.' },
  ];
  created[7].reviews = [
    { user: admin._id, name: admin.name, rating: 4, comment: 'Canceling is strong on trains. Case is genuinely pocketable.' },
  ];
  created[8].reviews = [
    { user: demo._id, name: demo.name, rating: 4, comment: 'Heavy in a good way. Coffee stays warm through a whole chapter.' },
  ];
  created[9].reviews = [
    { user: admin._id, name: admin.name, rating: 5, comment: 'Daily carry for a month. Still looks new after rain and metro seats.' },
  ];

  await Promise.all(created.map((product) => product.save()));
  console.log('Seeded NovaMart catalog and demo accounts');
  return { seeded: true };
}
