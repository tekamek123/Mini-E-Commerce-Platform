export type Product = {
  id: string; // Updated to match UUID in Supabase or FakeStore ID
  title: string;
  price: number;
  description: string;
  category: string;
  image: string; // Alternatively 'image_url' if strictly mapping to DB
  rating: {
    rate: number;
    count: number;
  };
};

export type CartItem = Product & {
  quantity: number;
};

export type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
};

export type Order = {
  id: string;
  user_id: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number;
  created_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  quantity: number;
  price_at_time: number;
  created_at: string;
};
