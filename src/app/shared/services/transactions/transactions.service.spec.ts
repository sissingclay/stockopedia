import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { switchMap, tap } from 'rxjs/operators';
import { ENVIRONMENT } from './../../../../environments/environment';
import { TRANSACTION_DATA } from './transactions.data';

import { TransactionsService } from './transactions.service';

const TRANSACTION_ENDPOINT = `${ENVIRONMENT.api.domain}${ENVIRONMENT.api.api}${ENVIRONMENT.api.transactions}`;

describe('TransactionsService', () => {
  let service: TransactionsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        NoopAnimationsModule,
      ],
    });

    service = TestBed.inject(TransactionsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(service.cumulative).toBe(0);
    expect(service.transactionsData).toBeTruthy();
    expect(service.getTransactions).toBeDefined();
    expect(service.postTransaction).toBeDefined();
    expect(service.putTransaction).toBeDefined();
    expect(service.deleteTransaction).toBeDefined();
  });

  it('should test getTransactions', () => {
    let amount = 0;
    TRANSACTION_DATA.transactions.map((data) => {
      amount = amount + data.cashflow;
    });

    service
      .getTransactions()
      .pipe(
        tap((res) => {
          expect(res).toEqual(TRANSACTION_DATA);
          expect(service.cumulative).toEqual(amount);
        }),
        switchMap((_) => service.transactionsData),
      )
      .subscribe((result) => expect(result).toEqual(TRANSACTION_DATA));

    const req = httpMock.expectOne((req) =>
      req.url.endsWith(TRANSACTION_ENDPOINT),
    );

    expect(req.request.method).toEqual('GET');
    req.flush(TRANSACTION_DATA);
  });

  it('should test postTransaction', () => {
    service
      .postTransaction(TRANSACTION_DATA.transactions[10])
      .subscribe((result) =>
        expect(result).toEqual(TRANSACTION_DATA.transactions[10]),
      );

    const req = httpMock.expectOne((req) =>
      req.url.endsWith(TRANSACTION_ENDPOINT),
    );

    expect(req.request.method).toEqual('POST');
    req.flush(TRANSACTION_DATA.transactions[10]);
  });

  it('should test putTransaction', () => {
    service
      .putTransaction(515, TRANSACTION_DATA.transactions[10])
      .subscribe((result) =>
        expect(result).toEqual(TRANSACTION_DATA.transactions[10]),
      );

    const req = httpMock.expectOne((req) =>
      req.url.endsWith(`${TRANSACTION_ENDPOINT}/515`),
    );

    expect(req.request.method).toEqual('PUT');
    req.flush(TRANSACTION_DATA.transactions[10]);
  });

  it('should test deleteTransaction', () => {
    service
      .deleteTransaction(515)
      .subscribe((result) => expect(result).toEqual({}));

    const req = httpMock.expectOne((req) =>
      req.url.endsWith(`${TRANSACTION_ENDPOINT}/515`),
    );

    expect(req.request.method).toEqual('DELETE');
    req.flush({});
  });
});
