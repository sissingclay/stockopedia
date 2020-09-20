import { Component, OnInit } from '@angular/core';

import { TransactionsService } from './../../shared/services/transactions/transactions.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
})
export class TransactionsComponent implements OnInit {
  constructor(private readonly transactions: TransactionsService) {}

  ngOnInit(): void {
    this.transactions.getTransactions().subscribe();
  }
}
