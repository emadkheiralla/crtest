import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users: any;

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.http.get('https://reqres.in/api/users?page=1').subscribe((data: any) => {
      this.users = data;
      console.warn(this.users);
    });
  }

  userDetails(user: any){
    this.router.navigate(['user-detail'], { state: {data: user} });
  }

}
