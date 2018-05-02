import { Component, OnInit,ViewChild } from '@angular/core';
import {ApiService} from '../common/api.service';
import {BookComponent} from '../book/book.component';
import { Router, ActivatedRoute } from '@angular/router';

import { FormControl,Validators} from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import { AppComponent } from "../app.component";

@Component({
  selector: 'app-our-packages',
  templateUrl: './our-packages.component.html',
  styleUrls: ['./our-packages.component.css'],
  providers:[BookComponent],
  //directives:[BookComponent]
})
export class OurPackagesComponent implements OnInit {
  loading: any=[];
  curl: string;
  event: string;
  ser_string: any;

  //@ViewChild(myChildComponent)
  //private myChild: BookComponent;

  public _api:ApiService;
  public bookComponent:any;
  public _packages=[];
  _packageServices:any=[];
  testsList:any=[];
  packageServicesList:any=[];
  msg:string=null;

  searchTerm : FormControl = new FormControl('', [Validators.required, Validators.minLength(3)]);
  searchResult = [];
  _packages1=[];

  public filterKey:any;

  constructor(private router :Router, _api :ApiService, bc:BookComponent,private rou:ActivatedRoute,private _appComponent :AppComponent,) {
    this._api=_api;
    this.bookComponent=bc;
    this.event=this.rou.snapshot.paramMap.get('event');
    this.ser_string=this.event;
    this.ser_string=this.ser_string.replace("__,_","("); 
    this.ser_string=this.ser_string.replace("_,__",")"); 
    var re=/_/gi;
    this.ser_string=this.ser_string.replace(re," ");

    this.ser_string=this.ser_string.replace(/^\s+|\s+$/g,""); 
    //console.log(this.ser_string);
    this.ser_string=new String(this.ser_string);
    //debugger;
    //console.log(this.event);
   
    this.curl=this._appComponent.currentUrl.split("/")[0];
    this.getPackages();
    //AutoComplete search
     this.searchTerm.valueChanges
        .debounceTime(400) 
        .subscribe(data => {
        let term = new String(data); 
        if(term.length >=3){
          this._api.getToken().subscribe( 
            token => {
        this._api.POST('GetServices', {TokenNo:token,pincode:'' ,test_name:data,test_code:'',test_type:'',condition_id:'',speciality_id:'',sort_by:'',sort_order:'',AlphaSearch:'',user_id:'',is_home_collection:""}).subscribe(data =>{
                        if(data.status==1){
                          this.searchResult=JSON.parse(data.json).data;
                        }else{
                          this.searchResult=[];
                        }
                         
                       });
                      });
                       this._api.getToken().subscribe( 
                        token => {
                  this._api.POST('GetPackages',{TokenNo:token,"pincode":"","package_name":data,"package_code":"","sort_by":"","sort_order":"","alphaSearch":"","type":""}).subscribe(data =>{
                  if(data.status==1){
                    this._packages1=JSON.parse(data.json).data;
                  }else{
                    this._packages1=[];
                  }
                
               });
              });
             }      
        })

   }

  ngOnInit() {
    window.scrollTo(0, 0);
  }

    //SELCTION ITEM METHOD.
    select(item){
        this.filterKey = item;
        this.searchResult = [];
        this._packages1=[];
       // this.filteredItems = [];
    }
  
   searchBasedOnString(str:any){
    this.router.navigate(['./book', {searchString:str}]);
  }
  contactusSubmit(data:any){
    data.purpose="2";
    this._api.POST('ContactUs', data).subscribe(data =>{ 
      let responce=JSON.parse(data.json).data;
      this.msg=responce[0].message;
 
      });
  }
  removeUndefined(){
    if(this.ser_string==undefined){
      this.ser_string="";
    }
  }
  getPackages(){
    let type="";
    console.log(this.curl);
    if(this.curl=="package-details"){
      
       type="H";
    }else if(this.curl=="profile-details"){
       type="P";
    }
    this.loading['_packages']=true;
    this.removeUndefined();
    this._api.getToken().subscribe( 
      token => {
    this._api.POST('GetPackages',{TokenNo:token,"pincode":"","package_name":this.ser_string,"package_code":"","sort_by":"","sort_order":"","alphaSearch":"","type":type}).subscribe(data =>{
      if(data.status==1){
        this._packages=JSON.parse(data.json).data;
        //this.testsList=[];
      }else{
        this._packages=[];
      }
      //console.log('packages',this._packages);
              if(this._packages.length > 0){
              this.getPackagesDetails();
              }
         //console.log(this._packages);
     });
    });
   
  }
  getPackagesDetails(){
    
       this._packages.forEach(element => {
        
              this.getTests(element);
        }); 
        this.loading['_packages']=false;
      
         console.log(this.packageServicesList);
  }

  getTests(element){
 //this.packageServicesList=[];
 this._api.getToken().subscribe( 
  token => {
        this._api.POST('GetPackageServices',{TokenNo:token,"Pckage_id":element.id}).subscribe(data =>{
            if(data.status==1){
              let _packageServices=JSON.parse(data.json).data;
              this.packageServicesList[element.id]=[];
              this.packageServicesList[element.id] = _packageServices;
             
            }else{
              this._packageServices=[];
            }

            

           });
          });
  }

  addPackageCart(pckg:any){
    // this.bookComponent.getAddPackageCart(pckg);
   /*this.router.navigate(['./book', {searchString:str}]);*/
   this.bookComponent.getAddTestCart(pckg,"pckg");
  }
  isadded(tid:number):boolean{
    //console.log(tid);
    let k =this.bookComponent.shortIndex(tid);
   
    return k;
  }
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



}
