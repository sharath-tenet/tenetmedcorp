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

  searchTerm : FormControl = new FormControl('', [Validators.required, Validators.minLength(3)]);
  searchResult = [];
  _packages=[];
  public filterKey:any;
  tokenSet:boolean=false;
public _appComponent:any;


  constructor(private _api :ApiService, private router :Router,_appComponent :AppComponent) {
    this._appComponent=_appComponent;
   this.tokenSet=this._appComponent.isLoggedIn;
    this._api=_api;

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

  getBookAnAppointment(){
    this.router.navigate(['./book']);
  }
   redir(val:string){
        window.location.href="./"+val;
      }

   searchBasedOnString(str:any){
    this.router.navigate(['./book', {searchString:str}]);
  }

  movescaro(obj:any,dir:any){
     if(dir=="left"){
        obj.previous();
     }else if(dir=="right"){
        obj.next();
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
