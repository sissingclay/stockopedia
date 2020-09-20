import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { format } from 'date-fns';
import { ToastrService } from 'ngx-toastr';
import { filter, map } from 'rxjs/operators';
import { Transaction } from './../../../shared/services/transactions/transactions';

import { DATE_MEDIUM } from './../../../../environments/date-format';
import { TransactionsService } from './../../../shared/services/transactions/transactions.service';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss'],
})
export class TransactionComponent implements OnInit {
  stateLabel = 'Add';
  isLoading = true;
  transactionForm: FormGroup;
  transactionType = ['deposit', 'withdraw', 'buy', 'sell'];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly fb: FormBuilder,
    private readonly transaction: TransactionsService,
    private readonly toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      if (params.id) {
        this.stateLabel = 'Edit';
        this.transaction.transactionsData
          .pipe(
            filter((data) => !!data),
            map(
              (data) =>
                data.transactions.filter(
                  (trans) => parseInt(params.id, 10) === trans.id,
                )[0],
            ),
          )
          .subscribe((res) => {
            this.setupForm({
              ...res,
              date: format(new Date(res.date), DATE_MEDIUM),
            });
          });
      }

      if (!params.id) {
        this.setupForm({
          date: null,
          type: '',
          security: '',
          shares: null,
          value: null,
          cashflow: null,
          id: null,
        });
      }
    });
  }

  setupForm(formData): void {
    this.transactionForm = this.fb.group({
      date: [formData.date, [Validators.required]],
      type: [formData.type, [Validators.required]],
      security: [formData.security],
      shares: [formData.shares],
      value: [formData.value, [Validators.required]],
      cashflow: [formData.cashflow],
      id: [formData.id],
    });

    this.isLoading = false;
  }

  processTransaction(): void {
    if (this.transactionForm.valid) {
      const POST_DATA = this.transactionForm.value;
      POST_DATA.cashflow = this.transactionForm.value.value;

      if (!this.transactionForm.value.id) {
        const rest = {};
        Object.keys(this.transactionForm.value)
          .filter((data) => !!this.transactionForm.value[data])
          .map((res) => {
            rest[res] = this.transactionForm.value[res];
          });

        this.transaction.postTransaction(rest as Transaction).subscribe(
          (_) => {
            this.toastr.success('Transaction successfully added!');
          },
          (_) => {
            this.toastr.error('everything is broken', 'Major Error', {
              timeOut: 3000,
            });
          },
        );
      }

      if (this.transactionForm.value.id) {
        this.transaction
          .putTransaction(
            this.transactionForm.value.id,
            this.transactionForm.value,
          )
          .subscribe(
            (_) => {
              this.toastr.success('Transaction successfully updated!');
            },
            (_) => {
              this.toastr.error('everything is broken', 'Major Error', {
                timeOut: 3000,
              });
            },
          );
      }
    }
  }
}
