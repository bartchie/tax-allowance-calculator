import { TestBed } from '@angular/core/testing';

import { CaulculatorService, TaxResults } from './caulculator.service';
import { Subscription } from 'rxjs';

// mocs should be separated to another file
const TAX_DEFAULT: TaxResults = {
  taxAllowance: 0,
  incomeTax: 0,
  taxAfterAllowance: 0
}

const TAX_ALLOWANCE_ONE: TaxResults = {
  ...TAX_DEFAULT,
  taxAllowance: 1420
}

const TAX_ALLOWANCE_TWO: TaxResults = {
  taxAllowance: 1071,
  incomeTax: 1775,
  taxAfterAllowance: 704
}

const TAX_ALLOWANCE_THREE: TaxResults = {
  taxAllowance: 548.3,
  incomeTax: 2485,
  taxAfterAllowance: 1936.7
}

const TAX_ALLOWANCE_FOUR: TaxResults = {
  taxAllowance: 489,
  incomeTax: 16612,
  taxAfterAllowance: 16123
}

const TAX_ALLOWANCE_OUT_OF_RANGE: TaxResults = {
  taxAllowance: 0,
  incomeTax: 29412,
  taxAfterAllowance: 29412
}

describe('CaulculatorService', () => {
  let service: CaulculatorService;
  let getTaxSubscribtion: Subscription;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CaulculatorService);
  });

  it('should be no tax to pay', async (done) => {
    let inputCounter = 0;

    getTaxSubscribtion = service.getTaxObservable().subscribe({
      next: (results: TaxResults) => {
        inputCounter++;

        if (inputCounter == 1) {
          expect(results).toEqual(TAX_DEFAULT);
        }
        if (inputCounter == 2) {
          expect(results).toEqual(TAX_ALLOWANCE_ONE);
        }
        if (inputCounter == 3) {
          expect(results).toEqual(TAX_ALLOWANCE_TWO);
        }
        if (inputCounter == 4) {
          expect(results).toEqual(TAX_ALLOWANCE_THREE);
        }
        if (inputCounter == 5) {
          expect(results).toEqual(TAX_ALLOWANCE_FOUR);
        }
        if (inputCounter == 6) {
          expect(results).toEqual(TAX_ALLOWANCE_OUT_OF_RANGE);
          done();
        }
      },
      complete: () => {
        done();
      }
    });

    service.countTax('1');
    service.countTax('10000');
    service.countTax('14000');
    service.countTax('90000');
    service.countTax('130000');
    getTaxSubscribtion.unsubscribe();
  });

  afterEach(() => {
    typeof getTaxSubscribtion !== 'undefined' && getTaxSubscribtion.unsubscribe();
    TestBed.resetTestingModule();
  });
});
