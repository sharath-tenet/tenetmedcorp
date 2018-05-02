import { Component, OnInit } from '@angular/core';
import { Directive, forwardRef, Attribute,OnChanges, SimpleChanges,Input } from '@angular/core';
import { NG_VALIDATORS,Validator,Validators,AbstractControl,ValidatorFn } from '@angular/forms';
import {ApiService} from '../common/api.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.component.html',
  styleUrls: ['./contactus.component.css']
})
export class ContactusComponent implements OnInit {
  msg:string=null;

  constructor(private _api:ApiService) { }

  ngOnInit() {
    window.scrollTo(0, 0);
  }


  contactusSubmit(form:NgForm, isValid:boolean){

  console.log(form.valid);
      if(form.valid){
          form.value.purpose="1";
          this._api.getToken().subscribe( 
            token => {
              form.value.TokenNo=token;
          this._api.POST('ContactUs', form.value).subscribe(data =>{ 
            let responce=JSON.parse(data.json).data;
            this.msg=responce[0].message;
              form.resetForm();
            });
          });
      }
    
  }

}
