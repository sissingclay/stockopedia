import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { ModalModule } from 'ngx-bootstrap/modal';
import { ToastrModule } from 'ngx-toastr';

import { TransactionsService } from './../../../shared/services/transactions/transactions.service';
import { TransactionsServiceStub } from './../../../shared/services/transactions/transactions.service.stub';

import { TransactionComponent } from './transaction.component';

describe('TransactionComponent', () => {
  let component: TransactionComponent;
  let fixture: ComponentFixture<TransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransactionComponent],
      imports: [
        ModalModule.forRoot(),
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        ToastrModule.forRoot(),
      ],
      providers: [
        { provide: TransactionsService, useClass: TransactionsServiceStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.stateLabel).toBe('Add');
    expect(component.isLoading).toBe(false);
    expect(component.transactionForm).toBeDefined();
    expect(component.transactionType).toEqual([
      'deposit',
      'withdraw',
      'buy',
      'sell',
    ]);
    expect(component.ngOnInit).toBeDefined();
    expect(component.setupForm).toBeDefined();
    expect(component.processTransaction).toBeDefined();
  });

  it('should be in add transaction state', () => {
    expect(component).toBeTruthy();
    expect(component.stateLabel).toBe('Add');
    expect(component.isLoading).toBe(false);
    expect(component.transactionForm.value).toEqual({
      date: null,
      type: '',
      security: '',
      shares: null,
      value: null,
      cashflow: null,
      id: null,
    });
    expect(component.transactionForm.invalid).toEqual(true);
    expect(component.transactionForm.valid).toEqual(false);
    const SUBMIT_BTN = fixture.debugElement.query(By.css('button'))
      .nativeElement;
    expect(SUBMIT_BTN.disabled).toBe(true);
    expect(SUBMIT_BTN.textContent.trim()).toBe('Add transaction');
  });

  it('should test adding an transaction', () => {
    const FORM_DATA = {
      date: '20/19/2020',
      type: 'deposit',
      security: '',
      shares: null,
      value: 3200,
      cashflow: null,
      id: null,
    };

    const UPDATE_FORM = (name, value) => {
      component.transactionForm.controls[name].setValue(value);
      component.transactionForm.controls[name].markAsDirty();
      component.transactionForm.controls[name].updateValueAndValidity();
    };

    UPDATE_FORM('date', FORM_DATA.date);
    UPDATE_FORM('type', FORM_DATA.type);
    UPDATE_FORM('value', FORM_DATA.value);

    fixture.detectChanges();

    expect(component.transactionForm.value).toEqual(FORM_DATA);
    const SUBMIT_BTN = fixture.debugElement.query(By.css('button'))
      .nativeElement;
    expect(SUBMIT_BTN.disabled).toBe(false);
  });
});
