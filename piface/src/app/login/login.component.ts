import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor( private router: Router) { }

  ngOnInit() {
  }
onSubmit(x) {
  console.log(x.value.user);
  if(x.value.user=='Blisston' && x.value.password=='india'){
    this.router.navigate(['feed']);
  }
}
}
