import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Transaction, Transactions } from './transactions';
import { TRANSACTION_DATA } from './transactions.data';

export class TransactionsServiceStub {
  transactionsData: BehaviorSubject<Transactions> = new BehaviorSubject<
    Transactions
  >(null);
  cumulative = 0;

  getTransactions(): Observable<Transactions> {
    return of(TRANSACTION_DATA).pipe(
      tap((transactions: Transactions) => {
        transactions.transactions.map((trans) => {
          this.cumulative =
            trans.cashflow > 0
              ? this.cumulative + trans.value
              : this.cumulative - trans.value;
        });
        this.transactionsData.next(transactions);
      }),
    );
  }

  postTransaction(data: Transaction): Observable<Transactions> {
    return of(TRANSACTION_DATA[0]);
  }

  putTransaction(id: number, data: Transaction): Observable<Transactions> {
    return of(TRANSACTION_DATA[0]);
  }

  deleteTransaction(id: number): Observable<Transactions> {
    return of();
  }
}
