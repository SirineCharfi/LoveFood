import { Injectable } from '@angular/core';
import {  leader} from '../shared/leader';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';
import { map,catchError  } from 'rxjs/operators';
import{ProcessHTTPMsgService} from '../services/process-httpmsg.service';
@Injectable({
  providedIn: 'root'
})
//les methodes qu'on peut appeler selon notre besoin
export class LeaderService {

  constructor(private http: HttpClient,private processHTTPMsgService: ProcessHTTPMsgService) { }
  getLeader(): Observable<leader[]> {
    return this.http.get<leader[]>(baseURL + 'leadership').pipe(catchError(this.processHTTPMsgService.handleError));
  }

  
  getFeaturedleader(): Observable<leader> {
    return this.http.get<leader[]>(baseURL +'leadership?featured=true').pipe(map(leadership => leadership[0])).pipe(catchError(this.processHTTPMsgService.handleError));
  
}

  getleader(id: string): Observable<leader> {
   return this.http.get<leader>(baseURL + 'leadership/' + id).pipe(catchError(this.processHTTPMsgService.handleError));
    }

}
