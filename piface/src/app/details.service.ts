import { Injectable, EventEmitter } from '@angular/core';
import {Http} from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class DetailsService {
images ;
peoples = [];
newPeople = new EventEmitter();
savedImages ;
savedPeoples = [];
savedPeaopleChange = new EventEmitter();
  constructor(private http: Http) {

    this.images = this.http.get('http://localhost:3000/user');
    this.images.subscribe( (x) => {
      this.peoples = x.json();
      this.newPeople.emit(this.peoples);
    });

    this.savedImages = this.http.get('http://localhost:3000/saved');
    this.savedImages.subscribe( (x) => {
      this.savedPeoples = x.json();
      this.savedPeaopleChange.emit(this.savedPeoples);
    });


   }
addSavedImg() {


}
}
