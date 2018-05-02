import { Component, OnInit, Injectable} from '@angular/core';
import {BookComponent} from '../book/book.component';
import {ApiService} from '../common/api.service';
import {Router} from '@angular/router';
import {AppComponent} from '../app.component';

import {NgForm, FormControl,Validators} from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
declare var swal: any;
@Component({
  selector: 'app-our-facilities',
  templateUrl: './our-facilities.component.html',
  styleUrls: ['./our-facilities.component.css'],
  providers:[BookComponent]
})

@Injectable()
export class OurFacilitiesComponent implements OnInit {
   public _bookComponent:any;
  
   public _api:ApiService;

  searchTerm : FormControl = new FormControl('', [Validators.required, Validators.minLength(3)]);
  searchResult = [];
  _packages:any=[];
  public filterKey:any;

  tokenSet:boolean=false;
  public _appComponent:any;

  constructor(_bookComponent :BookComponent,_api :ApiService,private router :Router,_appComponent :AppComponent) {
      this._appComponent=_appComponent;
      this.tokenSet=this._appComponent.isLoggedIn;
  		this._bookComponent=_bookComponent;
  		this._api=_api;
  		this.router = router;

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
                  this._api.POST('GetPackages',{TokenNo:token,"pincode":"","package_name":data,"package_code":"","sort_by":"","sort_order":"","alphaSearch":""}).subscribe(data =>{
                  if(data.status==1){
                    this._packages=JSON.parse(data.json).data;
                    //this.testsList=[];
                  }else{
                    this._packages=[];
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
        this._packages=[];
       // this.filteredItems = [];
    }

   	search(srt_by:any,searchString:any){
	 //this._bookComponent.serClick(srt_by,strng);
	  this.router.navigate(['./book', {searchString:searchString}]);
	}

    getBookAnAppointment(){
    this.router.navigate(['./book']);
  }

    searchBasedOnString(str:any){
    this.router.navigate(['./book', {searchString:str}]);
  }

   redir(val:string){
        window.location.href="./"+val;
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
                          this.redir('order-history');
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

}
