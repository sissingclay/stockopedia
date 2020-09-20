import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { BehaviorSubject, Observable } from 'rxjs';
import { filter, first, map, switchMap, tap } from 'rxjs/operators';

import { ENVIRONMENT } from './../../../../environments/environment';
import { Transaction, Transactions } from './transactions';

const TRANSACTION_ENDPOINT = `${ENVIRONMENT.api.domain}${ENVIRONMENT.api.api}${ENVIRONMENT.api.transactions}`;

@Injectable({
  providedIn: 'root',
})
export class TransactionsService {
  transactionsData: BehaviorSubject<Transactions> = new BehaviorSubject<
    Transactions
  >(null);
  cumulative = 0;

  constructor(
    private readonly http: HttpClient,
    private readonly toastr: ToastrService,
  ) {
    this.transactionsData
      .pipe(
        tap((_) => (this.cumulative = 0)),
        filter((data) => !!data),
      )
      .subscribe((transactions) => {
        transactions.transactions.map((trans) => {
          this.cumulative =
            trans.cashflow > 0
              ? this.cumulative + trans.value
              : this.cumulative - trans.value;
        });
      });
  }

  getTransactions(): Observable<Transactions> {
    return this.http.get<Transactions>(TRANSACTION_ENDPOINT).pipe(
      tap((transactions: Transactions) => {
        this.transactionsData.next(transactions);
      }),
    );
  }

  postTransaction(data: Transaction): Observable<Transaction> {
    return this.http.post<Transaction>(TRANSACTION_ENDPOINT, data);
  }

  putTransaction(id: number, data: Transaction): Observable<Transaction> {
    return this.http.put<Transaction>(`${TRANSACTION_ENDPOINT}/${id}`, data);
  }

  deleteTransaction(id: number): Observable<{}> {
    let data;
    let res;

    return this.http.delete<{}>(`${TRANSACTION_ENDPOINT}/${id}`).pipe(
      tap((serverRes) => {
        res = serverRes;
        this.toastr.success('Transaction successfully deleted!');
      }),
      switchMap((_) =>
        this.transactionsData.pipe(
          tap((trans: Transactions) => (data = trans)),
          map((trans: Transactions) => {
            trans.transactions.map((item, i) => {
              if (item.id === id) {
                data.transactions = [
                  ...data.transactions.slice(0, i),
                  ...data.transactions.slice(i + 1),
                ];
                this.transactionsData.next(data);
              }
            });

            return res;
          }),
        ),
      ),
    );
  }
}
