import { Injectable } from '@angular/core';
import {Http} from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class DetailsService {
imges;
  constructor(private http: Http) {
    this.imges = this.http.get('localhost:3000/user');
    console.log(this.imges);
   }

}
