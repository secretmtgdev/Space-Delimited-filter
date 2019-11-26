import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {
  start = new FormControl('');
  contains = new FormControl('');
  contain: Boolean = false;
  end = new FormControl('');
  data = new FormControl('');
  private filtered: String[];
  private mapping: Map<String, number>;
  constructor() { 
    this.reset();
  }

  ngOnInit() {
  }

  reset(): void {
    this.filtered = new Array<String>();
    this.mapping = new Map();
  }

  filterSort(): void {
    if(this.data.value !== '') {
      let files = this.data.value.split(/r?\n/);
      let rgx = new RegExp(`(\/${this.contains.value}.*)+(${this.end.value})$`);
      this.filtered = files.filter(file => {
        let split = file.split('?');
        return this.contain ? rgx.test(split[0]) : !rgx.test(split[0]);
      });
    }
  }

  regSort(): void {
    if(this.data.value !== '') {
      let files = this.data.value.split(/r?\n/);
      for(let i = 0; i < files.length; i++) {
        let split = files[i].split('?')[0].split('/');
        files[i] = split[split.length - 1] === '' ? split[split.length - 2] : split[split.length - 1];
      }

      this.filtered = files.sort((a,b) => a.localeCompare(b));
      let longestLength = -1;
      for(let val of this.filtered) {
        if(typeof(val) !== 'undefined' && val.length > longestLength) longestLength = val.length;
      }
      for(let val of this.filtered) {
        if(typeof(val) !== 'undefined' && val.length < longestLength) val += '`'.repeat(longestLength - val.length);
        this.mapping.set(val, this.mapping.has(val) ? this.mapping.get(val) + 1 : 1);
      }
      this.mapping = new Map([...this.mapping.entries()].sort((a,b) => b[1]-a[1]));
    }
  }
}
