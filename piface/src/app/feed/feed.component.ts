import { Component, OnInit } from '@angular/core';
import {DetailsService} from '../details.service';
import {Http} from '@angular/http';
@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {
img;
  constructor(private users: DetailsService, private http: Http) { }
peoples = [];
savedPeople = [];
saved = false;
door=false;
add=false;
  ngOnInit() {
    this.users.newPeople.subscribe( (x) => {
      console.log(x);
      this.peoples = x;
      this.peoples.slice(0,2);
    });
    this.users.savedPeaopleChange.subscribe( (x) => {
      console.log(x);
      this.savedPeople = x;
    });
  }
  onFileChanged(event) {
    this.img = event.target.files[0];
  }
  onUpload() {
    // this.http is the injected HttpClient
    const uploadData = new FormData();
    uploadData.append('media', this.img);
    uploadData.append('name', 'kiru');
    this.http.post('http://localhost:3000/saved', uploadData)
      .subscribe( x => {
        console.log(x);
      });
  }
  showPeople() {
this.door = true;
this.saved = false;
this.add = false;
  }
  addPeople() {
    this.door = false;
this.saved = false;
this.add = true;
  }
  showSaved() {
    this.door = false;
this.saved = true;
this.add = false;
  }
}
