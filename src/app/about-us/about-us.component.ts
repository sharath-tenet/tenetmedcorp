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
  constructor(private _api:ApiService,private router :Router,_appComponent :AppComponent) {
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
         this._api.POST('GetPackages',{TokenNo: token,"pincode":"","package_name":data,"package_code":"","sort_by":"","sort_order":"","alphaSearch":"","type":""}).subscribe(data =>{
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
        this.router.navigate(['./book', {searchString:str}]);
      }else{
        return false;
      }
     }

     //SELCTION ITEM METHOD.
    select(item,type:any){
        this.filterKey = new String(item);
        
        this.searchResult = [];
         this._packages=[];
        if(type=="test"){
          var re=/ /gi;
          
          this.filterKey=this.filterKey.replace(re,"_"); 
          this.filterKey=this.filterKey.replace("(","__,_"); 
          this.filterKey=this.filterKey.replace(")","_,__"); 
          window.location.href="./book/test-details/"+this.filterKey;
        }else if(type="package"){

        }
       // this.filteredItems = [];
    }

}
