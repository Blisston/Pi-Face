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
  ngOnInit() {
    this.users.newPeople.subscribe( (x) => {
      console.log(x);
      this.peoples = x;
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
      .subscribe();
  }
}
