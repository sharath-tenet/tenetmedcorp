import { Component, OnInit, Inject,ViewChild, ElementRef } from '@angular/core';
import {ApiService} from '../common/api.service';
import { HttpModule } from '@angular/http';
import {AppComponent} from '../app.component';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import {INgxMyDpOptions, IMyDateModel} from 'ngx-mydatepicker';
declare var swal: any;
@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  orderhistory: any;
  myFinalizedOrders2: any;
  model: any;
  partient_name: any;
  billDetails: any[]=[];
  myFinalizedOrders: any;
  addtovisible: any;
   model1:any;
@ViewChild('add_family') add_family: ElementRef;
@ViewChild('edit_family') edit_family: ElementRef;
@ViewChild('add_address') add_address: ElementRef;
@ViewChild('edit_address') edit_address: ElementRef;
@ViewChild('otp_model') otp_model: ElementRef;

@ViewChild('otpModel') otpModel: ElementRef;
@ViewChild('oh') oh: ElementRef;

  login_id: any;
  user: any = [];
  userInfo:any=[];
  obj:any=[];
  public _api:ApiService;
  tmp:number;
  sw:boolean=false;
  msg:string;
  basicInfo:boolean=true;
  editFlag:boolean=false;
  newArray:any =[];

  members:any=[];
  ms2:boolean=false;
  ms1:boolean=true;
  ms7:boolean=false;
  member:any=[];

  ms3:boolean=true;
  ms4:boolean=false;
  ms6:boolean=false;
  address:any=[];
  ms5:boolean=false;
  locations:any=[];
  public optionVal:number;
  areas:any=[];
  cities:any=[];
  cityId:number;
  location:any=[];
  user_loc_id:number;
  pwc:any=0;
  upm:boolean=false;
  fam:boolean=false;
  uam:boolean=false;
  fmem:boolean=false;
  public fms:any=[];
  public _appComponent:any;
  editBtn:boolean=true;
  defaultLocation:any=[];
  defaultAddress:any=[];
  
  doorNumber:any;
  streetNumber:any;
  profileMsg:boolean;
  fld:boolean;
  public loading = [];
  public config= {
    id: 'custom',
    itemsPerPage: 9,
    currentPage: 1
};
 ph:boolean=false;

  otpBtn:boolean=false;
  svBtn:boolean=true;
otp:boolean=false;
vBtn:boolean=false;
uid:number;
otherflag:boolean=false;
othereditflag:boolean;

address1:any;
editAddress:any;
memId:any;
oHsearch:any;
date = new Date();

myOptions: INgxMyDpOptions = {
  // other options...
  dateFormat: 'dd-mm-yyyy',
  disableSince: { year: this.date.getUTCFullYear(), month: this.date.getUTCMonth() + 1, day: this.date.getUTCDate()+1}
};

myOptions1: INgxMyDpOptions = {
  // other options...
  dateFormat: 'yyyy-mm-dd',
  disableSince: { year: this.date.getUTCFullYear(), month: this.date.getUTCMonth() + 1, day: this.date.getUTCDate()+1}
};

// Initialized to specific date (09.10.2018)

  constructor(private router :Router,_api :ApiService,_appComponent :AppComponent,private activerouter :ActivatedRoute) {
    this._api=_api;
    this._appComponent=_appComponent;
    this.user = JSON.parse(localStorage.getItem("user"));
    this.login_id=this.user.uid;
    this.orderhistory= this.activerouter.snapshot.paramMap.get('any');
   // this.setDate();
   // console.log('uu',this.user);
    this.loading['account']=true;
    this.getRecData();
    let mobile= JSON.parse(localStorage.getItem("user_mobile"));
    console.log('mob',mobile);
   }
   setDate(){
    if(this.user.user_dob){
      console.log(this.user.user_dob);
      let tdate=this.user.user_dob.split("/");
      this.model = { date: { year: tdate[2], month: tdate[1], day: tdate[0] } };//assign date to date-picker
      console.log(this.model);
    }
   }
   getRecData(){
    this.getUserLocation(this.user.uid,0);
    this.getCities();
    this.getUserDetails();
    this._appComponent.setFlag();
  
   }
  
  ngOnInit() {
    this.tmp=1;
     
  // console.log('user=',this.user);
   this.getFamilyMembers(this.user.uid);
   this.getHistory();
   window.scrollTo(0, 0);
 
  }
  ngAfterViewInit(){
   if(this.orderhistory=='order-history'){
    this.oh.nativeElement.click();
   }
   //  this.oh.nativeElement.click();
   }
  getHistory(){
    this.loading['getBills']=true;
    this._api.getToken().subscribe( 
      token => {
    this._api.POST('GetFinalizedOrderHistory', {TokenNo: token,'patientid':this.user.uid,'mobileno':''}).subscribe(data =>{
      if(data.status==1){
        let a =JSON.parse(data.json).data;
        this.myFinalizedOrders=this.getArrayHumanDate(a);

         this.loading['getBills']=false;
      }else{
        
        this.myFinalizedOrders=[];
         this.loading['getBills']=false;
      }
      this.myFinalizedOrders2=this.myFinalizedOrders;
      });
    });
      }
      getArrayHumanDate(arr){
        let b=[]
        let i=0;
        arr.forEach(element => {
          b.push(element);
          b[i]['order_date']=this.getHumanDateWithSec(element.order_date);
          ++i;
        });
        return b;
      }
      getHumanDateWithSec(date){
        // var t = new Date(1970, 0, 1); // Epoch
        // t.setSeconds(secs);
        // return t;
        date=date.replace("/Date(","");
        date=date.replace(")/","");
        date=date.split("+");
        let hr=date[1].substring(0,2)*60*1000;
        let min=date[1].substring(2,4)*60*1000;
        let fdt=parseInt(date[0])+hr+min;
        let theDate = new Date(fdt);
        let dateString = theDate.toUTCString();
        return new Date(dateString).toString().replace(" GMT+0530 (India Standard Time)","");
        //return dateString.toString().replace(" GMT+0530 (India Standard Time)","");
      }

  getUserDetails(){
    this.user = JSON.parse(localStorage.getItem("user"));
     // this.obj = JSON.parse(this.user);
     this._api.getToken().subscribe( 
      token => { 
    this._api.POST('GetUserDetails',{TokenNo: token,'user_id':this.user.uid}).subscribe(data =>{
      this.userInfo=JSON.parse(data.json).data;
      //console.log(this.userInfo[0]);
      if(this.userInfo){
        this.user = this.userInfo[0];
        if(this.user.user_dob!==null){
          this.user.user_dob=this.getHumanDate(this.user.user_dob);
          this.setDate();
        }

        this.user.user_name = this.user.user_name.split(' ');
        this.user['firstname'] = this.user.user_name[0];
        this.user['lastname'] = this.user.user_name[1];

        this.loading['account']=false;
      }
      localStorage.setItem('user',JSON.stringify(this.userInfo[0]));
      localStorage.setItem('user_mobile',JSON.stringify(this.user.user_phone));
      this._appComponent.setFlag();
      
        //console.log(this.getHumanDate(this.user.user_dob));
      
     });
    });
  }

  other(attrib:any){
    if(attrib=='title'){
        this.otherflag = false;
    }else{
       this.otherflag = true;
    }
   }

  editOther(attrib:any){
     // alert(attrib);
    if(attrib=='title'){
        this.othereditflag = false;
    }else{
       this.othereditflag = true;
    }
   }
   parseDate(date){
     console.log(date);
   
    if(date.formatted==undefined){
      
      date=date.date.year+'-'+date.date.month+'-'+date.date.day;
     //date=date.date.day+'-'+date.date.month+'-'+date.date.year;
    }else{
      date=date.formatted;
      date=date.split("-")
      date=date[2]+'-'+date[1]+'-'+date[0];
    }
    
return date;
   }


   parseDateUpdate(date){
     
    if(date.formatted==undefined){
      date=date.year+'-'+date.month+'-'+date.day;
      //date=date.day+'-'+date.month+'-'+date.year;  
    }else{
      date=date.formatted;
      date=date.split("-")
      date=date[2]+'-'+date[1]+'-'+date[0];
    }
    return date;
   }

  updateProfile(profileInfo: NgForm, isValid: boolean){

   console.log('update Profile',profileInfo.value);
   profileInfo.value.user_dob=this.parseDate(profileInfo.value.user_dob);
  // console.log('form',profileInfo.value);
     if(isValid){
    this._api.getToken().subscribe( 
      token => { 
        profileInfo.value.TokenNo =  token;
        profileInfo.value.user_name = profileInfo.value.first_name+' '+profileInfo.value.last_name;
    this._api.POST('UpdateFamilyMembers',profileInfo.value).subscribe(data =>{
      this.user=JSON.parse(data.json).data;
      //this.upm=true;
      this.user[0].uid = this.user[0].id;
      this.user=this.user[0];
      
      localStorage.setItem('user',JSON.stringify(this.user));
      this._appComponent.setFlag();
      this.editBtn=true;
      this.editFlag=false;
      this.basicInfo=true;
      //swal("Profile updated");
      this.profileMsg = true;

      this.getRecData();
      //window.location.reload();
     });
    });
  //console.log('default Loc',this.defaultLocation);
    //default address
 if(this.locations.length==0){
   // doorNo...streetNo
   //profileInfo.value.title_id3 = 0;
  
  if(profileInfo.value.title_id3 == 3){
  this.address1 = profileInfo.value.other +','+profileInfo.value.doorNo+','+profileInfo.value.streetNo;
  }else{
  this.address1 = profileInfo.value.doorNo+','+profileInfo.value.streetNo;

  }

   this._api.getToken().subscribe( 
      token => { 
         let data = {
    'TokenNo':token,
    'title_id':profileInfo.value.title_id3,
    'user_id':profileInfo.value.user_id,
    'address':this.address1 ,
    'area_id':profileInfo.value.area_id,
    'city_id':profileInfo.value.city_id
   }

   //console.log('data1',data);
   console.log('address', data);
      this._api.POST('AddUserAddress', data).subscribe(data =>{
        this.address=JSON.parse(data.json).data;
        console.log('address',this.address);
          //this.uam=true;
          //this.getUserLocation(this.user.uid,0);

        });
      })

  }else{

      if(profileInfo.value.title_id3 == 3){
       this.address1 = profileInfo.value.other +','+profileInfo.value.doorNo+','+profileInfo.value.streetNo;
      }else{
      this.address1 = profileInfo.value.doorNo+','+profileInfo.value.streetNo;

      }
  
    this._api.getToken().subscribe( 
      token => { 

    let data = {
    'TokenNo':token,
    'title':profileInfo.value.title_id3,
    'user_id':profileInfo.value.user_id,
    'user_loc_id':profileInfo.value.user_loc_id,
    'address':this.address1 ,
    'area_id':profileInfo.value.area_id,
    'city_id':profileInfo.value.city_id
   }

    console.log('data1',data);
      this._api.POST('UpdateUserAddress', data).subscribe(data =>{
      this.address = JSON.parse(data.json).data;
       // this.uam=true;
        this.getUserLocation(this.user.uid,0);
         console.log("User address updated");
      
      });
      })


  }
  
     }else{

     }  
  } 

  showHide(num:number){
    this.tmp=num;
  }

  autoTab(event:any){
      if ( event.target.value.length >= event.target.maxLength && event.target.nextElementSibling ) 
       event.target.nextElementSibling.focus(); 

    }

/*  changePassword(form: NgForm, isValid: boolean,uid:number){

    if(isValid){
     //console.log('form',form.value);
     this._api.getToken().subscribe( 
      token => { 
        //form.value.TokenNo = token;
        //form.value.user_id=uid;
       
         //form.resetForm();
     this._api.POST('ChangePassword',form.value).subscribe(data =>{
      let res=JSON.parse(data.json).data;
      //console.log("res",res);

            if(res == undefined){
                console.log("data undefined");
                 swal("Invalid current password");
                 form.resetForm();
                //this.pwc=2;

               
            }else{
              //console.log(this.user);
              if(form.value.oldpassword !== form.value.newpassword){

                      if(JSON.parse(data.json).status==1){
                       // this.pwc=1;
                        swal("Password Changed Successfully");
                         form.resetForm();
                      }else{
                       // this.pwc=2;
                        swal("Invalid User/Current Password");
                         form.resetForm();
                      }

                      console.log("Password changed Successfully");
                     //window.location.reload();
                     this._appComponent.toLogout();
                     this.router.navigate(['./home']);
                   }else{
                    //this.pwc=3;
                    swal("Old and new passwords must be different");
                    form.resetForm();

                    console.log("Old password and new pwd should not be same");
                   }

            }
            //form.resetForm();
      
     });

    }); 
   }else{

   }

  }*/

/*    changePassword(form: NgForm, isValid: boolean,uid:number){

    if(isValid){

    // console.log('form',form.value);
     this._api.getToken().subscribe( 
      token => { 
        let data = {
        "TokenNo":token, 
        "user_id":uid,  
        "oldpassword":form.value.oldpassword,  
        "newpassword":form.value.newpassword,
        }
        //form.value.TokenNo = token;
        //form.value.user_id=uid;
       console.log('dataa1',data);
         //form.resetForm();
     this._api.POST('ChangePassword',data).subscribe(data =>{
      let res=JSON.parse(data.json).data;
    
            if(res == undefined){
                console.log("data undefined");
                 swal("Invalid current password");
                 form.resetForm();
                //this.pwc=2;

               
            }else{
              //console.log(this.user);
              if(form.value.oldpassword !== form.value.newpassword){

                      if(JSON.parse(data.json).status==1){
                       // this.pwc=1;
                        swal("Password Changed Successfully");
                         form.resetForm();
                      }else{
                       // this.pwc=2;
                        swal("Invalid User/Current Password");
                         form.resetForm();
                      }

                      console.log("Password changed Successfully");
                     //window.location.reload();
                     this._appComponent.toLogout();
                     this.router.navigate(['./home']);
                   }else{
                    //this.pwc=3;
                    swal("Old and new passwords must be different");
                    form.resetForm();

                    console.log("Old password and new pwd should not be same");
                   }

            }
            //form.resetForm();
      
     });

    }); 
   }else{

   }

  }*/
  changePassword(form: NgForm, isValid: boolean,uid:number){

    if(isValid){
    // console.log('form',form.value);
     this._api.getToken().subscribe( 
      token => { 
        let data = {
        "TokenNo":token, 
        "user_id":uid,  
        "oldpassword":form.value.oldpassword,  
        "newpassword":form.value.newpassword,
        }
        //form.value.TokenNo = token;
        //form.value.user_id=uid;
       
         //form.resetForm();
     this._api.POST('ChangePassword',data).subscribe(data =>{
      let res=JSON.parse(data.json).data;
    
            if(res == undefined){
                console.log("data undefined");
                 swal("Invalid current password");
                 form.resetForm();
                //this.pwc=2;

               
            }else{
              //console.log(this.user);
              if(form.value.oldpassword !== form.value.newpassword){

                      if(JSON.parse(data.json).status==1){
                       // this.pwc=1;
                        swal("Password Changed Successfully");
                         form.resetForm();
                      }else{
                       // this.pwc=2;
                        swal("Invalid User/Current Password");
                         form.resetForm();
                      }

                      console.log("Password changed Successfully");
                     //window.location.reload();
                     this._appComponent.toLogout();
                     this.router.navigate(['./home']);
                   }else{
                    //this.pwc=3;
                    swal("Old and new passwords must be different");
                    form.resetForm();

                    console.log("Old password and new pwd should not be same");
                   }

            }
            //form.resetForm();
      
     });

    }); 
   }else{

   }

  }
    
 /* reset(form:NgForm){
      form.resetForm();
  }*/
 
  revert(form:any){
     form.reset();
  }

  editInfo(){
    this.editFlag=true;
    this.basicInfo=false;
    this.editBtn =false;
   if(this.locations.length != 0){
         this.locations.forEach(element => {
             this.getAreaByCity1(element.city_id);
         });
    }
    if(this.locations.length==0){
                  
                this.fld=true;
               
             }else{
              this.fld=false;
              
             } 

    //this.getAreaByCity1(this.defaultLocation[0].city_id);
    /*this.basicInfo=!this.basicInfo;
    this.editFlag=!this.editFlag;*/
  }

  getFamilyMembers(uid:number){
  let fm_dob:any;
  this.fms=[];
  this._api.getToken().subscribe( 
    token => { 
    this._api.POST('GetFamilyMembers', {TokenNo: token,'user_id':uid}).subscribe(data =>{
      this.members=JSON.parse(data.json).data;
      if(this.members){
        this.members.forEach(element => {
          console.log('user_dob',element.user_dob);
             fm_dob = this.getHumanDate(element.user_dob);
             let fm_dob1 = fm_dob.split('/');
             let date = fm_dob1[2]+'-'+fm_dob1[1]+'-'+fm_dob1[0];
            element.age=this.getAge(date);

             if(element.user_name){
                    let userName = element.user_name.split(' ');   
                    element.firstname = userName[0];
                    element.lastname =  userName[1];
            }
        });
      }else{
        this.members=[];
      }
         
     //this.members.push(this.newArray);
   //console.log('members',this.members);
     });
    });
  }

   changeDate(event:any){

      console.log(event.target.value);
      let memAge = this.getAge(event.target.value);
      let a:any = memAge.split(' ');
      if(a[0] >=18){
          this.ph = true;
        }else{
          this.ph = false;
        }
  }


    onDateChanged(event:any){
    //yyyy-dd-mm
   // console.log('kk',event.formatted);//

      let memAge = this.getAge(event.formatted);//yyyy/mm/dd
      let a:any = memAge.split(' ');
    console.log('memA',memAge);
      if(a[0] >= 18){
          this.ph = true;
        }else{
          this.ph = false;

        }
  }

  deleteAddress(loc:any){
   console.log('loc=',loc.user_loc_id);

if (window.confirm("Do you really want to delete Address?")){
    this._api.getToken().subscribe( 
    token => { 
    this._api.POST('DeleteUserAddress', {TokenNo: token,'user_loc_id':loc.user_loc_id}).subscribe(data =>{
      let resp =JSON.parse(data.json).data;
       console.log('dA',resp[0]); 
       if(resp[0] == undefined){
        console.log("undefined");

       }else{
            window.alert(resp[0].message); 
            this.getUserLocation(this.user.uid,0);
       }
   
     });
    });
  }

  }

  deleteFM(mem:any){
    console.log(mem);

if (window.confirm("Do you really want to delete?")){
    this._api.getToken().subscribe( 
    token => { 
    this._api.POST('DeleteFamilyMember', {TokenNo: token,'user_id':mem.uid}).subscribe(data =>{
      let res =JSON.parse(data.json).data;
      console.log('dF',res[0]); 
       if(res[0] == undefined){
        console.log("undefined");

       }else{
            window.alert(res[0].message);
            this.getFamilyMembers(this.user.uid);
       }
   
     });
    });
    }
  }

 /* getAge(dob:any)
     {
        if(dob){
              let birthday = new Date(dob).getTime();
              let today = new Date().getTime();
              let ag = ((today - birthday) / (31557600000));
              let ag1 = Math.floor( ag );
              // console.log('ag1',ag1);
              return ag1;
            }
     }*/

getAge(dateString:any) {
   //console.log('dateString'+dateString);
  let birthdate = new Date(dateString).getTime();
  let now = new Date().getTime();
  // now find the difference between now and the birthdate
  let n = (now - birthdate)/1000;

  if (n < 604800) { // less than a week
    let day_n = Math.floor(n/86400);
    return day_n + ' day' + (day_n > 1 ? 's' : '');
  } else if (n < 2629743) {  // less than a month
    let week_n = Math.floor(n/604800);
    return week_n + ' week' + (week_n > 1 ? 's' : '');
  } else if (n < 63113852) { // less than 24 months
    let month_n = Math.floor(n/2629743);
    return month_n + ' month' + (month_n > 1 ? 's' : '');
  } else { 
    let year_n = Math.floor(n/31556926);
    return year_n + ' year' + (year_n > 1 ? 's' : '');
  }
}

 diff_months(dt2, dt1) 
 {

  var diff =(dt2.getTime() - dt1.getTime()) / 1000;
   diff /= (60 * 60 * 24 * 7 * 4);
  return Math.abs(Math.round(diff));
  
 }



    getHumanDate(date:any){
    date=date.replace("/Date(","");
    date=date.replace(")/","");
    date=date.split("+");
    let hr=date[1].substring(0,2)*60*1000;
    let min=date[1].substring(2,4)*60*1000;
    let fdt=parseInt(date[0])+hr+min;
    let theDate = new Date(fdt);
    console.log(theDate);
    let dateString = theDate.toUTCString();
    let date1 = theDate.getDate().toString()+'/'+(theDate.getMonth()+1).toString()+'/'+theDate.getFullYear().toString();
    
    return date1;
    //console.log(date1);
  }

  addFM(){
    this.ms2=true;
    this.ms1=false;
  }
/*
  saveFamilyMembers(mem:NgForm,isValid:boolean, uid:number){

  if(isValid){
    mem.value.user_id = uid;
    this._api.getToken().subscribe( 
      token => {
       mem.value.TokenNo=token;
    this._api.POST('AddFamilyMembers', mem.value).subscribe(data =>{
        let mems=JSON.parse(data.json).data;
        //console.log(mems);
        // this.fam = true;
         //window.location.reload
        this.add_family.nativeElement.click();
        swal("<small>Family member added successfully</small>");
        mem.resetForm();
        console.log("family member added");
        this.getFamilyMembers(this.user.uid);
       });
      });

    }else{

    }
  
   }*/

  /*saveFamilyMembers(mem:NgForm,isValid:boolean, uid:number){ 

    if(mem.value.term1){
      this.otpBtn = false;
       this.svBtn = false;

      this._api.getToken().subscribe( 
      token => {
        let data = {
          TokenNo:token,
          otp:mem.value.term1,
          user_id:mem.value.user_id
        }
  
  this._api.POST('GetOtpVerification',data).subscribe(data =>{
       let resp=(JSON.parse(data.json).data);
  
         if(resp[0].uid!=null){ 
         
                mem.value.user_id = uid;
          this._api.getToken().subscribe( 
            token => {
             mem.value.TokenNo=token;
          this._api.POST('AddFamilyMembers', mem.value).subscribe(data =>{
              let mems=JSON.parse(data.json).data;
              
              swal("<small>Family member added successfully</small>");
              this.otp =false;
              mem.resetForm();
              this.getFamilyMembers(this.user.uid);
             });
            });

            
          }else{
          // window.alert("failed to login");
          }
     
       });
      });

    }else{
      let memAge = this.getAge(mem.value.user_dob);
      let a:any = memAge.split(' ');
      if(a[0] >=18){
          this.ph = true;
          this.otpBtn = true;
          this.svBtn = false;

              this._api.getToken().subscribe( 
                token => {
                    let data ={
                      'TokenNo':token,
                      'mobile':mem.value.user_mobile
                    }
                    this._api.POST('GetForgotPassword', data).subscribe(data =>{
                       let response=(JSON.parse(data.json).data);
                           console.log("response",response);
                           if(response == undefined){
                                //mem.resetForm();
                           }else{
                              if(response[0].mobile!=null){ 
                                 /*this.fp=false;
                                  this.votp=true;*/
                              /*   this.otp =true;
                                 this.vBtn=true;
                                  this.otpBtn = false;
                                   this.svBtn = false;
                                 // this.forget_password_modal.nativeElement.click();
                                  //swal("<small>OTP sent successfully</small>");
                                 this.uid = response[0].uid;

                              }else{
                               //window.alert("failed to send OTP");
                               swal("<small>Failed to send OTP</small>");
                              }

                             
                           }

                       });
                });
      }else{
        this.ph=true;
         mem.value.user_id = uid;
        this._api.getToken().subscribe( 
          token => {
           mem.value.TokenNo=token;
        this._api.POST('AddFamilyMembers', mem.value).subscribe(data =>{
            let mems=JSON.parse(data.json).data;
          
            swal("<small>Family member added successfully</small>");
             this.ph=false;
            mem.resetForm();
          
            this.getFamilyMembers(this.user.uid);
           });
          });


      }

    }

       
     
    } */


  saveFamilyMembers(mem:NgForm,isValid:boolean, uid:number){

  if(isValid){
     let memAge = this.getAge(mem.value.user_dob.formatted);
      let a:any = memAge.split(' ');
     if(a[0] >= 18){
          this.ph = true;
         // this.otpBtn = true;
          //this.svBtn = false;
           if(mem.value.user_mobile){
                     mem.value.user_id = uid;
                     mem.value.user_name = mem.value.firstName+' '+mem.value.lastName;
                            this._api.getToken().subscribe( 
                              token => {
                               mem.value.TokenNo=token;
                                mem.value.user_dob = mem.value.user_dob.formatted;
                               console.log('memVal',mem.value);
                            this._api.POST('AddFamilyMembers', mem.value).subscribe(data =>{
                                let mems=JSON.parse(data.json).data;
                                 console.log('mems',mems);

                                swal("<small>OTP SENT successfully</small>");
                                mem.resetForm();
                                
                                this.add_family.nativeElement.click();

                                this.otpModel.nativeElement.setAttribute("data-target", "#otp_model");
                                 this.otpModel.nativeElement.setAttribute('type','button');
                                this.otpModel.nativeElement.click();
                                 this.ph=false;
                                 this.memId = mems[0].id;
                              
                               
                               });
                              });
                          }else{
                            window.alert("Mobile number is required");
                          }
      }else{

        this.ph=false;
        this._api.getToken().subscribe( 
          token => {
          // mem.value.TokenNo=token;
           // mem.value.user_dob = mem.value.user_dob.formatted;
           mem.value.user_name = mem.value.firstName+' '+mem.value.lastName;
                let data = {
                "TokenNo":token,
                "user_dob":mem.value.user_dob.formatted,
                "user_gender": mem.value.user_gender,
                "user_id":uid,
                "user_name":mem.value.user_name,
                "user_email":mem.value.user_email,
                "user_mobile":''
                 }

                 console.log('data',data);

        this._api.POST('AddFamilyMembers', data).subscribe(data =>{
            let mems=JSON.parse(data.json).data;
          
            swal("<small>Family member added successfully</small>");
            this.add_family.nativeElement.click();
             this.ph=false;
            mem.resetForm();
          
            this.getFamilyMembers(this.user.uid);
           });
          });


      }

    }else{
        window.alert("Please fill all fields");
    }
  
   }

   getMemberOtpVerification(form: NgForm,isValid: boolean,memId:any){

      console.log(form.value);
      if(isValid){

        this._api.getToken().subscribe( 
      token => {  
          let data = {
            "TokenNo":token,
            "otp":form.value.term1+form.value.term2+form.value.term3+form.value.term4,
            "user_id":memId
          }
       
    this._api.POST('GetMemberOtpVerification', data).subscribe(data =>{
       let resp=(JSON.parse(data.json).data);
       console.log('resp',resp);
       if(resp ==undefined){
         swal("Invalid OTP");
          form.resetForm();
       }else{

         if(resp[0].uid!=null){ 
         
          //this.votp=false;
         swal("<small>OTP verified successfully</small>");
           form.resetForm();
        this.otp_model.nativeElement.click();
            this.getFamilyMembers(this.user.uid);

             this.otpModel.nativeElement.removeAttribute("data-target");
             this.otpModel.nativeElement.setAttribute("type","submit");
            //this.router.navigate(['./book']);
          }else{
           //window.alert("failed to login");
           swal("OTP verification failed");
           form.resetForm();
          }

       }
        
       });

      });

      }else{

      }
    
  }


    reset(form:any){
        form.resetForm();
    }
    
    reset1(form:NgForm){
    form.resetForm();
    this.otpModel.nativeElement.removeAttribute("data-target");
    this.otpModel.nativeElement.setAttribute("type","submit");
   }


    hm1(){
    this.ms1=false;
    }

    hm2(){
    this.ms2=false;
    this.ms1=true;
    }

   

   addLoc(){
   this.ms3=false;
   this.ms4=true;
   }
   hm3(){
     this.ms3=false;
   }

   hm4(){
     this.ms3=true;
     this.ms4=false;
   }
   hm5(){
     this.ms6=false;
     this.ms3=true;
   }
    hm6(){
     this.ms7=false;
     this.ms1=true;
    }

/*   editFMInfo(fmid:number){
    this.ms7=true;
    this.hm1();
    //console.log(this.members);
      this.members.forEach(element => {
        if(element.uid === fmid){
            this.member = element;
            if(this.member.gender=='M'){
              this.member.gender=1;
            }
            if(this.member.gender=='F'){
              this.member.gender=2;
            }
            // this.member.user_dob=this.getHumanDate(this.member.user_dob);
             this.member.user_dob=this.getHumanDate(this.member.user_dob);
             console.log('mem1',this.member.user_dob);
            let edate=this.member.user_dob.split("/");
            this.model1 = { date: { year: edate[2], month: edate[1], day: edate[0] } };
            // window.location.reload();
        }
    });
    
   }*/

   editFMInfo(fmid:number){
    this.ms7=true;
    this.hm1();
    //console.log(this.members);
      this.members.forEach(element => {
        if(element.uid === fmid){
            this.member = element;

            console.log("EditMember",this.member);
            if(this.member.gender=='M'){
              this.member.gender=1;
            }
            if(this.member.gender=='F'){
              this.member.gender=2;
            }

          if(this.member.user_phone)
          {
             this.ph=true;

          }else{
             this.ph=false;

          }
            this.member.user_dob=this.getHumanDate(this.member.user_dob);
             console.log('mem1',this.member.user_dob);
            let memAge = this.getAge(this.member.user_dob);
             let b:any = memAge.split(' ');
           
            if(b[0] >= 18){
              this.ph=true;
            }else{
              this.ph=false;
            }

            this.member.user_name = this.member.user_name.split(' ');
        this.member['firstname'] = this.member.user_name[0];
        this.member['lastname'] = this.member.user_name[1];


            let edate=this.member.user_dob.split("/");
            console.log('edate=',edate);

            this.model1 = { date: { year: edate[2], month: edate[1], day: edate[0] } };//assign date to date-picker
        
            // window.location.reload();
        }
    });
    
   }

/*   updateFamilyMembers(fmInfo:any,fmid:number){
     fmInfo.user_id=fmid;
     this._api.getToken().subscribe( 
      token => {
        fmInfo.TokenNo= token;
     this._api.POST('UpdateFamilyMembers',fmInfo).subscribe(data =>{
      let mems=JSON.parse(data.json).data;
      console.log("Family member updated successfully");
      swal("<small>Family member updated successfully</small>");
      this.fmem = true;
      this.getFamilyMembers(this.user.uid);
      //window.location.reload();
     });
    });

  }*/


/*  updateFamilyMembers(fmInfo:NgForm,isValid:boolean,fmid:number){
  
    if(isValid){
       console.log( fmInfo.value.user_dob1.date);

      fmInfo.value.user_dob1.date=this.parseDateUpdate(fmInfo.value.user_dob1.date);
      console.log(fmInfo.value.user_dob1.date);

          let data= {
        "TokenNo":"",
        "user_id":fmid,
        "user_name":fmInfo.value.user_name1,
        "user_email":fmInfo.value.user_email1,
        "user_mobile":fmInfo.value.user_mobile1,
        "user_dob":fmInfo.value.user_dob1.date,
        "user_gender":fmInfo.value.user_gender1,
       }

    console.log('dataaaa',fmInfo.value);

     this._api.getToken().subscribe( 
      token => {
      data.TokenNo= token;
     this._api.POST('UpdateFamilyMembers',data).subscribe(data =>{
      let mems=JSON.parse(data.json).data;
      //console.log("Family member updated successfully");
      this.edit_family.nativeElement.click();
      swal("<small>Family member updated successfully</small>");
      //this.fmem = true;
        fmInfo.resetForm();
      this.getFamilyMembers(this.user.uid);
      //window.location.reload();
     });
    });

    }
  }*/

    updateFamilyMembers(fmInfo:NgForm,isValid:boolean,fmid:number){

    console.log('update',fmInfo.value.user_dob1.date);
    if(isValid){
       console.log( fmInfo.value.user_dob1.date);

      fmInfo.value.user_dob1.date=this.parseDateUpdate(fmInfo.value.user_dob1.date);
      console.log(fmInfo.value.user_dob1.date);
        fmInfo.value.user_mobile1 = (fmInfo.value.user_mobile1) ? fmInfo.value.user_mobile1 : "";
        fmInfo.value.user_name1 = fmInfo.value.firstName1+' '+fmInfo.value.lastName1;
          let data= {
        "TokenNo":"",
        "user_id":fmid,
        "user_name":fmInfo.value.user_name1,
        "user_email":fmInfo.value.user_email1,
        "user_mobile":fmInfo.value.user_mobile1,
        "user_dob":fmInfo.value.user_dob1.date,
        "user_gender":fmInfo.value.user_gender1,
       }

    console.log('dataaaa',fmInfo.value);

     this._api.getToken().subscribe( 
      token => {
      data.TokenNo= token;
     this._api.POST('UpdateFamilyMembers',data).subscribe(data =>{
      let mems=JSON.parse(data.json).data;
      //console.log("Family member updated successfully");
      this.edit_family.nativeElement.click();
      swal("<small>Family member updated successfully</small>");
      //this.fmem = true;
        fmInfo.resetForm();
      this.getFamilyMembers(this.user.uid);
      //window.location.reload();
     });
    });

    }
  }

/*   addUserAddress(address_info:any,uid:number){
    //address_info.TokenNo=localStorage.getItem('token');
     address_info.user_id=uid;
     address_info.state_id=1;
     address_info.country_id=1;
     address_info.address=address_info.doorNo+','+address_info.streetNo;
  
     /*if(localStorage.getItem('token')!=null){
      }*/
     /* this._api.getToken().subscribe( 
        token => {
          address_info.TokenNo= token;
      this._api.POST('AddUserAddress', address_info).subscribe(data =>{
      this.address=JSON.parse(data.json).data;
      if(this.address==undefined){
            }else{
                  
            this.ms5=true;

            this.getUserLocation(this.user.uid,0);
            //window.location.reload();
            }
      
      });
    });
   }*/

  addUserAddress(address_info:NgForm,isValid:boolean, uid:number){
  // console.log('address_info',address_info.value);
     //address_info.value.user_id=uid;
     //console.log('adddress',address_info.value);
     address_info.value.user_id=uid;
     address_info.value.state_id=1;
     address_info.value.country_id=1;
     //address_info.value.address=address_info.value.doorNo+','+address_info.value.streetNo;
    if(address_info.value.title_id == 3){

      address_info.value.address = address_info.value.other +','+address_info.value.doorNo+','+address_info.value.streetNo;
      }else{
      address_info.value.address = address_info.value.doorNo+','+address_info.value.streetNo;

      }

  
      this._api.getToken().subscribe( 
        token => {
      address_info.value.TokenNo= token;
      this._api.POST('AddUserAddress', address_info.value).subscribe(data =>{
      this.address=JSON.parse(data.json).data;
      if(this.address==undefined){
            }else{ 
             this.add_address.nativeElement.click(); 
             swal("<small>User new address added successfully</small>");
             address_info.resetForm(); 
            //this.ms5=true;
            this.getUserLocation(this.user.uid,0);
            //window.location.reload();
            }
      
      });
    });
   }

   getUserLocation(uid:number,tid:number){
    //this.tid=tid;
     this.loading['address']=true;
    this._api.getToken().subscribe( 
      token => {
       this._api.POST('GetUserAddress', {TokenNo: token,'uid':uid}).subscribe(data =>{
     let res =JSON.parse(data.json).data;
              if(res==undefined){
             /*this.locations[0]=[];
             this.locations[0].address="NA";
             this.locations[0].area="NA";
             this.locations[0].city="NA";
             this.locations[0].area_id=0;
             this.locations[0].title_id=0;
             this.defaultLocation =this.locations;*/
            
             this.defaultAddress=[];
             this.locations=[];
             
         }else{

          if(JSON.parse(data.json).data.length > 0){
            this.locations=JSON.parse(data.json).data;
            console.log('Locations=',this.locations);
             this.locations.forEach(element => {
              this.location = element;
              
              this.location.address = element.address.toString().split(',');
              if(element.title_id==3){
               this.location['hno'] = this.location.address[2];
               this.location['street'] = this.location.address[1];
               this.location['other'] = this.location.address[0];
              //this.othereditflag=true;
             }else{
               
               this.location['hno'] = this.location.address[1];
               this.location['street'] = this.location.address[0];
               this.location['other'] = '';
            
             }

             });

             /*this.defaultAddress = this.locations.address;
                this.defaultAddress = this.defaultAddress.split(',');*/

            //this.defaultLocation=this.locations.filter(item => item.title_id== 0);

            /* if(this.defaultLocation.length != 0){
               // console.log('dll',this.defaultLocation.length);
                this.defaultAddress = this.defaultLocation[0].address;
                this.defaultAddress = this.defaultAddress.split(',');

             }else{

                   this.locations[0]=[];
                   this.locations[0].address="NA";
                   this.locations[0].area="NA";
                   this.locations[0].city="NA";
                   this.locations[0].area_id=0;
                   this.defaultLocation =this.locations;
                   this.defaultAddress=[];

             }*/

           }else{
          /*   this.locations[0]=[];
             this.locations[0].address="NA";
             this.locations[0].area="NA";
             this.locations[0].city="NA";
             this.locations[0].area_id=0;
             this.defaultLocation =this.locations;
             this.defaultAddress=[];
            //this.locations=[];*/
             this.defaultAddress=[];
             this.locations=[];
           }


         }
             if(this.locations.length==0){
                  this.editInfo();
                
             } 
               this.loading['address']=false;
             //this.editInfo();
       
      });
    });

     /*if(uid){
       this.ms3=true;
     }*/
   }
   getCities(){
    this._api.getToken().subscribe( 
      token => {
    this._api.POST('GetCity',{TokenNo: token}).subscribe(data =>{
      this.cities=JSON.parse(data.json).data;
     // console.log(this.cities);
     });
    });
   }

   getAreaByCity(event){
     this.optionVal = event.target.value;
     //console.log(optionVal);
     this._api.getToken().subscribe( 
      token => {
      this._api.POST('GetAreasByCity',{TokenNo: token,'City_id':this.optionVal}).subscribe(data =>{
      this.areas=JSON.parse(data.json).data;
      //console.log('areas',this.areas);
     });
    });
    
   }

   getAreaByCity1(cityId:number){
      this.cityId = cityId;
      this._api.getToken().subscribe( 
        token => {
      this._api.POST('GetAreasByCity',{TokenNo: token,'City_id':cityId}).subscribe(data =>{
      this.areas=JSON.parse(data.json).data;
   console.log('areas',this.areas);
     });
    });
    
   }

editFMAddress(uid:number,user_loc_id:number){
      //console.log(uid,user_loc_id);
    this.locations.forEach(element => {
      //console.log('ele',element);
        if(element.user_loc_id === user_loc_id){
             this.location = element;
        
             if(element.title_id==3){
               this.location.address = this.location.address.toString().split(',');
               this.location['hno'] = this.location.address[2];
               this.location['street'] = this.location.address[1];
               this.location['other'] = this.location.address[0];
              //this.othereditflag=true;
             }else{
               this.location.address = this.location.address.toString().split(',');
               this.location['hno'] = this.location.address[1];
               this.location['street'] = this.location.address[0];
               this.location['other'] = '';
            
             }
           
            this.getAreaByCity1(this.location.city_id);
        }

         
    });
    this.user_loc_id=user_loc_id;
    this.ms6=true;
    this.ms3=false;
      //this.hm3();
     
   }

/*  updateUserAddress(address_info:any,uid:number){
    //address_info.TokenNo=localStorage.getItem('token');
    address_info.user_id=uid; 
    address_info.state_id=1;
    address_info.country_id=1;
    address_info.address=address_info.doorNo+','+address_info.streetNo;

    this._api.getToken().subscribe( 
      token => {
        address_info.TokenNo= token;
      this._api.POST('UpdateUserAddress', address_info).subscribe(data =>{
      this.address=JSON.parse(data.json).data;
        this.uam=true;
        swal("<small>User new address updated successfuly</small>");
        this.getUserLocation(this.user.uid,0);
        //console.log("User address updated");
      //window.location.reload();
      });
    });
   }*/

  updateUserAddress(address_info:NgForm,isValid:boolean,uid:number){
     console.log('address_info',address_info.value);
    if(isValid){
      if(address_info.value.title_id1 == 3){
        this.editAddress= address_info.value.other1+','+address_info.value.doorNo1+','+address_info.value.streetNo1;
      }else{
         this.editAddress= address_info.value.doorNo1+','+address_info.value.streetNo1;
      }

      let data = {
            "TokenNo":"",
            "user_loc_id":address_info.value.user_loc_id,
            "user_id" : uid,
            "title":address_info.value.title_id1,
            "address":this.editAddress,
            "city_id":address_info.value.city_id1,
            "area_id":address_info.value.area_id1
        }

        this._api.getToken().subscribe( 
          token => {
            data.TokenNo= token;
          this._api.POST('UpdateUserAddress', data).subscribe(data =>{
          this.address=JSON.parse(data.json).data;
            //this.uam=true;
             this.edit_address.nativeElement.click(); 
            swal("<small>User address updated successfuly</small>");
             address_info.resetForm();
            this.getUserLocation(this.user.uid,0);
            //console.log("User address updated");
        
          });
        });
    }
   }
   getBillDetails(bill_no){
    //// 
   // console.log(bill_no);
   window.open('./bill-view/'+bill_no,"_blank");
   //this.router.navigate(['./bill-view/'+bill_no]);
   this.loading['billDetails']=true;
    this.billDetails=[];
    this._api.getToken().subscribe( 
      token => {
    this._api.POST('GetOrderDetails', {TokenNo: token,'orderno':bill_no,'mobileno':''}).subscribe(data =>{
      this.billDetails=JSON.parse(data.json).data;
   this.partient_name=this.billDetails[0].patient_name;
   this.loading['billDetails']=false;
      });
    });
  }
  downloadReport(tid:any,bill_no:any){
    this.loading['reportDownload']=true;
    this._api.getToken().subscribe( 
      token => {
    this._api.POST('GetFinalReport', {TokenNo: token,'service_id':tid,'orderno':bill_no}).subscribe(data =>{
     let file=JSON.parse(data.json).data;
     let str=file[0].message;
     if(str.substring(str.length - 1, str.length)===','){
      str=str.substring(0, str.length - 1); 
     }
     console.log(str);
      this.previewReport(str);
      this.loading['reportDownload']=false;
   // console.log(this.billDetails);
   
      });
    });
  
  }
  previewReport(file:any){
    window.open('http://208.163.37.165/Intgcems/orderinvoice/'+file, '_blank');
  }
  ser(term){
    
    let b=this.searchValues(term);
    console.log(b);
    this.myFinalizedOrders2=b;
  }
  searchValues(term){
    return term 
    ? this.myFinalizedOrders.filter(item =>((this.inString(item.customer_name,term))||(this.inString(item.test_name,term))||(this.inString(item.bill_no,term))))
    : this.myFinalizedOrders;
  }
  inString(thread,needle){
    if(thread!==null){
      if(thread.toLowerCase().indexOf(needle.toLowerCase())>=0){
        return true;
      }else{
        return false;
      }
    }else{
      return false;
    }
  
  }

  
}
