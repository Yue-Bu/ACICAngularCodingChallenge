import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { LineOfBusiness } from '../LineOfBusiness';
import { LineOfBusinessService } from '../lineOfBusiness.service';
import { QuoteService } from '../quote.service';
import { Quote } from '../Quote';

@Component({
  selector: 'app-lineOfBusiness-detail',
  templateUrl: './lineOfBusiness-detail.component.html',
  styleUrls: [ './lineOfBusiness-detail.component.css' ]
})
export class LineOfBusinessDetailComponent implements OnInit {
  lineOfBusiness: LineOfBusiness | undefined;
  recentQuotes: Quote[] = [];

  constructor(
    private route: ActivatedRoute,
    private lineOfBusinessService: LineOfBusinessService,
    private quoteService: QuoteService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.getLineOfBusiness(params.id);
    });
    this.getRecentQuotes();
  }
  
  get quoteNumber(): number{
    let count = 0;
    this.recentQuotes.forEach(quote => {
      if (quote.lineOfBusiness == this.lineOfBusiness?.id){
        count++;
      }
    });
    return count;
  }

  getLineOfBusiness(id: number): void {
    this.lineOfBusinessService.getLineOfBusiness(id)
      .subscribe(lineOfBusiness => this.lineOfBusiness = lineOfBusiness);
  }
  
  getRecentQuotes(): void {
    this.quoteService
      .getRecentQuotes()
      .subscribe((recentQuotes) => (this.recentQuotes = recentQuotes));
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    if (this.lineOfBusiness) {
      this.lineOfBusinessService.updateLineOfBusiness(this.lineOfBusiness)
        .subscribe(() => this.goBack());
    }
  }
}
