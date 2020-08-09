import { Component, OnInit, Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { DishService } from '../services/dish.service';
import { switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Comment} from '../shared/comment';
import{visibility,flyInOut,expand} from '../animations/app.animation';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
    },
    animations: [
      flyInOut(),visibility(),expand()// animation pour le chargement des info du back
    ]
 })
export class DishdetailComponent implements OnInit {
  dish: Dish;
  dishIds: string[];
  prev: string;
  next: string;
  CommentsForm: FormGroup;
  Comment:Comment;
  errMess: string;
  dishcopy: Dish;
  visibility = 'shown';
  //les controles sur les champs pour ajouter une commentaire et les msg d'erreurs convenables
  formErrors = {
    'author': '',
    'comment': '',
    'rating': ''
  };
  validationMessages = {
    'author': {
      'required':      'Author Name is required.',
      'minlength':     'Author Name must be at least 2 characters long.'
      
    },
    'comment': {
      'required':  'Comment is required.' }};

  constructor(private dishservice: DishService,
    private route: ActivatedRoute,
    private location: Location,private fb: FormBuilder,@Inject('BaseURL') private BaseURL)
     { this.CommentForm(); }

  ngOnInit() {
  
    this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
    this.route.params.pipe(switchMap((params: Params) => { this.visibility = 'hidden'; return this.dishservice.getDish(+params['id']); }))
    .subscribe(dish => { this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id); this.visibility = 'shown'; },
      errmess => this.errMess = <any>errmess);//to get dish by id aussi les methodes setPrevNext pour passer d'un plat à un autre 
  }
  CommentForm() {
    this. CommentsForm = this.fb.group({
      author: ['', [Validators.required, Validators.minLength(2)] ],
     comment: ['', [Validators.required] ],
     rating:''
     
    });
    this.CommentsForm.valueChanges
    .subscribe(data => this.onValueChanged(data));

  this.onValueChanged(); // (re)set validation messages now

  }
  onValueChanged(data?: any) {
    if (!this.CommentsForm) { return; }
    const form = this.CommentsForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }}
  
  
  
  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }
  goBack(): void {
    this.location.back();
  }// pour retourner au plat précedent 
  onSubmit() {
    //pr enregistrer commentaire avec la date du jour 
    var d = new Date();
    this.Comment = this.CommentsForm.value;
    this.Comment.date = d.toISOString();
    console.log(this.Comment);
    this.dishcopy.comments.push(this.Comment);
    this.dishservice.putDish(this.dishcopy)
      .subscribe(dish => {
        this.dish = dish; this.dishcopy = dish;
      },
      errmess => { this.dish = null; this.dishcopy = null; this.errMess = <any>errmess; });
   //reset form avec une condition sur rating 
      this.CommentsForm.reset({
      author: '',
      rating: '5',
      comment: '',
    });
   
    

}}