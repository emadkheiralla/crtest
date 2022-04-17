import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { UserService } from '../user.service';
@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {
  update = false;
  submitted = false;
  userData: FormGroup = new FormGroup({
    id: new FormControl(),
    first_name: new FormControl(),
    last_name: new FormControl(),
    email: new FormControl()
  });
  userId: number;
  user: User;

  constructor(private userService: UserService, private fb: FormBuilder, private router: Router) {
    this.userService.currUserSubject.next(this.router.getCurrentNavigation()?.extras.state?.selectedUser);
  }

  get f() { return this.userData.controls; }

  goHome(){
    this.router.navigateByUrl('/users')
  }

  cancel(){
    this.update = false;
  }

  editUserData(){
    this.update = true;
  }

  updateUserData(){
    this.submitted = true;
    if(this.userData.valid){
      this.userService.updateUser(this.userData.value).subscribe((data: any) => {
        this.user = data;
      });
      this.update = false;
    }
  }

  setUserData(data: User): void {
    this.userData = this.fb.group({
      id: [data.id],
      first_name: [data.first_name, Validators.required],
      last_name: [data.last_name],
      email: [data.email],
      avatar: [data.avatar]
    });
  }



  ngOnInit(): void {
    this.userService.currUserSubject.subscribe((data: any) => {
      this.user = data;
      this.setUserData(this.user)
    });
  }
}

