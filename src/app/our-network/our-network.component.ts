import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
 import {ApiService} from '../common/api.service';
import {AppComponent} from '../app.component';
import {NgForm, FormControl,Validators} from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
declare var swal: any;
@Component({
  selector: 'app-our-network',
  templateUrl: './our-network.component.html',
  styleUrls: ['./our-network.component.css']
})
export class OurNetworkComponent implements OnInit {
  _packagesSearchResult: any;
  ser_string:any; 
  mpckgshow:boolean=true;
  searchTerm : FormControl = new FormControl('', [Validators.required, Validators.minLength(3)]);
  searchResult = [];
  _packages=[];
  public filterKey:any;
  tokenSet:boolean=false;
public _appComponent:any;

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
 
top_tests:string[]=["Complete Blood Picture (CBP), EDTA Whole Blood","Lipid Profile, Serum","Liver Function Test (LFT), Serum","Thyroid Antibodies (TG & TPO), Serum","Thyroid Profile (T3,T4,TSH), Serum","1, 25-Dihydroxy Vitamin D, Serum","25 - Hydroxy Vitamin D, Serum","Urea, Serum","Creatinine, Serum","Triple Marker, Serum","Magnesium, Serum"
,"Complete Urine Examination (CUE), Spot Urine","Glucose Fasting (FBS),  Sodium Flouride Plasma","Glycosylated Hemoglobin (HbA1C), EDTA Whole Blood","Uric Acid, Serum","Thyroglobulin (Tg), Serum","Blood Urea Nitrogen (BUN), Serum","Prolactin, Serum","Prothrombin Time With INR, Sodium Citrate Whole Blood","HIV 1 & 2 Antibodies, Serum","Culture And Sensitivity (Aerobic), Urine"];

  constructor(private _api :ApiService, private router :Router,_appComponent :AppComponent) {
    this._appComponent=_appComponent;
   this.tokenSet=this._appComponent.isLoggedIn;
    this._api=_api;

  //AutoComplete search
     /*this.searchTerm.valueChanges
        .debounceTime(400) 
        .subscribe(data => {
        let term = new String(data); 
        if(term.length >=3){
          this._api.getToken().subscribe( 
            token => {
        this._api.POST('GetServices', {TokenNo:token,pincode:'' ,test_name:data,test_code:'',test_type:'',condition_id:'',speciality_id:'',sort_by:'',sort_order:'',AlphaSearch:'',user_id:'',is_home_collection:"",organ_id:"",city_name:this._appComponent.getCityName()}).subscribe(data =>{
                        if(data.status==1){
                          this.searchResult=JSON.parse(data.json).data;
                        }else{
                          this.searchResult=[];
                        }
                         
                       });
                      });
                       this._api.getToken().subscribe( 
                        token => {
                  this._api.POST('GetPackages',{TokenNo:token,"pincode":"","package_name":data,"package_code":"","sort_by":"","sort_order":"","alphaSearch":"",organ_id:"",type:"H",city_name:this._appComponent.getCityName()}).subscribe(data =>{
                  if(data.status==1){
                    this._packagesSearchResult=JSON.parse(data.json).data;
               
                  }else{
                    this._packagesSearchResult=[];
                  }
                
               });
              });
             }      
        })*/
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

   }

  ngOnInit() {
    window.scrollTo(0, 0);
  }

   //SELCTION ITEM METHOD.
   select(item,type:any){
    
    this.filterKey = new String(item);
    var re=/ /gi;
    let fk;
    fk=this.filterKey.replace(re,"_"); 
    fk=fk.replace("(","__,_"); 
    fk=fk.replace(")","_,__"); 
    this.searchResult = [];
     this._packages=[];
    if(type=="test"){
    
      window.location.href="./test-details/"+fk;
    }else if(type="package"){
      window.location.href="./package-details/"+fk;
    }
  
}

  

   searchBasedOnString(str:any){
    this.router.navigate(['./book/tests', {searchString:str}]);
  }

  movescaro(obj:any,dir:any){
     if(dir=="left"){
        obj.previous();
     }else if(dir=="right"){
        obj.next();
     }
    
  }
      loginSubmit(form: NgForm,isValid: boolean){
      let data={
          "TokenNo":"",  
          "login_username":form.value.phone,
          "password":form.value.password1
          };
       
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
                    
                        if(res[0].user_token != null){
                          localStorage.setItem('token',res[0].user_token);
                          localStorage.setItem('user',JSON.stringify(res[0]));
                          this.redir('order-history');
                        }else{
                         
                          form.resetForm(); 
                        }
                    }
    
    
              });
    
            })
    
          }else{
              console.log("");
          }
    
      }
      getPopularTests(strng){
        if(strng===''){
          return this.top_tests;
        }else{
          return [];
        }
        
      }
      //book a test and status blocks
      getBookAnAppointment(){
        
          this.router.navigate(['./book']);
       }
       redir(val:string){
        window.location.href="./"+val;
      }
      getOTP(){
        this._appComponent.checkRepo=true;
        this._appComponent.toLogin();
      }

}
