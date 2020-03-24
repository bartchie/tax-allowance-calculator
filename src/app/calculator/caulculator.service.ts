import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface TaxResults {
  taxAllowance: number,
  incomeTax: number,
  taxAfterAllowance: number
}

interface Step {
  min: number,
  max: number,
  test?: any,
  getAllowance: (income?: number) => number
};

const defaultResults: TaxResults = {
  taxAllowance: 0,
  incomeTax: 0,
  taxAfterAllowance: 0
};

@Injectable({
  providedIn: 'root'
})
export class CaulculatorService {
    private taxOutputSubject$: BehaviorSubject<TaxResults> = new BehaviorSubject<TaxResults>(defaultResults);
    private getIncomeTax(totalIncome: number): number {
    const threshold: number = 85528;
    const belowThresholdTaxPercentage: number = 17.75;
    const aboveThresholdTax: number = 15181.22;
    const aboveThresholdSurplusPercentage: number = 32;

    if(totalIncome < threshold) {
      return Math.round(totalIncome * belowThresholdTaxPercentage / 100);
    }
    else if(totalIncome >= threshold) {
      const surplus: number = totalIncome - threshold;
      const surplusAmount: number = Math.max(surplus, 0);
      const countedSurplus: number = surplusAmount * aboveThresholdSurplusPercentage / 100;

      return Math.round(aboveThresholdTax + countedSurplus);
    }
  }

  private getTaxFreeAllowance(totalIncome: number): number {
    let result: number = 0;
    // this one's only for testing purposes to see wich step are we in with our income
    // could be flagged with specific environment but didn't have time for it
    const testFunc = function(inc: number) {console.log(`${this.min} < ${inc} > ${this.max}`)}
    const steps: Step[] = [
      {
        min: 0,
        max: 7999,
        getAllowance: () => 1420
      },
      {
        min: 8000,
        max: 12999,
        getAllowance: income => Math.round(1420 - (871.70 * (income - 8000)) / 5000)
      },
      {
        min: 13000,
        max: 85527,
        getAllowance: () => 548.30
      },
      {
        min: 85528,
        max: 126999,
        getAllowance: income => Math.round(548.30 - (548.30 * (income - 85528) / 41472))
      }
    ];

    steps.forEach((step) => {
      let {min, max, getAllowance} = step; // without step we could put destructurisation into foreach callbacks parameter
      step.test = testFunc;

      if(this.isInRange(totalIncome, min, max)) {
        step.test.call(step, totalIncome);
        result = getAllowance(totalIncome);
      }
    });

    return result;
  }

  private isInRange(input: number, min: number, max: number): boolean {
      return input >= min && input <= max;
  }

  countTax(totalIncome: string): void {
    const totalIncomeNumber = Number(totalIncome);
    const incomeTax: number = this.getIncomeTax(totalIncomeNumber);
    const taxAllowance: number = this.getTaxFreeAllowance(totalIncomeNumber);
    const taxAfterAllowance: number = incomeTax - taxAllowance;
    const results: TaxResults = {
      taxAllowance,
      incomeTax,
      taxAfterAllowance: Math.max(taxAfterAllowance, 0)
    };

    this.taxOutputSubject$.next(results);
  }

  getTaxObservable(): Observable<TaxResults> {
    return this.taxOutputSubject$.asObservable();
  }
}