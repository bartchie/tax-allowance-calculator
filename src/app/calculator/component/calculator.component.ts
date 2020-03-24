import { Component, OnInit } from '@angular/core';
import { CaulculatorService, TaxResults } from '../caulculator.service';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent implements OnInit {
  calculationOutput$: Observable<TaxResults>;
  formControl: FormControl = new FormControl();

  constructor(private calculatorService: CaulculatorService) {}

  ngOnInit(): void {
    this.formControl.valueChanges.subscribe(value => {
      this.calculatorService.countTax(value);
    });

    this.calculationOutput$ = this.calculatorService.getTaxObservable();
  }
}
