export type View = 
  | 'DASHBOARD' 
  | 'SALE' 
  | 'PURCHASE' 
  | 'PAYMENTS' 
  | 'EXPENSES' 
  | 'REPORTS' 
  | 'SETTINGS'
  | 'CATEGORIES'
  | 'UNITS'
  | 'ITEMS'
  | 'SUPPLIERS'
  | 'CUSTOMERS'
  | 'REMINDERS';

export interface Category {
  id: string;
  name: string;
  subcategories: string[];
}

export interface Unit {
  id: string;
  name: string;
}

export interface Item {
  id: string;
  name: string;
  barcode: string;
  costPrice: number;
  salePrice: number;
  defaultDisc: number;
  description: string;
  brand: string;
  categoryId: string;
  subCategoryId: string;
  stock: number;
  lowStockValue: number;
  location: string;
  isActive: boolean;
}

export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  openingBalance: number;
  openingDate: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  cnic: string;
  ntn: string;
  openingBalance: number;
  openingDate: string;
  isBlacklisted: boolean;
  creditLimit: number;
  isActiveLimit: boolean;
}

export interface SaleItem {
  itemId: string;
  name: string;
  qty: number;
  price: number;
  discount: number;
  total: number;
}

export interface Sale {
  id: string;
  invoiceNo: string;
  date: string;
  customerId: string;
  items: SaleItem[];
  subTotal: number;
  discountAmount: number;
  taxAmount: number;
  otherCharges: number;
  total: number;
  paid: number;
  change: number;
  paymentMethod: string;
  status: 'COMPLETED' | 'HOLD' | 'ORDER' | 'CANCELLED';
}

export interface PurchaseItem {
  itemId: string;
  name: string;
  qty: number;
  costPrice: number;
  discount: number;
  total: number;
}

export interface Purchase {
  id: string;
  invoiceNo: string;
  date: string;
  supplierId: string;
  items: PurchaseItem[];
  subTotal: number;
  total: number;
  paid: number;
  balance: number;
  status: 'COMPLETED' | 'ORDER' | 'CANCELLED';
}

export interface Expense {
  id: string;
  date: string;
  head: string;
  detail: string;
  amount: number;
}

export interface Reminder {
  id: string;
  task: string;
  date: string;
  time: string;
  status: 'PENDING' | 'DONE';
  alarmEnabled: boolean;
}

export interface AppSettings {
  companyName: string;
  address: string;
  phone: string;
  currency: string;
  taxRates: { name: string; rate: number }[];
  showPictures: boolean;
  lowStockAlert: 'zero' | 'low';
  theme: 'dark' | 'light';
  printLogo: boolean;
  receiptSize: 'A4' | '3-inch' | 'A5';
  logoUrl?: string;
  passwords: { value: string; hint: string }[];
  installedAt: number;
  isActivated: boolean;
}
