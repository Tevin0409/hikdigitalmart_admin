export type Product = {
  photo_url: string;
  name: string;
  description: string;
  created_at: string;
  price: number;
  id: number;
  category: string;
  updated_at: string;
};

//Info: The following data is used for the sidebar navigation and Cmd K bar.
export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard/",
    icon: "dashboard",
    isActive: false,
    shortcut: ["d", "d"],
    items: [], // Empty array as there are no child items for Dashboard
  },
  {
    title: "Products & Inventory",
    url: "#",
    icon: "product",
    isActive: false,
    items: [
      {
        title: "Products",
        url: "/dashboard/product",
        icon: "product",
        shortcut: ["p", "p"],
      },
      {
        title: "Categories & Subcategories",
        url: "/dashboard/product/categories",
        icon: "product",
        shortcut: ["p", "p"],
      },
      // {
      //   title: "Inventory & Subcategories",
      //   url: "/dashboard/product/categories",
      //   icon: "product",
      //   shortcut: ["p", "p"],
      // },
    ], // No child items
  },
  {
    title: "Orders",
    url: "#",
    icon: "billing",
    isActive: false,
    items: [
      {
        title: "Manage Orders",
        url: "/dashboard/order",
        icon: "employee",
        shortcut: ["p", "p"],
      },

      // {
      //   title: "User Logs",
      //   url: "/dashboard/product/categories",
      //   icon: "product",
      //   shortcut: ["p", "p"],
      // },
      // {
      //   title: "Inventory & Subcategories",
      //   url: "/dashboard/product/categories",
      //   icon: "product",
      //   shortcut: ["p", "p"],
      // },
    ], // No child items
  },
  {
    title: "Users",
    url: "#",
    icon: "employee",
    isActive: false,
    items: [
      {
        title: "Manage Users",
        url: "/dashboard/user",
        icon: "employee",
        shortcut: ["p", "p"],
      },

      {
        title: "Technicians",
        url: "/dashboard/technician",
        icon: "product",
        shortcut: ["p", "p"],
      },
      {
        title: "Shop Owners",
        url: "/dashboard/shop-owners",
        icon: "product",
        shortcut: ["p", "p"],
      }
      // {
      //   title: "Inventory & Subcategories",
      //   url: "/dashboard/product/categories",
      //   icon: "product",
      //   shortcut: ["p", "p"],
      // },
    ], // No child items
  },
  {
    title: "Reports",
    url: "#",
    icon: "post",
    isActive: false,
    items: [
      {
        title: "All Reports",
        url: "/dashboard/report",
        icon: "employee",
        shortcut: ["p", "p"],
      },
      {
        title: "Reviews",
        url: "/dashboard/reviews",
        icon: "employee",
        shortcut: ["p", "p"],
      },
    ], // No child items
  },
];

export interface SaleUser {
  id: number;
  name: string;
  email: string;
  amount: string;
  image: string;
  initials: string;
}

export const recentSalesData: SaleUser[] = [
  {
    id: 1,
    name: "Olivia Martin",
    email: "olivia.martin@email.com",
    amount: "+$1,999.00",
    image: "https://api.slingacademy.com/public/sample-users/1.png",
    initials: "OM",
  },
  {
    id: 2,
    name: "Jackson Lee",
    email: "jackson.lee@email.com",
    amount: "+$39.00",
    image: "https://api.slingacademy.com/public/sample-users/2.png",
    initials: "JL",
  },
  {
    id: 3,
    name: "Isabella Nguyen",
    email: "isabella.nguyen@email.com",
    amount: "+$299.00",
    image: "https://api.slingacademy.com/public/sample-users/3.png",
    initials: "IN",
  },
  {
    id: 4,
    name: "William Kim",
    email: "will@email.com",
    amount: "+$99.00",
    image: "https://api.slingacademy.com/public/sample-users/4.png",
    initials: "WK",
  },
  {
    id: 5,
    name: "Sofia Davis",
    email: "sofia.davis@email.com",
    amount: "+$39.00",
    image: "https://api.slingacademy.com/public/sample-users/5.png",
    initials: "SD",
  },
];
