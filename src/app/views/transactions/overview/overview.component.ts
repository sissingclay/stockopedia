import { Component, TemplateRef } from '@angular/core';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

import { Transaction } from './../../../shared/services/transactions/transactions';
import { TransactionsService } from './../../../shared/services/transactions/transactions.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent {
  modalRef: BsModalRef;
  deleteItem: Transaction;

  constructor(
    public transaction: TransactionsService,
    private readonly modalService: BsModalService,
    private readonly toastr: ToastrService,
  ) {}

  openModal(template: TemplateRef<any>, data: Transaction): void {
    this.deleteItem = data;
    this.modalRef = this.modalService.show(template);
  }

  deleteRecord(): void {
    this.transaction.deleteTransaction(this.deleteItem.id).subscribe(
      (_) => {
        this.deleteItem = null;
        this.modalRef.hide();
      },
      (_) => {
        this.toastr.error('everything is broken', 'Major Error', {
          timeOut: 3000,
        });
      },
    );
  }

  transactionID(index, item): void {
    return item.id;
  }
}
