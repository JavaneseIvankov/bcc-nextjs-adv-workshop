
export type TRole = "admin" | "user" 

export type TUser = {
   name: string,
   avatarUrl: string,
   email: string,
   role: TRole
}

export interface EventPrice {
  regular: number;
  sale?: number;
  currency: string;
}

export interface EventItem {
  name: string;
  date: string;
  image: {
    src: string;
    alt: string;
  };
  slug: string;
  description: string;
  price: EventPrice;
  badge?: {
    text: string;
    color?: string;
  };
}
