import { Component, OnInit,ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { flyInOut,expand } from '../animations/app.animation';
import { Feedback, ContactType } from '../shared/feedback';
import{FeedbackService} from '../services/feedback.service';
import { Observable, of } from 'rxjs';
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
    },
    animations: [
      flyInOut(),expand()
    ]
})
export class ContactComponent implements OnInit {
  visibility= true;// le formulaire sera visible initiallement
  errMess: string;// var to catch error
  feedbackForm: FormGroup;
  feedback: Feedback;
  contactType = ContactType;
  feedcopy:Feedback;
  @ViewChild('fform') feedbackFormDirective;
  //les controles et les exigences sur les champs et les msg d'erreurs
  formErrors = {
    'firstname': '',
    'lastname': '',
    'telnum': '',
    'email': ''
  };

  validationMessages = {
    'firstname': {
      'required':      'First Name is required.',
      'minlength':     'First Name must be at least 2 characters long.',
      'maxlength':     'FirstName cannot be more than 25 characters long.'
    },
    'lastname': {
      'required':      'Last Name is required.',
      'minlength':     'Last Name must be at least 2 characters long.',
      'maxlength':     'Last Name cannot be more than 25 characters long.'
    },
    'telnum': {
      'required':      'Tel. number is required.',
      'pattern':       'Tel. number must contain only numbers.'
    },
    'email': {
      'required':      'Email is required.',
      'email':         'Email not in valid format.'
    },
  };

  constructor(private fb: FormBuilder, private feedbackservice: FeedbackService) {
    this.createForm();
  }

  ngOnInit() {
  }
  createForm() {
    this.feedbackForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      telnum: ['', [Validators.required, Validators.pattern] ],
      email: ['', [Validators.required, Validators.email] ],
      agree: false,
      contacttype: 'None',
      message: ''
    });
    this.feedbackForm.valueChanges
    .subscribe(data => this.onValueChanged(data));

  this.onValueChanged(); // (re)set validation messages now

  }// methode pour controler les champs du feedback
  onValueChanged(data?: any) {
    if (!this.feedbackForm) { return; }
    const form = this.feedbackForm;
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
  onSubmit() {
    this.feedback = this.feedbackForm.value;
    console.log(this.feedback);
    this.visibility = false;//le formulaire sera disparu lorsque on clique sur le bouton submit
    //une copie sera aparue 5 secondes pour verifier ce que on a deja envoyé puis elle sera disparue
    this.feedbackservice.submitFeedback(this.feedback).subscribe(feedback =>{
    this.feedcopy=feedback;this.feedback = null;setTimeout(() => { this.feedcopy = null; this.visibility = true; }, 5000);
    },
    errmess => { this.feedback=null ; this.feedcopy = null; this.errMess=<any>errmess;}
    )
    // to reset forms
    this.feedbackForm.reset({
      firstname: '',
      lastname: '',
      telnum: '',
      email: '',
      agree: false,
      contacttype: 'None',
      message: ''
    });
    this.feedbackFormDirective.resetForm();
  }
}
