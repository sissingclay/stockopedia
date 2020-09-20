import { Location } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import {
  ComponentFixture,
  inject,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { format } from 'date-fns';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ToastrModule } from 'ngx-toastr';

import { TRANSACTION_DATA } from './../../../shared/services/transactions/transactions.data';
import { TransactionsService } from './../../../shared/services/transactions/transactions.service';
import { TransactionsServiceStub } from './../../../shared/services/transactions/transactions.service.stub';

import { OverviewComponent } from './overview.component';

@Component({
  template: '',
})
class DummyComponent {}

describe('OverviewComponent', () => {
  let component: OverviewComponent;
  let fixture: ComponentFixture<OverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OverviewComponent, DummyComponent],
      imports: [
        ModalModule.forRoot(),
        HttpClientTestingModule,
        NoopAnimationsModule,
        ToastrModule.forRoot(),
        RouterTestingModule.withRoutes([
          {
            path: 'transactions/edit/:id',
            component: DummyComponent,
          },
        ]),
      ],
      providers: [
        { provide: TransactionsService, useClass: TransactionsServiceStub },
        Location,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OverviewComponent);
    component = fixture.componentInstance;
    component.transaction.getTransactions().subscribe();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.openModal).toBeDefined();
    expect(component.deleteRecord).toBeDefined();
    expect(component.transactionID).toBeDefined();
  });

  it('should check that table in populated', () => {
    const TABLE = fixture.debugElement.query(By.css('.table')).nativeElement;
    expect(TABLE).toBeTruthy();
    expect(TABLE.querySelectorAll('tbody tr').length).toBe(17);
    expect(TABLE.querySelector('tbody > tr > th').textContent.trim()).toEqual(
      `${TRANSACTION_DATA.transactions[0].id}`,
    );

    expect(
      TABLE.querySelector('tbody > tr > td:nth-of-type(1)').textContent.trim(),
    ).toEqual(
      format(new Date(TRANSACTION_DATA.transactions[0].date), 'dd/MM/yyy'),
    );
    expect(
      TABLE.querySelector('tbody > tr > td:nth-of-type(2)').textContent.trim(),
    ).toEqual(`Deposit`);
    expect(
      TABLE.querySelector('tbody > tr > td:nth-of-type(3)').textContent.trim(),
    ).toEqual(`n/a`);
    expect(
      TABLE.querySelector('tbody > tr > td:nth-of-type(4)').textContent.trim(),
    ).toEqual(`n/a`);
    expect(
      TABLE.querySelector('tbody > tr > td:nth-of-type(5)').textContent.trim(),
    ).toEqual(`£32,000.00`);
    expect(
      TABLE.querySelector('tbody > tr > td:nth-of-type(6)').textContent.trim(),
    ).toEqual(`+ £32,000.00`);
    expect(
      TABLE.querySelector('tbody > tr > td:nth-of-type(7)').textContent.trim(),
    ).toEqual(`Edit`);
    expect(
      TABLE.querySelector('tbody > tr > td:nth-of-type(8)').textContent.trim(),
    ).toEqual(`Delete`);
    expect(
      TABLE.querySelector('tfoot > tr > td:nth-of-type(2)').textContent.trim(),
    ).toEqual(`£21,913.00`);
  });

  it(
    'should test edit',
    waitForAsync(
      inject([Router, Location], (router: Router, location: Location) => {
        const EDIT_LINK = fixture.debugElement.query(
          By.css('.table tbody > tr > td:nth-of-type(7) > a'),
        ).nativeElement;

        EDIT_LINK.click();
        fixture.detectChanges();

        fixture.whenStable().then(() => {
          expect(location.path()).toEqual('/transactions/edit/5');
        });
      }),
    ),
  );

  it('should test delete', () => {
    spyOn(component, 'deleteRecord');
    const DELETE_LINK = fixture.debugElement.query(
      By.css('.table tbody > tr > td:nth-of-type(8) > a'),
    ).nativeElement;

    DELETE_LINK.click();
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(component.deleteRecord).toHaveBeenCalled();
      expect(component.deleteItem).toHaveBeenCalled();
      expect(component.deleteRecord).toHaveBeenCalledWith();
    });
  });
});
