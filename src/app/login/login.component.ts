import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Directive, forwardRef, Attribute,OnChanges, SimpleChanges,Input } from '@angular/core';
import { NG_VALIDATORS,Validator,Validators,AbstractControl,ValidatorFn } from '@angular/forms';
import {ApiService} from '../common/api.service';
import {ActivatedRoute,Router} from '@angular/router';

import { NgForm } from '@angular/forms';
import {CookieService} from 'angular2-cookie/core';
declare var swal: any;
const newLocal: string = 'USERNAME';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

   @ViewChild('btn1') btn1: ElementRef;
   @ViewChild('otpM') otpM: ElementRef;
   @ViewChild('otp_modal') otp_modal: ElementRef;
   @ViewChild('otp_modal1') otp_modal1: ElementRef;
   @ViewChild('forget_password_modal') forget_password_modal: ElementRef;

   @ViewChild('upbOTP') upbOTP:ElementRef;
   @ViewChild('createAcc') inputEl:ElementRef;

  public _api:ApiService;
  public uid:number;
  public user_name:any;
  private token:any;
  public result:any;
  ivup:boolean=false;
  tmp:boolean=true;
  fp:boolean=false;
  votp:boolean=false;
  //msg:string;
  msg1:string;
  cp:boolean=false;
  user:any=[];
  public phoneNo:number;


  msg:boolean=false;
  mobilenoExists:boolean=false;

  ivotp:boolean =false;
  otps:boolean = false;

  sotp:boolean=false;
  fotp:boolean =false;
  phneNo:number;

  ivAuth:boolean=false;
  otpString:any;
  //private cookieWithUsername:any;
  //private cookieWithPassword:any;
  //private rememberMe:any;
  constructor(_api :ApiService,private router:Router,private rou:ActivatedRoute) {
    this._api=_api;
    this.tokenCheck();
    this.router=router;
    this.rou = rou;
 
    //get cookies
    /*this.cookieWithUsername = this._cookieService.get(newLocal);
    this.cookieWithPassword = this._cookieService.get('PASSWORD');
    this.rememberMe = this._cookieService.get('RM');*/

    //remove cookies
    /*this._cookieService.remove(newLocal);
    this._cookieService.remove('PASSWORD');
    this._cookieService.remove('RM');*/
   //swal("hello");

   }

  ngOnInit() {
    let params: any = this.rou.snapshot.params;
    //console.log("myurl=",params.msg);
    this.msg1 =params.msg;
    window.scrollTo(0, 0);
  }
  
/*  loginSubmit(form: any){
//console.log(form);
  let data={
      "TokenNo":"",  
      "login_username":form.email,
        "password":form.password1

      };

    /*  if(rm==true){
       var date = new Date();
       var midnight = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
       //Cookies.set('visits', number, { expires: midnight });

        this._cookieService.put(newLocal, username, {expires:midnight});

        this._cookieService.put('PASSWORD', password, {expires:midnight});

        this._cookieService.put('RM', "true", {expires:midnight});
      }else{
        this._cookieService.removeAll();
      }*/
    /*  this._api.getToken().subscribe( 
        token => {
          data.TokenNo=token; 
    this._api.POST('GetLoginUser',data).subscribe(data =>{
      let res=JSON.parse(data.json).data;
            if(res==undefined){
                this.ivup=true;
                console.log("Invalid authentication");
               //this.revert(form);
              }else{
              
              this.user_name=res[0].user_name;
              if(this.user_name!=null){
               // console.log(this.token+" logged in successfully");
                localStorage.setItem('token',res[0].user_cd);
                localStorage.setItem('user',JSON.stringify(res[0]));
                //get temp cart data
                this.getCartData();
               
                if(!isNaN(this.user_name)){
                  this.router.navigate(['./account']);
                }
                if(JSON.parse(localStorage.getItem('tests'))=== null){
                  this.router.navigate(['./book']);
                }else{
                 let tests= JSON.parse(localStorage.getItem('tests'));
                 let sel_members=[];
                 let sel_locations=[];
                 let user=res[0];
                 if(tests.length > 0){
                  tests.forEach(element => {
                    
                    if(sel_members[element.tid]==undefined||sel_members[element.tid]==[]){
                      sel_members[element.tid]=user;
                    }
                    if(sel_locations[element.tid]==undefined){
                      sel_locations[element.tid]=user.user_address;
                     // this.sel_locations[element.tid]="Plot #119,Road No 10,Jubliee Hills";
                    }
                 
                }); 
                   localStorage.setItem('sel_members',JSON.stringify(sel_members));
                   localStorage.setItem('sel_locations',JSON.stringify(sel_locations));
                 }
                 
                  this.router.navigate(['./cart']);
                }
                
                console.log("logged in successfully");
              }else{
                this.ivup=true;
                ///this.revert(form);
                console.log("invalid authentication");
                 
              }
              this.uid=res[0].uid;
              }
     });
    });
     
  }*/

  reset(form:NgForm){
    form.resetForm();
    //this.fotp=false;
  }

  loginSubmit(form: NgForm,isValid: boolean){
  //console.log(form.value, isValid);

  let data={
      "TokenNo":"",  
      "login_username":form.value.phone,
      "password":form.value.password1
      };
   
    /*  if(rm==true){
       var date = new Date();
       var midnight = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
       //Cookies.set('visits', number, { expires: midnight });

        this._cookieService.put(newLocal, username, {expires:midnight});

        this._cookieService.put('PASSWORD', password, {expires:midnight});

        this._cookieService.put('RM', "true", {expires:midnight});
      }else{
        this._cookieService.removeAll();
      }*/
      if(isValid){
        this._api.getToken().subscribe( 
        token => {
          data.TokenNo=token;
          this._api.POST('GetLoginUser',data).subscribe(data =>{
              let res=JSON.parse(data.json).data;
              
                if(res==undefined){
                  //swal("<small>Invalid Authentication.</small>");
                  this.ivAuth = true;
                  form.resetForm(); 
                }else{
                    //console.log('res',res);
                    if(res[0].user_token != null){
                      localStorage.setItem('token',res[0].user_token);
                      let nk=res[0].user_name.split(" ");
                      res[0].firstname=nk[0];
                      res[0].lastname=nk[1];
                      
                      localStorage.setItem('user',JSON.stringify(res[0]));
                      //get temp cart data
                      // this.getCartData();
                      
                          if(res[0].user_address=="NA"){
                            this.router.navigate(['./account']);
                          }else {
                            this.getCartData();
                          }
                            console.log("logged in successfully");
                            //swal("<small>Logged in successfully</small>");
                    }else{
                      console.log("invalid authentication");
                      //swal("<small>Invalid Authentication.</small>");
                      form.resetForm(); 
                    }
                }


          });

        })

      }else{
          console.log("");
      }

  }

  revert(form:any){
     form.reset();
  }

 save(form: NgForm,isValid: boolean) {

 //console.log(isValid);
  let data = {
        "TokenNo":'SomeTokenHere',
        "Mobile":form.value.Mobile,
        "password":form.value.password
           }

    //console.log(data);
    if(isValid){
      this._api.getToken().subscribe( 
        token => {
          data.TokenNo=token;
      this._api.POST('AccountCreation', data).subscribe(data =>{

        this.result=(JSON.parse(data.json).data);

        //this.result = reslt[0].id;
          if(this.result== undefined){
           // this.msg = "Mobile number already exists";
            swal("Mobile number already exists");
            form.resetForm();
           //window.location.reload();
          }else{
            this.result=(JSON.parse(data.json).data);
              if(this.result[0].id!=null){ 
                //this.msg = "Account created successfully";
                //window.alert("Account created");
                 swal("Account created!");
                 form.resetForm();
                //window.location.reload();
              }else{
                window.alert("failed to create an account");
                form.resetForm();
              }
          }
      
       });  
      });   

    }else{

    }

     
  }


  register(form: NgForm,isValid: boolean) {
      let data = {
              "TokenNo":'SomeTokenHere',
              "Mobile":form.value.mobile,
              "customer_name":form.value.first_name+' '+form.value.last_name
                }
          //console.log("data",data);

    if(isValid){
      //console.log("true");
      this._api.getToken().subscribe( 
          token => {
            data.TokenNo=token;
            this._api.POST('AccountCreation', data).subscribe(data =>{
                this.result=(JSON.parse(data.json).data);
               console.log('reg',this.result);

                if(this.result== undefined){
                 //swal("<small>Mobile Number already exists</small>");
                  this.mobilenoExists =true;
                  form.resetForm();
                  
                }else{
                  this.phoneNo = form.value.mobile;
                  form.resetForm();
                  this.uid = this.result[0].id;
                  let str = this.result[0].message;
                  let otpStr = str.substr(str.length - 5);
                  this.otpString = otpStr.replace(otpStr.substring(0,2),'XX');
                  this.msg = true;
                  this.mobilenoExists =false;

                   console.log("Otp sent to your registered mobile number");
                   this.btn1.nativeElement.setAttribute("data-target", "#otp_modal");
                   this.btn1.nativeElement.setAttribute("type","button");
                   //console.log(this.btn1.nativeElement);
                  this.btn1.nativeElement.click();
                }
                
                
            })
          });
      }
 }

  UpdatePasswordByOTP(form: NgForm,isValid: boolean){
      if(isValid){
          if(form.value.pwd == form.value.cpwd){
           
               this._api.getToken().subscribe( 
                      token => {

                            let data = {
                            "TokenNo":token,
                            "otp":form.value.term1+form.value.term2+form.value.term3+form.value.term4,
                            "user_id":form.value.user_id,
                            "password":form.value.pwd,
                              }
                        
                           this._api.POST('UpdatePasswordByOTP', data).subscribe(data =>{
                            let resp =(JSON.parse(data.json).data);
                            console.log("resp",resp);
                            if(resp==undefined){
                              //swal("<small>Invalid OTP entered</small>");
                              this.ivotp =true;
                              this.msg = false;
                             // form.resetForm();
                            }else{
                              //this.otps = true;
                              this.ivotp =false;
                              this.msg = false;
                              //swal("<small>Account created successfully</small>");

                               let data={
                                          "TokenNo":"",  
                                          "login_username":form.value.Mobile2,
                                          "password":form.value.pwd
                                          };
                              form.resetForm();
                              //this.otp_modal.nativeElement.click();
                              //this.router.navigate(['./account']);
                          this._api.getToken().subscribe( 
                          token => {
                            data.TokenNo=token;
                            this._api.POST('GetLoginUser',data).subscribe(data =>{
                                let res=JSON.parse(data.json).data;
                                //console.log('res',res);
                               if(res==undefined){
                                    
                                   }else{

                                    if(res[0].user_token != null){
                                        localStorage.setItem('token',res[0].user_token);
                                        localStorage.setItem('user',JSON.stringify(res[0]));
                                            if(res[0].user_address=="NA"){
                                              this.router.navigate(['./account']);
                                              window.location.reload();
                                            }

                                      }else{
                                          console.log("Invalid authentication");
                                      }

                                   }

                            });

                          })

                            }

                           })
                      });
          }else{
              swal("<small>Password and confirm password should be same</small>");
          } 

        }
          // console.log('bool',isValid);
           //console.log('upbotp',data);
 }


   UpdatePasswordByOTP1(form: NgForm,isValid: boolean, uid:number){
      if(isValid){
          if(form.value.pwd == form.value.cpwd){
           
               this._api.getToken().subscribe( 
                      token => {

                            let data = {
                            "TokenNo":token,
                            "otp":form.value.term1+form.value.term2+form.value.term3+form.value.term4,
                            "user_id":uid,
                            "password":form.value.pwd1,
                              }

                              console.log('data',data);
                        
                           this._api.POST('UpdatePasswordByOTP', data).subscribe(data =>{
                            let resp =(JSON.parse(data.json).data);
                            console.log("resp",resp);
                            if(resp==undefined){
                              //swal("<small>Invalid OTP entered</small>");
                             // form.resetForm();
                              this.ivotp =true;
                              this.msg = false;
                            }else{
                              this.ivotp =false;
                              this.msg = false;
                              swal("<small>Password updated successfully</small>");
                              form.resetForm();
                              this.otp_modal1.nativeElement.click();

                             // this.router.navigate(['./account']);
                            }

                           })
                      });
          }else{
              swal("<small>Password and confirm password should be same</small>");
          } 

        }
          // console.log('bool',isValid);
           //console.log('upbotp',data);
 }

    reset1(form:NgForm){
    form.resetForm();
    this.otpM.nativeElement.removeAttribute("data-target");
    this.otpM.nativeElement.setAttribute("type","submit");
    
   }
    reset2(form:NgForm){
    form.resetForm();
    this.btn1.nativeElement.removeAttribute("data-target");
    this.btn1.nativeElement.setAttribute("type","submit");
    
   }

    resendOTP(mobile:number){
  
    this._api.getToken().subscribe( 
      token => {
          let data ={
            'TokenNo':token,
            'mobile':mobile
          }

          this._api.POST('GetForgotPassword', data).subscribe(data =>{
             let response=(JSON.parse(data.json).data);
                 console.log("resendResp",response);

                 if(response == undefined){
                      //form.resetForm();
                     // this.fotp = true;
                     alert("undefined");
                 }else{
                    if(response[0].mobile!=null){ 
                      //swal("<small>OTP sent successfully</small>");
                      window.alert("OTP sent to your registered email id successfully");
                    }else{
                       window.alert("failed to send OTP");
                     
                    }
 
                 }

             });
      });


  }

  tokenCheck(){
    if (localStorage.getItem("token") === null) {
      this.token=null;
    }else{
      this.token=localStorage.getItem("token");
    }
  }

  fp1(){
    this.tmp=false;
    this.fp=true;
  }
/*  getForgotPassword(form:any){

  /*    let data ={
      'TokenNo':'SomeTokenHere',
      'mobile':form.Mobile
    }*/
    
    /*this._api.getToken().subscribe( 
      token => {
        form.TokenNo=token;
       
    this._api.POST('GetForgotPassword', form).subscribe(data =>{
       let response=(JSON.parse(data.json).data);
       //console.log(response[0].mobile);
         if(response[0].mobile!=null){ 
           this.fp=false;
           this.votp=true;
          }else{
           window.alert("failed to send OTP");
          }
          this.uid = response[0].uid;
      
       });
      });
       
  }*/

getForgotPassword(form: NgForm,isValid: boolean){
console.log(isValid);
if(isValid){
    this._api.getToken().subscribe( 
      token => {
          let data ={
            'TokenNo':token,
            'mobile':form.value.Mobile
          }
          this._api.POST('GetForgotPassword', data).subscribe(data =>{
             let response=(JSON.parse(data.json).data);
                 console.log("response",response);
                 if(response == undefined){
                      form.resetForm();
                      this.fotp = true;
                 }else{
                    if(response[0].mobile!=null){ 
                      this.phneNo= response[0].mobile;
                       /*this.fp=false;
                        this.votp=true;*/
                        this.sotp = true;
                        this.fotp = false;
                        form.resetForm();
                        this.forget_password_modal.nativeElement.click();
                        //swal("<small>OTP sent successfully</small>");
                        this.uid = response[0].uid;

                      this.otpM.nativeElement.setAttribute("data-target", "#otp_modal1");
                      this.otpM.nativeElement.setAttribute("type","button");
                      this.otpM.nativeElement.click();
                       this.sotp = false;
                    }else{
                     //window.alert("failed to send OTP");
                     //swal("<small>Failed to send OTP</small>");
                     this.fotp = true;
                    }

                   
                 }

             });
      });

    }
       
  }

/*  getOtpVerification(form:any){
    this._api.getToken().subscribe( 
      token => {
        form.TokenNo=token;
    this._api.POST('GetOtpVerification', form).subscribe(data =>{
       let resp=(JSON.parse(data.json).data);
     //  console.log(resp[0].uid);
      
         if(resp[0].uid!=null){ 
          this.cp =true;
          this.votp=false;
            //this.router.navigate(['./book']);
          }else{
           window.alert("failed to login");
          }
      
       });
      });
  }*/

  getOtpVerification(form: NgForm,isValid: boolean){

      /*if(isValid){

      }else{

      }*/
    this._api.getToken().subscribe( 
      token => {  
          let data = {
            "TokenNo":token,
            "otp":form.value.term1+form.value.term2+form.value.term3+form.value.term4,
            "user_id":form.value.user_id
          }
       
    this._api.POST('GetOtpVerification', data).subscribe(data =>{
       let resp=(JSON.parse(data.json).data);
       //console.log(resp);
       if(resp ==undefined){
          form.resetForm();
       }else{

         if(resp[0].uid!=null){ 
          /*this.cp =true;
          this.votp=false;*/
          swal("<small>OTP verified successfully</small>");
           form.resetForm();
            //this.router.navigate(['./book']);
          }else{
           //window.alert("failed to login");
           swal("OTP verification failed");
           form.resetForm();
          }

       }
        
       });
      });
  }

changePassword(form: NgForm,isValid: boolean){

  if(isValid){
        let data = {
        "TokenNo":"",
        "user_id":form.value.user_id,
        "password":form.value.password
      }
      console.log(data);
  }else{

  }
  /*this._api.getToken().subscribe( 
    token => {
      data.TokenNo=token;
     this._api.POST('ChangePassword',data).subscribe(data =>{
      this.user=JSON.parse(data.json).data;
      console.log("Password changed Successfully");
      window.location.reload();
     });
    });*/ 
  }

  loggedOut(){
  //console.log('rrr',localStorage.getItem('user'));
    if(localStorage.getItem('user')!==null){
            
              let tlist=[];
              let ftids=[];
              let quant=[];
              tlist=JSON.parse(localStorage.getItem('tests'));
              if(tlist!==null){
                 if(tlist.length>0){
                   console.log(tlist);
                  for(let ttest in tlist){
                    ftids.push(tlist[ttest].tid);
                    quant.push(tlist[ttest].quant);
                  }
                 // console.log(ftids,quant);
                  this.saveCartData(ftids,quant); 
                  localStorage.removeItem('tests');
                }
              }else{
                console.log("del");
                 this.saveCartClearData();
              }
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              localStorage.clear();
               
          }
    }
    saveCartClearData(){
      let req_data={
        "TokenNo":"",
        "test_id":"0",
        "uid":JSON.parse(localStorage.getItem('user')).uid,
        "quantity":"0",
        "loc_id":"1",
        "status":"C",
        "is_wishlist":2
      }
      this._api.getToken().subscribe( 
        token => {
          req_data.TokenNo=token;
      this._api.POST('AddtoWishList',req_data).subscribe(data =>{
        let resp=(JSON.parse(data.json).data);
      //console.log(resp);
        });
      });

    }
    saveCartData(ftids,quant){
      let req_data={
        "TokenNo":"",
        "test_id":ftids.join(),
        "uid":JSON.parse(localStorage.getItem('user')).uid,
        "loc_id":"1",
        "status":"A",
        "quantity":quant.join(),
        "is_wishlist":2

      }
      this._api.getToken().subscribe( 
        token => {
          req_data.TokenNo=token;
      this._api.POST('AddtoWishList',req_data).subscribe(data =>{
        let resp=(JSON.parse(data.json).data);
      //console.log(resp);
        });
      });
    }
    getCartData(){
      let req_data={
        "TokenNo":"",
        "uid":JSON.parse(localStorage.getItem('user')).uid,
        "Flag":2

      }
      this._api.getToken().subscribe( 
        token => {
          req_data.TokenNo=token;
      this._api.POST('GetTestWishList',req_data).subscribe(data =>{
        let resp=(JSON.parse(data.json).data);
       // console.log(resp);
        let k=[];
        if((resp!==null)&&(resp!==undefined)){
          if(resp.length > 0){
            if(JSON.parse(localStorage.getItem('tests'))!== null){
            k=JSON.parse(localStorage.getItem('tests'));
            }
            resp.forEach(element => {
              k.push(element);
            });
            console.log(k);

            localStorage.setItem('tests',JSON.stringify(k));
            this.router.navigate(['./cart']);
          }
        }else{
          this.router.navigate(['./book']);
        }
    //     if(JSON.parse(localStorage.getItem('tests'))=== null){
    //       this.router.navigate(['./book']);
    // }else{
        

    //      this.router.navigate(['./cart']);
    // }
      
      
        });
      });

    }

    autoTab(event:any){
      if ( event.target.value.length >= event.target.maxLength && event.target.nextElementSibling ) 
       event.target.nextElementSibling.focus(); 

    }
     autoTab1(event:any,pwd:any){
       if (event.target.value.length >= pwd)
        this.inputEl.nativeElement.focus();
    }

    autoTab2(event:any,pwd:any){
        if (event.target.value.length >= pwd) 
        this.upbOTP.nativeElement.focus();
    }

   

}
