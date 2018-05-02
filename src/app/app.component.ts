import { Component, Inject } from '@angular/core';
import {ApiService} from './common/api.service';
import {LoginComponent} from './login/login.component';
import { HttpModule } from '@angular/http';
import { Router, NavigationEnd } from '@angular/router';
import { NgForm } from '@angular/forms';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {Idle, DEFAULT_INTERRUPTSOURCES} from '@ng-idle/core';
import {Keepalive} from '@ng-idle/keepalive';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [HttpModule,LoginComponent],
})
export class AppComponent {
  pop:any=[];
  crtDrpDown: any="";
  currentUrl: string;
  filterKey: any;
  locdrpdown: boolean;
  loctxt: string;
  _tempTest: any = [];
  city_name: any;
  area_name: any;
  title = 'app';
  b:any;
  a:any;
  tests=[];
  tot:number=0;
  hvc:number=0;
  homoe_visit_charge:number=50;
  colc:number=0;
  public isLoggedIn:boolean;
  showhidecart:boolean;
  //showhidepckgcart:boolean;
  private loginComponent;
  //public _api:ApiService;
  user:any=[];
  userInfo:any=[];
  obj:any=[];
  cartCnt:number=0;
  servicingCities:any=['Hyderabad','Banglore'];
  //idle,keepalive
  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date = null;

  postalCode:string;
  packagesCount:number;
  testsCount:number=0;
  public pckgs=[];
  constructor(private router :Router,LoginComponent:LoginComponent,private _api:ApiService,private idle: Idle, private keepalive: Keepalive) {
   this.setCart();
   this.loginComponent=LoginComponent;
   //console.log(this.tests.length);
   /*  this._api=_api;
      this._api.PinByGoogle("https://maps.googleapis.com/maps/api/geocode/json?latlng=17.432671,78.417993&key=AIzaSyCegOtEDutwtUyNWcOOLgoPedUYVob_AGk").subscribe(data=>{
        console.log(data);
      });
  */
    this.setFlag();
 /*  
  console.log(this.tests);
   this.tests.forEach(element => {
            this.tot=this.tot+parseInt(element.test_finalpr); 
          });*/

    //idle,keepalive
    idle.setIdle(10);
    idle.setTimeout(1800);//1800
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

   idle.onIdleEnd.subscribe(() => this.idleState = 'No longer idle.');
    idle.onTimeout.subscribe(() => {
      this.idleState = 'Timed out!';
      this.timedOut = true;
      this.toLogout();
    });

    idle.onIdleStart.subscribe(() => this.idleState = 'You\'ve gone idle!');
    idle.onTimeoutWarning.subscribe((countdown) => this.idleState = 'You will time out in ' + countdown + ' seconds!');

    // sets the ping interval to 15 seconds
    keepalive.interval(15);

    keepalive.onPing.subscribe(() => this.lastPing = new Date());

   this.reset();
   //end keepalive,idle
   router.events.subscribe((_: NavigationEnd) =>{
     if((_.url!==undefined)&&(_.url!=='')){
      this.currentUrl = _.url.replace("/","");
      //console.log(this.currentUrl);
     }
   });
   
  }
  liveLocation(){
    if((localStorage.getItem('location_city_name'))&&(localStorage.getItem('location_city_name')!=='undefined')){
      this.loctxt=localStorage.getItem('location_city_name');
      this.locdrpdown=false;
    }else{
      this.loctxt="Select Location";
      this.locdrpdown=true;
    }
    
  }
  setLocation(val){
   
    localStorage.setItem('location_city_name',val);
    if(this.servicingCities.indexOf(val) > -1){
      // console.log(this.city_name);
       localStorage.setItem("addTocart","true");
     }else{
       localStorage.setItem("addTocart","false"); 
       //this should be un-commented in live
      //localStorage.setItem("addTocart","true");
     }
     this.liveLocation();
     window.location.reload(); //in live this location should be appended
  }
  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }
  
  OnInIt(){
   // this.a = localStorage.getItem('showCart');
   //console.log(this.testsCount);
   window.scrollTo(0, 0);
   if(localStorage.getItem('tests')){
    this.b=JSON.parse(localStorage.getItem('tests'));
      if(this.b.length > 0){
        this.tests= this.b;
      }else{
        this.showhidecart=false;
      }

    if(localStorage.getItem('showcart')=="true"){
      this.showhidecart=true;
    }
   }
 
  }
  getPostalCode(data:any){
    // console.log(data.longitude);
    let req_url="https://maps.googleapis.com/maps/api/geocode/json?latlng="+data.latitude+","+data.longitude+"&key=AIzaSyCegOtEDutwtUyNWcOOLgoPedUYVob_AGk";
   this._api.PinByGoogle(req_url).subscribe(data=>{
    this.postalCode = data[5].address_components[0].long_name;
    
    this.area_name=data[3].address_components[0].long_name;
    this.city_name=data[3].address_components[0].long_name;
    localStorage.setItem('location_area_name',this.area_name);
    localStorage.setItem('location_city_name',this.city_name);
     //  if(this.servicingCities.indexOf(this.city_name) > -1){
      console.log(this.city_name);
     this.setLocation(this.city_name);
    //   localStorage.setItem("addTocart","true");
    // }else{
    //  // localStorage.setItem("addTocart","false"); this should be un-commented in live
    //  localStorage.setItem("addTocart","true");
    // }
     // console.log("Postalcode",data[5].address_components[0].long_name);
      localStorage.setItem('postalCode',this.postalCode);
    }); 
  }
  setCart(){ 
      //this.getPostalCode();
      this.postalCode = localStorage.getItem('postalCode');
      this.area_name = localStorage.getItem('location_area_name');
      this.liveLocation();
      //console.log("pc=",this.postalCode);
        this.tests= JSON.parse(localStorage.getItem('tests'));
        this.tot=0;

        if(this.tests===null){
          this.showhidecart=false;
         // return false;
         this.tests=[];
         
        }else{    
          this.tests.forEach(element => {
            //this._tempTest.push(element);  
            this.tot=this.tot+(element.quant*parseInt(element.test_finalpr)); 
          });
            this.showhidecart=true;
        }
      
       //packages
        this.pckgs= JSON.parse(localStorage.getItem('packages'));  
        if((this.pckgs===null)){
            this.pckgs=[]; 
                 }else{
          this.pckgs.forEach(element => {
          this.tot=this.tot+parseInt(element.package_finalpr); 
        });
          this.showhidecart=true;
           
         }

         this.cartCnt=this.tests.length+this.pckgs.length;
         this.postcheckOut();
    return false;
  }
  getOnlyTestByTid(tid){
    let a;
    let stest=JSON.parse(localStorage.getItem('tests'));
    //console.log(stest);
        if(stest){
          stest.forEach(element => {
            if(element.tid===tid){
              a=element;
              
            }
        });
        }
        return a;
  }
  quantAddByIndex(tid){
    
        this.getAddTestCart(this.getOnlyTestByTid(tid));
  }
  quantMinusByIndex(tid){
    
        this.getRemoveTestCart(this.getOnlyTestByTid(tid));
  }
  myIndexOf(o) {
    
         for (var i = 0; i < this.tests.length; i++) {
           let a=this.tests[i];
           let b=o;
          
             if (a.tid===b.tid) {
 
                 return i;
             }
         }
         return -1;
     }
     getAddTestCart(test){
      this.setCart();
      let i=this.myIndexOf(test);
      
      let t=this.tests[i].quant;
     
        t=t+1;
        this.tests[i].quant=t;
        localStorage.setItem('tests',JSON.stringify(this.tests));
        this.setCart();
     
     }
  getRemoveTestCart(test:any){
    this.setCart();
    let i=this.myIndexOf(test);
    
    let t=this.tests[i].quant;
    if(t>1){
      t=t-1;
      this.tests[i].quant=t;
      localStorage.setItem('tests',JSON.stringify(this.tests));
      this.setCart();
    }else{
      this.deleteCartItem(this.user.user_id,test.tid);
    }
  
  }
   setFlag(){
      if(localStorage.getItem('user')!=null){
        this.user=JSON.parse(localStorage.getItem('user'));
        this.isLoggedIn=true;
      }else{
        this.isLoggedIn=false;
      }
    }
    saveCartClearData(){
      if(localStorage.getItem('user')){
        let req_data={
          "TokenNo":"",
          "test_id":"0",
          "uid":JSON.parse(localStorage.getItem('user')).uid,
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
  

    }
  clearCart(){ 
      localStorage.removeItem('tests');
      localStorage.removeItem('packages');
      this.saveCartClearData();
      this.setCart();
      // this.router.navigate(['./book']);
    //  window.location.href="./book";
    // window.location.reload();

  }
  hideCart(){
      localStorage.setItem('showcart',"false");
      this.showhidecart=false;  
  }
  userValidDetailsCheck(){
     console.log(this.user.uid);
    let k=1
    if(this.user.uid>0){
      if(!isNaN(this.user.user_name)){
        k=2
      }
      if(this.user.user_address==="NA"){
        k=2
      }

     return k;
    }else{
     return k=0;
    }
  }
  checkOut(){
      this.hideCart();
      let a={"tot":this.tot,"hvc":this.hvc,"colc":this.colc};
      localStorage.setItem("cartValues",JSON.stringify(a));
    //console.log(this.user);
      //return;
      console.log(this.userValidDetailsCheck());
      if(this.userValidDetailsCheck()==1){
         this.router.navigate(['./cart']);
        // window.location.href="./cart" 
      }else if(this.userValidDetailsCheck()==2){
        
        this.router.navigate(['./account']);
      //  window.location.href="./account"
      }else{
        this.router.navigate(['./login']);
      //  window.location.href="./login"
      }
       // 
  }
  postcheckOut(){
    
    let a={"tot":this.tot,"hvc":this.hvc,"colc":this.colc};
    localStorage.setItem("cartValues",JSON.stringify(a));
  }
  toLogin(){
    this.router.navigate(['./login']);
  }

  toLogout(){
      this.isLoggedIn=false;
      this.user=[]; 
      this.loginComponent.loggedOut();
      this.setCart();
      this.router.navigate(['./home']);
  }

  profile(){
    this.router.navigate(['./account']);
  }

  getHumanDate(dt:any){
    dt=dt.replace("/Date(","");
    dt=dt.replace(")/","");
    dt=dt.split("+");
    let hr=dt[1].substring(0,2)*60*1000;
    let min=dt[1].substring(2,4)*60*1000;
    let fdt=parseInt(dt[0])+hr+min;
    let theDate = new Date(fdt);
    let dateString = theDate.toUTCString();
    let date1 = (theDate.getMonth()+1).toString()+'/'+theDate.getDate().toString()+'/'+theDate.getFullYear().toString();
    return date1;
  }

 /* deleteCartItem(uid:number,tid:number){
    this.tests= JSON.parse(localStorage.getItem('tests'));
     //console.log(this.tests);
      this.tests.forEach( (item, index) => {
       if(item.tid === tid) this.tests.splice(index,1);
       
     });
      this.pckgs= JSON.parse(localStorage.getItem('packages'));
     //console.log(this.tests);
      this.pckgs.forEach( (item, index) => {
        if(item.id === tid) this.pckgs.splice(index,1);
     });

     //this.hideCart();
     localStorage.setItem("tests", JSON.stringify(this.tests));
     //console.log(JSON.parse(localStorage.getItem('tests')));
     localStorage.setItem("packages", JSON.stringify(this.pckgs));
     
   }*/


deleteCartItem(uid:number,tid:number){

    this.tests= JSON.parse(localStorage.getItem('tests'));
      if(this.tests!=null){
              this.tests.forEach( (item, index) => {
              //console.log(this.sel_members[item.tid]['uid']);
                  if(item.tid === tid) this.tests.splice(index,1);
             });

       }

      this.pckgs= JSON.parse(localStorage.getItem('packages'));
           if(this.pckgs!=null){
            this.pckgs.forEach( (item, index) => {
              if(item.id === tid) this.pckgs.splice(index,1);
           });
      }

      localStorage.setItem("tests", JSON.stringify(this.tests));
      localStorage.setItem("packages", JSON.stringify(this.pckgs));
      // console.log(this.tests);
       this.tests = JSON.parse(localStorage.getItem('tests'));
       this.pckgs = JSON.parse(localStorage.getItem('packages'));
       this.tot=0;
      /* if(this.tests!==null){
         this.tests.forEach(element => {
                this.tot=this.tot+parseInt(element.test_finalpr); 
              });
         this.testsCount=this.tests.length;

       }else{
        this.testsCount=0;
       }*/
            if(this.tests){
                this.tests.forEach(element => {
                    this.tot=this.tot+(parseInt(element.quant)*parseInt(element.test_finalpr)); 
                });
                this.testsCount=this.tests.length;
                
            }else{
                 this.testsCount=0;
            }
        

       /* if(this.pckgs!==null){
           this.pckgs.forEach(element => {
                this.tot=this.tot+parseInt(element.package_finalpr); 
              });
           this.packagesCount = this.pckgs.length;
          }else{
            this.packagesCount=0;
          }
          this.cartCnt=this.testsCount+this.packagesCount;*/ 
        
              if(this.pckgs){
                this.pckgs.forEach(element => {
                    this.tot=this.tot+parseInt(element.package_finalpr); 
                });
                 this.packagesCount = this.pckgs.length;
                
            }else{
                this.packagesCount=0;
            }
            let a={"tot":this.tot,"hvc":this.hvc,"colc":this.colc};
            localStorage.setItem("cartValues",JSON.stringify(a));
          // this.cartCnt=this.tests.length+this.pckgs.length;
          this.cartCnt=this.testsCount+this.packagesCount;
          
  
   }
   select(item,temp){

    this.filterKey = new String(item);
    var re=/ /gi;
    this.filterKey=this.filterKey.replace(re,"_"); 
    this.filterKey=this.filterKey.replace("(","__,_"); 
    this.filterKey=this.filterKey.replace(")","_,__");
       if(temp=="test"){
       
        
        
        // window.location.href="./test-details/"+this.filterKey;
        
       
        if(this.currentUrl.indexOf('test-details')>=0){
          
          window.location.href="./test-details/"+this.filterKey;
          //debugger;
          //this.router.navigate(["./test-details/"+this.filterKey]);
         // window.location.reload();
        }else{
          this.router.navigate(["./test-details/"+this.filterKey]);
        }
        
       }else if(temp=="organ"){
   
        this.router.navigate(['./book', {organ:this.filterKey}]);
       }else if(temp=="spl"){

        this.router.navigate(['./book', {speciality:this.filterKey}]);
       }else if(temp=="cond"){
        
                this.router.navigate(['./book', {condition:this.filterKey}]);
               }else if(temp="package"){

                    let base_url="";
                     base_url="package-details";
                   /*if( this.ptype=="H"){
                    base_url="package-details";
                   }else if(this.ptype=="P"){
                    base_url="profile-details";
                   }*/
                   window.location.href="./"+base_url+"/"+this.filterKey; 

               }
  
    
   // this.filteredItems = [];
}
getTestForCart(){
  //console.log(this.tests);
  if(localStorage.getItem("tests")!==null){
    if(this.tests.length!==JSON.parse(localStorage.getItem("tests")).length){
      this.tests=JSON.parse(localStorage.getItem("tests"));
    }
  }
  
  return this.tests;
}
getCartDropDown(){

 return this.crtDrpDown;
}



}
