export interface Transaction {
  cashflow: number;
  date: Date | string;
  id: number;
  type: 'buy' | 'sell' | 'deposit' | 'withdrawal';
  value: number;
  security?: string;
  shares?: number;
}

export interface Transactions {
  transactions: Transaction[];
}
