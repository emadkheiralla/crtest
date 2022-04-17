import {Injectable} from '@angular/core';
import {Observable} from "rxjs/internal/Observable";
import {catchError, filter, map} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import * as env from "../environments/environment"
import {User} from "./models/user.model";
import {throwError} from "rxjs/internal/observable/throwError";
import { BehaviorSubject } from 'rxjs';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class UserService {
 private page = 1;
 usersSubject = new BehaviorSubject<User[]>([]);
 users$: Observable<User[] | undefined> = this.usersSubject.asObservable();
 currUserSubject = new BehaviorSubject<User | undefined>(undefined);
 currUser$: Observable<User | undefined> = this.currUserSubject.asObservable();
 private getUsersUrl = env.getUsersUrl;
 private updateUsersUrl = env.updateUrl;
  constructor(private http: HttpClient) {
  }

  getUsers(): Observable<User[] | undefined>{
    this.users$ = this.http.get<User[]>(this.getUsersUrl + this.page.toString())
      .pipe(
        map((data) => {
          this.usersSubject.next(data);
          return data
        }),
        //   tap(data => console.log(JSON.stringify(data))),
        catchError(this.handleError)
      );
      return this.users$
  }

  selectUserById(userId: number | undefined): Observable<User | undefined> {
    return this.users$
        .pipe(
            map((users:any) => users.data.find((user: any) => user.id == userId)),
            filter(user => !!user)
        );
  }

  updateUser(changes: any): Observable<User> {
    const users: any = this.usersSubject.getValue();
    console.warn('Changes', changes)
    const newUsers = users;
    const userIndex = newUsers.data.findIndex((data: any) => data.id == changes?.id);
    
    newUsers[userIndex] = {
        ...users[userIndex],
        ...changes
    };

    this.usersSubject.next(newUsers);
    this.currUserSubject.next(newUsers[userIndex]);
    return this.http.put<User>(this.updateUsersUrl + changes?.id.toString(), changes);
  }

  private handleError(err: any) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.body?.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }

}
