import {Component, OnInit,ViewChild, ElementRef} from '@angular/core';
// import {StateService} from '../common/state.service';
import {ApiService} from '../common/api.service';
import {Router} from '@angular/router';
import {AppComponent} from '../app.component';
import {NgForm, FormControl,Validators} from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import { BookComponent } from "../book/book.component";

//import { WindowService } from '../common/window.service';
//import * as firebase from 'angularfire2';
//import { AngularFireAuth } from 'angularfire2/auth';
//import {RecaptchaVerifier} from '@firebase/auth-types';

declare var swal: any;
@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
 // providers:[ApiService]
})
export class HomeComponent implements OnInit {

   @ViewChild('btn1') btn1: ElementRef;
   @ViewChild('otpM') otpM: ElementRef;
   @ViewChild('otp_modal') otp_modal: ElementRef;
   @ViewChild('otp_modal1') otp_modal1: ElementRef;
   @ViewChild('forget_password_modal') forget_password_modal: ElementRef;

    @ViewChild('someVar') inputEl:ElementRef;
    @ViewChild('save1') save1:ElementRef;
    public uid:number;

  ptype: string="H";
  _packages1: any[];
  temp2: any[];
  _tempTest: any[];
  windowRef: any = [];
  _packagesSearchResult: any = [];
  getpackagecnf: boolean;

  searchTerm : FormControl = new FormControl('', [Validators.required, Validators.minLength(3)]);
  searchResult = [];
  _packages:any=[];
  public filterKey:any;

    addW: any;
    title: string = 'Center for Excellence Medical Sciences';
  body:  string = 'This is the about home body';
  message: string;
  image_path: string="/assets/images/imagehbg.png";
  geolocationPosition :object;
  testList: any;
  public _appComponent:any;
  //_api: any;
  latitude:any;
  longitude:any;
  queryString:any;
  images:string[]=["sliders/slider_image.png","sliders/slider_image.png","sliders/slider_image.png","sliders/slider_image.png","sliders/slider_image.png","sliders/slider_image.png"]
  images1:string[]=["iconimages/homepage_presn_slider/1.png"];
  top_tests:string[]=["Complete Blood Picture (CBP), EDTA Whole Blood","Lipid Profile, Serum","Liver Function Test (LFT), Serum","Thyroid Antibodies (TG & TPO), Serum","Thyroid Profile (T3,T4,TSH), Serum","1, 25-Dihydroxy Vitamin D, Serum","25 - Hydroxy Vitamin D, Serum","Urea, Serum","Creatinine, Serum","Triple Marker, Serum","Magnesium, Serum"
                      ,"Complete Urine Examination (CUE), Spot Urine","Glucose Fasting (FBS),  Sodium Flouride Plasma","Glycosylated Hemoglobin (HbA1C), EDTA Whole Blood","Uric Acid, Serum","Thyroglobulin (Tg), Serum","Blood Urea Nitrogen (BUN), Serum","Prolactin, Serum","Prothrombin Time With INR, Sodium Citrate Whole Blood","HIV 1 & 2 Antibodies, Serum","Culture And Sensitivity (Aerobic), Urine"];
  loading:any=[];
  mpckgshow:boolean=false;
  _pckg:any=[];
  tmp:any=[];
  tokenSet:boolean=false;

  sotp:boolean=false;
  fotp:boolean =false
  phneNo:any;
  ivotp:boolean =false;
  otps:boolean = false;
  msg:boolean=false;
  mobilenoExists:boolean=false;


   constructor(private _api:ApiService,private router :Router,_appComponent :AppComponent) { 
      // console.log("Get Banners here!");
       //this._api=_api;
       this._appComponent=_appComponent;
        this.tokenSet=this._appComponent.isLoggedIn;
       
        this.queryString;
        
        this.searchTerm.valueChanges
        .debounceTime(400) 
        .subscribe(data => {
        let term = new String(data); 
        if(data==undefined){
          this.mpckgshow=false;
          return false;
        }
       
        if(term.length >=3){
          this._api.getToken().subscribe( 
            token => { 
        this._api.POST('GetServices', {TokenNo: token,pincode:'' ,test_name:data,test_code:'',test_type:'',condition_id:'',speciality_id:'',sort_by:'',sort_order:'',AlphaSearch:'',user_id:'',is_home_collection:"",organ_id:""}).subscribe(data =>{
                        if(data.status==1){
                          this.searchResult=JSON.parse(data.json).data;
                        }else{
                          this.searchResult=[];
                        }
                         
                       });
                      });
                    
     this._api.getToken().subscribe( 
                        token => { 
         this._api.POST('GetPackages',{TokenNo: token,"pincode":"","package_name":data,"package_code":"","sort_by":"","sort_order":"","alphaSearch":"","type":"H"}).subscribe(data =>{
                  if(data.status==1){

                    this._packagesSearchResult=JSON.parse(data.json).data;
                    //this.testsList=[];
                  }else{
                    this._packagesSearchResult=[];
                  }
                  this.mpckgshow=true;
               });
              });

             }      
        })
      
     }
 getlocation(){
  if (window.navigator && window.navigator.geolocation) {
    window.navigator.geolocation.getCurrentPosition(
        position => {
          this.geolocationPosition = position;
         // this.latitude= position.coords.latitude;
         // this.longitude= position.coords.longitude;
         
         this._appComponent.getPostalCode(this.parselatlang());
        //console.log(position);
        //localStorage.setItem('lat', this.latitude);
        //localStorage.setItem('long', this.longitude);
          //console.log("gp",this.geolocationPosition);      
        },
        error => {
            switch (error.code) {
                case 1:
                    console.log('Permission Denied');
                    break;
                case 2:
                    console.log('Position Unavailable');
                    break;
                case 3:
                    console.log('Timeout');
                    break;
            }
        }
    );
};
 }
  ngOnInit() {
    // this.message = this._stateService.getMessage();
    this.getlocation();
    // console.log(this.geolocationPosition);
    //get address by lat lang
    
    localStorage.setItem('showCart',"false");
    this.getPackages();
    window.scrollTo(0, 0);
    // this.windowRef = this.win.windowRef
    // this.windowRef.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container');
    // this.windowRef.recaptchaVerifier.render()
    
  }
  parselatlang(){
   let a= this.getCordinates();
   let lat=a['coords']['latitude'];
   let long=a['coords']['longitude'];
   let res={"latitude":lat,"longitude":long}
   return res;
  }

   autoTab(event:any){
      if ( event.target.value.length >= event.target.maxLength && event.target.nextElementSibling ) 
       event.target.nextElementSibling.focus(); 

    }

  reset(form:NgForm){
    form.resetForm();
    //this.fotp=false; 
  }
    reset1(form:NgForm){
    form.resetForm();
    this.otpM.nativeElement.removeAttribute("data-target");
    this.otpM.nativeElement.setAttribute("type","submit");
    
  }



  getCordinates(){
      return this.geolocationPosition;
  }
  getBookAnAppointment(){
   
     this.router.navigate(['./book']);
  }
  searchBasedOnString(str:any){

     if(str != undefined){
        this.router.navigate(['./book', {searchString:str}]);
      }else{
        return false;
      }
    
  }
  movescaro(obj:any,dir:any){
     if(dir=="left"){
        obj.previous();
     }else if(dir=="right"){
        obj.next();
     }
    
  }
  showHover(val){
      this.addW=val;
  }

  eventHandler(event) {
  
 //console.log(event, event.keyCode, event.keyIdentifier);
   console.log(event.key);
   }
   getPackages(){
    this.mpckgshow=false;
     this.loading['packages']=true;
     this._packages=[];
    this._api.getToken().subscribe(
      token => {
     this._api.POST('GetPackages',{TokenNo: token,"pincode":"","package_name":"","package_code":"","sort_by":"","sort_order":"","alphaSearch":"","type":"H"}).subscribe(data =>{
      if(data.status==1){
        let p=JSON.parse(data.json).data;
        p.forEach(element => {
          if(element.package_price>0){
            this._packages.push(element);
          }
        });
        //this.testsList=[];
        this.loading['packages']=false;
  
      }else{
        this.getpackagecnf=true;
        this._packages=[];
        this.loading['packages']=false;
      }
      //console.log(this._packages);
      return this._packages;
    
     });
    });
   }

   //add pckg cart from here
   getAddPackageCart(pckg:any){
   this._pckg=[];
   let pshare = JSON.parse(localStorage.getItem('packages')); 
    if(pshare){
  
        this.tmp=JSON.parse(localStorage.getItem('packages'));
        this.tmp.forEach(element => {
                  this._pckg.push(element);  
              });
    //console.log('indexOfpckgs',this.IndexOf(pckg));
       if(this.IndexOf(pckg) < 0){
           pckg.quant=1;
        this._pckg.push(pckg);
       }else{ 
        let i=this.IndexOf(pckg);
        let t=this._pckg[i].quant;
        t=t+1;
       
        this._pckg[i].quant=t;
       }
    }else{
    
      pckg.quant=1;
      this._pckg.push(pckg);
    }
    localStorage.setItem('packages',JSON.stringify(this._pckg));
    this._appComponent.setCart();

  }

   getRemovePackageCart(pckg:any){
    let i=this.IndexOf(pckg);
    let t=this._pckg[i].quant;
    if(t>1){
      t=t-1;
      this._pckg[i].quant=t;
      localStorage.setItem('packages',JSON.stringify(this._pckg));
      this._appComponent.setCart()
    }

  }

    getPckgQuant(pckg:any){
    let b=1;
    if(this.IndexOf(pckg)>=0){
      b=this._pckg[this.IndexOf(pckg)].quant;
    }
    //console.log('b=',b);
    return b;
   }

    IndexOf(p){
        for (var i = 0; i < this._pckg.length; i++) {
         /* let a=JSON.stringify(this._pckg[i]);
          let b=JSON.stringify(p);
            if (a===b) {
                return i;
            }*/

            let a=this._pckg[i];
            let b=p;
            if (a.id===b.id) {

                return i;
            }
        }
        return -1;
    }
    getPopularTests(strng){
      if(strng===''){
        return this.top_tests;
      }else{
        return [];
      }
      
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
                      swal("<small>Invalid Authentication.</small>");
                      form.resetForm(); 
                    }else{
                        //console.log('res',res);
                        if(res[0].user_token != null){
                          localStorage.setItem('token',res[0].user_token);
                          localStorage.setItem('user',JSON.stringify(res[0]));
                          //get temp cart data
                         // this.getCartData();
                          //this.redir('order-history');
                         this.router.navigate(['./account/order-history']);
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
      redir(val:string){
        window.location.href="./"+val;
      }
      isadded(tid:number):boolean{
      //  console.log(tid);
        let stest= JSON.parse(localStorage.getItem('tests')); 
       //console.log(stest);
        let a=false;
        if(stest){
          stest.forEach(element => {
            if(element.tid===tid){
              a=true;
            }
          });
        }
      return a;
      }
      /*package add,quant by sharath start*/
      testQuantPlus(tid){
        this._appComponent.quantAddByIndex(tid);
      }
      testQuantMinus(tid){
        this._appComponent.quantMinusByIndex(tid);
      }
      getTestQuant(test:any){
        let a=1;
        let stest=JSON.parse(localStorage.getItem('tests'));
          if(stest){
              stest.forEach(element => {
                if(element.tid===test){
                    a=element.quant;
                }
          });
      }
      return a;
    }
    addPackageCart(pckg:any){
      // this.bookComponent.getAddPackageCart(pckg);
     /*this.router.navigate(['./book', {searchString:str}]);*/
     this.getAddTestCart(pckg,"pckg");
    }
    myIndexOf(o) {
      this._tempTest=JSON.parse(localStorage.getItem('tests'));
     let k=-1;
          for (var i = 0; i < this._tempTest.length; i++) {
            let a=this._tempTest[i];
            let b=o;
            
              if (a.tid===b.tid) {
  
                  k= i;
              }
          }
          return k;
      }
    getAddTestCart(test:any,attrib:any,event:any=''){
      
    // console.log(event.target.classList.add('added'));
     //localStorage.setItem('btncls',event.target.classList.add('added'));
     //event.target.textContent = "ADDED";
      //console.log(test);
      if(attrib=='pckg'){
         let test1 = test;
         test = {};
         test.tid = test1.id;
         test.test_name = test1.package_code;
         test.test_code = test1.package_discpr;
         test.test_finalpr = test1.package_finalpr;
         test.test_name = test1.package_name;
         test.test_price = test1.package_price;
         test.quant = test1.quant;
         test.report_avb = "";
         test.test_ptn = "";
         test.type = "";
      }
  
    this._tempTest=[]; 
    this.temp2=[]; 
  let testshere = JSON.parse(localStorage.getItem('tests')); 
       if(testshere){
            
        this.temp2=JSON.parse(localStorage.getItem('tests'));
        this.temp2.forEach(element => {
            this._tempTest.push(element);  
        });
       if(this.myIndexOf(test) < 0){
        test.quant=1;
        this._tempTest.push(test);
       }else{
        let i=this.myIndexOf(test);
        let t=this._tempTest[i].quant;
        t=t+1;
        this._tempTest[i].quant=t;
       }
        }else{
          test.quant=1;
          this._tempTest.push(test);
        }
        //console.log(this._tempTest);
        localStorage.setItem('tests',JSON.stringify(this._tempTest));
        this._appComponent.setCart();
      
    }
    select(item,type:any){
      this.filterKey = new String(item);
      this.searchResult = [];
       //this._packagesSearchResult=[];
       this._packages1=[];
      if(type=="test"){
        var re=/ /gi;
        
        this.filterKey=this.filterKey.replace(re,"_"); 
        this.filterKey=this.filterKey.replace("(","__,_"); 
        this.filterKey=this.filterKey.replace(")","_,__"); 
       window.location.href="./test-details/"+this.filterKey;
      }else if(type="package"){
        var re=/ /gi;
        
        this.filterKey=this.filterKey.replace(re,"_"); 
        this.filterKey=this.filterKey.replace("(","__,_"); 
        this.filterKey=this.filterKey.replace(")","_,__"); 
        let base_url="";
       if( this.ptype=="H"){
        base_url="package-details";
       }else if(this.ptype=="P"){
        base_url="profile-details";
       }
       window.location.href="./"+base_url+"/"+this.filterKey; 

      }
     // this.filteredItems = [];
  }
    /*package add,quant by sharath end*/
 

 getForgotPassword(form: NgForm,isValid: boolean){
  console.log('formValues',form.value);
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
                      
                        this.sotp = true;
                        this.fotp = false;
                        form.resetForm();
                        this.phneNo = response[0].mobile;
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
                     form.resetForm();
                    }

                   
                 }

             });
      });

    }
       
  }

  resendOTP(mobile:number){
    alert(mobile);

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

 UpdatePasswordByOTP1(form: NgForm,isValid: boolean,uid:number){
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
                           
                              this.ivotp =true;
                              this.msg = false;
                               form.resetForm();

                            }else{
                              this.ivotp =false;
                              this.msg = false;
                             swal("<small>OTP verified and Password changed successfully</small>");
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

  
}
