import { Component, OnInit } from '@angular/core';
import { LineOfBusiness } from '../LineOfBusiness';
import { LineOfBusinessService } from '../lineOfBusiness.service';
import { QuoteService } from '../quote.service';
import { countBy, orderBy, toPairs, take } from 'lodash';
import { Quote } from '../Quote';

@Component({
  selector: 'app-popular-lines-of-business',
  templateUrl: './popular-lines-of-business.component.html',
  styleUrls: ['./popular-lines-of-business.component.css'],
})
export class PopularLinesOfBusinessComponent implements OnInit {
  linesOfBusiness: LineOfBusiness[] = [];
  recentQuotes: Quote[] = [];

  constructor(
    private lineOfBusinessService: LineOfBusinessService,
    private quoteService: QuoteService
  ) {}

  ngOnInit() {
    this.getLinesOfBusiness();
    this.getRecentQuotes();
  }

  // TODO: Refactor
  get popularLinesOfBusiness(): LineOfBusiness[] {
    let quoteCounts = countBy(
      this.recentQuotes,
      (quote) => quote.lineOfBusiness
    );
    let pairs = toPairs(quoteCounts);
    let quoteOrder = orderBy(pairs, (pair) => pair[1], "desc");
    let topTwo = take(quoteOrder, 2);
    console.log(topTwo);
    let topTwoLinesOfBusiness = topTwo.map(
      (pair) =>
        this.linesOfBusiness.find((l) => l.id.toString() == pair[0]) ??
        ({
          id: 0,
          name: 'Not Found',
          description: 'Not Found',
        } as LineOfBusiness) // TODO: Log error?
    );
    return topTwoLinesOfBusiness;
  }

  getLinesOfBusiness(): void {
    this.lineOfBusinessService
      .getLinesOfBusiness()
      .subscribe(
        (linesOfBusiness) =>
          (this.linesOfBusiness = linesOfBusiness)
      );
  }

  getRecentQuotes(): void {
    this.quoteService
      .getRecentQuotes()
      .subscribe((recentQuotes) => (this.recentQuotes = recentQuotes));
  }
}
