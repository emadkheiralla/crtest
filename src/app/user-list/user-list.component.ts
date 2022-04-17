import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { UserService } from '../user.service';
import { map, tap } from 'rxjs/operators';
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users$: Observable<User[] | undefined>;
  constructor(private userService: UserService, private http: HttpClient, private router: Router) {
    
  }
  ngOnInit(): void {
    this.users$ = this.userService.getUsers()
      .pipe(
        map((data: any) => { return data.data; })
      );
  }

  userDetails(user: User){
    this.router.navigate(['/user-detail'], {state : {selectedUser : user}});
  }

}
