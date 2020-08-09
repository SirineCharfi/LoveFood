import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Feedback} from '../shared/feedback';
import { baseURL } from '../shared/baseurl';
import { Observable } from 'rxjs';
import {  catchError } from 'rxjs/operators';
import{ProcessHTTPMsgService} from '../services/process-httpmsg.service';
@Injectable({
  providedIn: 'root'
})
//les methodes qu'on peut appeler selon notre besoin
export class FeedbackService {

  constructor(private http: HttpClient,
    private processHTTPMsgService: ProcessHTTPMsgService) { }
  submitFeedback(feedback:Feedback):Observable<Feedback>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this.http.post<Feedback>(baseURL + 'feedback/' , feedback, httpOptions)
      .pipe(catchError(this.processHTTPMsgService.handleError));

  }
  }

