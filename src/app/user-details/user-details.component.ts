import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit, AfterViewInit {
  state$: Observable<object>;
  userDetails: any;
  update = false;
  submitted = false;
  userData: FormGroup = new FormGroup({
    id: new FormControl(),
    first_name: new FormControl(),
    last_name: new FormControl(),
    email: new FormControl()
  });

  constructor(private activatedRoute: ActivatedRoute, private fb: FormBuilder, private http: HttpClient, private router: Router) { 
    
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
      this.http.put('https://reqres.in/api/users/' + this.userDetails.id, this.userData.value).subscribe({
        next: data => {
          console.warn(data);
          this.userDetails = data;
        },
        error: error => {
            // this.errorMessage = error.message;
            console.error('There was an error!', error);
        }
      });
      this.update = false;
    }
  }

  ngAfterViewInit(): void {
    this.userData = this.fb.group({
      id: [this.userDetails.id],
      first_name: [this.userDetails.first_name, Validators.required],
      last_name: [this.userDetails.last_name],
      email: [this.userDetails.email],
      avatar: [this.userDetails.avatar]
    });
  }

  ngOnInit(): void {
    this.state$ = this.activatedRoute.paramMap
      .pipe(map(() => window.history.state))
    this.state$.subscribe((data: any) => {
      this.userDetails = data.data;
    });
  }

}
