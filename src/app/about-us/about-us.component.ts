import { Component, OnInit } from '@angular/core';
import {ApiService} from '../common/api.service';
import {Router} from '@angular/router';
import {AppComponent} from '../app.component';
import {NgForm, FormControl,Validators} from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
declare var swal: any;


@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css']
})
export class AboutUsComponent implements OnInit {
 _packagesSearchResult: any=[];
  getpackagecnf: boolean;
  ser_string:any; 
  searchTerm : FormControl = new FormControl('', [Validators.required, Validators.minLength(3)]);
  searchResult = [];
  _packages:any=[];
  public filterKey:any;

  top_tests:string[]=["Complete Blood Picture (CBP), EDTA Whole Blood","Lipid Profile, Serum","Liver Function Test (LFT), Serum","Thyroid Antibodies (TG & TPO), Serum","Thyroid Profile (T3,T4,TSH), Serum","1, 25-Dihydroxy Vitamin D, Serum","25 - Hydroxy Vitamin D, Serum","Urea, Serum","Creatinine, Serum","Triple Marker, Serum","Magnesium, Serum"
                      ,"Complete Urine Examination (CUE), Spot Urine","Glucose Fasting (FBS),  Sodium Flouride Plasma","Glycosylated Hemoglobin (HbA1C), EDTA Whole Blood","Uric Acid, Serum","Thyroglobulin (Tg), Serum","Blood Urea Nitrogen (BUN), Serum","Prolactin, Serum","Prothrombin Time With INR, Sodium Citrate Whole Blood","HIV 1 & 2 Antibodies, Serum","Culture And Sensitivity (Aerobic), Urine"];
  loading:any=[];
  mpckgshow:boolean=false;
  _pckg:any=[];
  tmp:any=[];
  tokenSet:boolean=false;
 _appComponent:any=[];
 queryString:any;

  //for search functionality
 private condition_id:any;
 private speciality_id:any;
 private category_id:any;
 private searchString:string;
 private sortBy:any; //1-name,2-price,3-popularity 
 private test_type:any; //1-filter,2-package
 private pincode:number=0;
 private sort_order:any=1; //1-ASC,2-DESC,Default Asending 
 private alphaSearch="";
 organ_id: any=null;
  constructor(private _api:ApiService,private router :Router,_appComponent :AppComponent) {
  	    this._appComponent=_appComponent;
        this.tokenSet=this._appComponent.isLoggedIn;
        this.queryString;
    //autoComplete search

     this.searchTerm.valueChanges
        .debounceTime(400) 
        .subscribe(data => {
        let term = new String(data); 
        if(data==undefined){
          this.mpckgshow=false;
          return false;
        }
        if(term.length >=3){
              this.sortBy="";
              this.speciality_id="";
              this.condition_id="";
              this.organ_id="";
              this.test_type="";
              this.alphaSearch="";    
              this._api.getToken().subscribe(
                token => {
                 
              this._api.POST('GetServices', {TokenNo: token,pincode: this.pincode,test_name:data,test_code:'',test_type:this.test_type,condition_id:this.condition_id,speciality_id:this.speciality_id,sort_by:this.sortBy,sort_order:this.sort_order,alphaSearch:this.alphaSearch,user_id:'',is_home_collection:"",organ_id:this.organ_id,city_name:this._appComponent.getCityName()}).subscribe(data =>{

                if(data.status==1){
               this.searchResult=(JSON.parse(data.json).data);
                }else{
                 this.searchResult=[];
                }

               });
              });

                 this._api.getToken().subscribe( 
                        token => { 
         this._api.POST('GetPackages',{TokenNo: token,"pincode":"","package_name":data,"package_code":"","sort_by":"","sort_order":"","alphaSearch":"","type":"H",city_name:this._appComponent.getCityName()}).subscribe(data =>{
                  if(data.status==1){
                    this._packagesSearchResult=JSON.parse(data.json).data;
                  }else{
                    this._packagesSearchResult=[];
                  }
                  this.mpckgshow=true;
               });
              });

             }      
        })
        /*this.searchTerm.valueChanges
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
        this._api.POST('GetServices', {TokenNo: token,pincode:'' ,test_name:data,test_code:'',test_type:'',condition_id:'',speciality_id:'',sort_by:'',sort_order:'',AlphaSearch:'',user_id:'',is_home_collection:"",organ_id:"",city_name:this._appComponent.getCityName()}).subscribe(data =>{
                        if(data.status==1){
                          this.searchResult=JSON.parse(data.json).data;
                        }else{
                          this.searchResult=[];
                        }
                         
                       });
                      });
                    
     this._api.getToken().subscribe( 
                        token => { 
         this._api.POST('GetPackages',{TokenNo: token,"pincode":"","package_name":data,"package_code":"","sort_by":"","sort_order":"","alphaSearch":"","type":"",city_name:this._appComponent.getCityName()}).subscribe(data =>{
                  if(data.status==1){
                    this._packagesSearchResult=JSON.parse(data.json).data;
                  }else{
                    this._packagesSearchResult=[];
                  }
                  this.mpckgshow=true;
               });
              });

             }      
        })*/

   }
     
	  ngOnInit() {
	    window.scrollTo(0, 0);
	  }

     getPopularTests(strng){
      if(strng===''){
        return this.top_tests;
      }else{
        return [];
      }
      
    }

     searchBasedOnString(str:any){
      if(str != undefined){
        this.router.navigate(['./book/tests', {searchString:str}]);
      }else{
        return false;
      }
     }

     //SELCTION ITEM METHOD.
    select(item,type:any){
        this.filterKey = new String(item);
        
        this.searchResult = [];
         this._packages=[];
         var re=/ /gi;
         let fk;
         fk=this.filterKey.replace(re,"_"); 
         fk=fk.replace("(","__,_"); 
         fk=fk.replace(")","_,__"); 
        if(type=="test"){
     
          window.location.href="./test-details/"+fk;
        }else if(type="package"){
          window.location.href="./package-details/"+fk;
        }
    }
    redir(url){
      this.router.navigate(['./'+url]);
    }

}
