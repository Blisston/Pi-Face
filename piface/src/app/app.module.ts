import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FeedComponent } from './feed/feed.component';
import { DetailsService} from './details.service';
import {HttpModule} from '@angular/http';
import { LoginComponent } from './login/login.component';
import { SavedComponent } from './saved/saved.component';
import {Routes, RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';

let routes: Routes= [
  {path:'',redirectTo:'/login', pathMatch:'full'},
  {path:'login',component:LoginComponent},
{path:'feed',component:FeedComponent}]

@NgModule({
  declarations: [
    AppComponent,
    FeedComponent,
    LoginComponent,
    SavedComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    RouterModule.forRoot(routes),
    FormsModule
  ],
  providers: [DetailsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
