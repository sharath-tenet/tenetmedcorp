import { Component, OnInit } from '@angular/core';
import { ApiService } from "../common/api.service";
import { ActivatedRoute,  Router } from '@angular/router';
import { AppComponent } from "../app.component";

@Component({
  selector: 'app-bill-view',
  templateUrl: './bill-view.component.html',
  styleUrls: ['./bill-view.component.css']
})
export class BillViewComponent implements OnInit {
  bill_no: string;
  partient_name: any;
  billDetails: any[];
  loading: any=[];
  statusMan:any={"Bill Done":1,"Collected Samples":2,"Sample Received":3,"Result Done":4,"Verified":5,"Approved":6,"Dispatched":7}
  constructor(private _api :ApiService,private router :ActivatedRoute,private route :Router,private app:AppComponent) {
this.loading['billDetails']=false;
   }

  ngOnInit() {
    this.bill_no=this.router.snapshot.paramMap.get('bill');
   
    if(this.app.isLoggedIn){
      this.getBillDetails(this.bill_no);
    }else{
      this.route.navigate(['./login']);
    }

  }
  getBillDetails(bill_no){
    //// 
   // console.log(bill_no);
   
  //  this.router.navigate(['./bill-view']);
   this.loading['billDetails']=true;
    this.billDetails=[];
    this._api.getToken().subscribe( 
      token => {
    this._api.POST('GetOrderDetails', {TokenNo: token,'orderno':bill_no,'mobileno':''}).subscribe(data =>{
      
      this.billDetails=JSON.parse(data.json).data;
      let i=0;
      this.billDetails.forEach(element => {
        this.billDetails[i]['test_status']=this.getStatusNumber(element.test_status);
        i++;
      });
      console.log(this.billDetails);
   this.partient_name=this.billDetails[0].patient_name;
   this.loading['billDetails']=false;
      });
    });
  }
  getStatusNumber(val){
   if(this.statusMan[val]){
     return this.statusMan[val];
   }else{
     return 0;
   }
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
 

}
