import { Component, OnInit } from '@angular/core';
import { ApiService } from "../common/api.service";
import { BookComponent } from "../book/book.component";
import { AppComponent } from "../app.component";


import { ActivatedRoute,  Router } from '@angular/router';
declare var AmCharts: any;
declare var Typed: any;
@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
  providers:[BookComponent]
})
export class ReportsComponent implements OnInit {
  user: any;
  tid: any=0;
  tmp: any=[];
  units:any="";
  dt: any;
  loading: any = [];
  components: any = [];
  billDetails: any = [];
  data: any;
 maxv1:any;
 minv1:any;
 mtest:any;
  constructor(private _api :ApiService,private router :ActivatedRoute,private bookComponent:BookComponent,private app:AppComponent) { }

  ngOnInit() {
    this.data=this.router.snapshot.paramMap.get('data');
    this.dt=this.data.split("_");
    this.loading['graph']=true;
    this.getBillDetails(this.dt[2]);
    this.getGraph(this.dt[0],this.dt[1],this.dt[2]);
    this.getTyped();
    this.user=this.getUser();
    
  }
  
  getUser(){
    if(localStorage.getItem("user")!==null){
      return JSON.parse(localStorage.getItem("user"));
    }else{
      return [];
    }
    

  }
  getBillDetails(bill_no:any){
    if(this.tid==0){
      this.tid=this.dt[1];
    }
    this._api.getToken().subscribe( 
      token => {
    this._api.POST('GetOrderDetails', {TokenNo: token,'orderno':bill_no,'mobileno':'','type':''}).subscribe(data =>{
      this.billDetails=JSON.parse(data.json).data;
      
      
      this.loading['graph']=false;
      if(this.user.length==0){
        this.selectMemberLogin(this.billDetails[0].uid);
      }else{
        this.getParamSlip(this.tid,this.billDetails[0].order_no);
      }
   
      });
    });
  }
  getTyped(){
    
    var typed = new Typed('#typed', {
      stringsElement: '#typed-strings',
      startDelay: 5000,
      typeSpeed: 100,
      cursorChar: '<span style="color:#f15b28">&hearts;</span>',
      smartBackspace: false,
    });
  }
  getParamSlip(tid,bill){
    let a={"target":{"value":0}};
    a.target.value=tid;
    
    this.getParameters(a,bill);
  }
  getParameters(tid,bill_no){
    tid=tid.target.value;
    this.tid=tid;
    this.loading['graph']=true;
    this._api.getToken().subscribe( 
      token => { 
        this._api.POST('GetGraphValues', {TokenNo: token,testid: tid,billno: bill_no}).subscribe(data =>{
                  let tmp=JSON.parse(data.json).data;
                  this.tmp=tmp;
                   
                  this.components=tmp;
                  this.components=this.components.filter(data=>
                    data.GRAPH_FLAG===1
                  );
                  this.loading['graph']=false;
                  
        
       });
      });

  }
  middlegraph(cid){
    this.loading['graph']=true;
    cid=cid.target.value;
    this.getGraph(cid,this.tid,this.dt[2]);
  }
  getGraph(cid,tid,bill_no){
    this.tid=tid;
    this._api.getToken().subscribe( 
      token => { 
        this._api.POST('GetGraphComponentValues', {TokenNo: token,testid: tid,billno: bill_no,component_id:cid}).subscribe(data =>{
                  this.tmp=JSON.parse(data.json).data;
                  this.loading['graph']=false; 
                  if(this.tmp==undefined){
                    this.app.getNotify("Something Went Wrong Please Try another component");
                    return false;
                  }else{
                    
                  }
                   let arr=[];
                   let cname=this.tmp[0].COMPONENT_NAME;
                   let units=this.tmp[0].UNITS;
                   this.units=units;
                   let minv;
                   let maxv;
                   let fdate;
                   this.tmp.forEach(function (dta) {
                     let rv=parseFloat(dta.RESULT_VALUE);
                      minv=parseFloat(dta.NV_MIN_VALUE);
                      maxv=parseFloat(dta.NV_MAX_VALUE);
                      let rawdate=dta.CREATE_DT.toString();
                     let dt=rawdate;
                      dt=dt.replace("/Date(","");
                      dt=dt.replace(")/","");
                      dt=dt.split("+");
                      let hr=dt[1].substring(0,2)*60*1000;
                      let min=dt[1].substring(2,4)*60*1000;
                      let fdt=parseInt(dt[0])+hr+min;
                      let theDate = new Date(fdt);
                      let dtn;
                      let mnth;
                      let year;
                      dtn=theDate.getDate();
                      mnth=theDate.getMonth()+1;
                      year=theDate.getFullYear();
                      if(dtn<10){
                        dtn='0'+ dtn.toString();
                      }
                      if(mnth<10){
                        mnth='0'+ mnth.toString();
                      }
                      fdate = dtn+'-'+mnth+'-'+year;
                    
                     if((rv<=maxv)&&(rv>=minv)){
                      arr.push({"date":fdate,"count":dta.RESULT_VALUE,"color": "#60C144"});
                     }else{
                       if(rv<minv){
                        arr.push({"date":fdate,"count":dta.RESULT_VALUE,"color": "#f9aa1b"});
                       }else{
                        arr.push({"date":fdate,"count":dta.RESULT_VALUE,"color": "#b70d0d"});
                       }
                      
                     }
                    
                  }); 
                  this.maxv1=maxv;
                  this.minv1=minv;
                  
                  this.getValues(arr,cname,units,minv,maxv);
                   
                  
       });
      });
  }
  getValues(data,cname,units,minv,maxv){
    var chart = AmCharts.makeChart( "chartdiv", {
      "type": "serial",
      "theme": "light",
      "titles": [{
        "text": cname
      }
      // , {
      //   "text": "Statistics (units: "+units+",Min:"+minv+",Max:"+maxv+")",
      //   "bold": false
      // }
    ],
      "dataProvider": data,
      "valueAxes": [ {
        "gridColor": "#60C144",
        "gridAlpha": 0.2,
        "minimum":(0.6*minv),
        "maximum":(1.4*maxv),
        "dashLength": 0,
        "title": "Value",
        "guides": [{
          "value": minv,
          "toValue": maxv,
          "fillColor": "#00CC00",
          "inside": true,
          "fillAlpha": 0.1,
          "lineAlpha": 0.1,
          "label":"Normal",
          "color":"#00CC00",
          
          
        },
        {
          "value": (0.6*minv),
          "toValue": minv,
          "fillColor": "#f9aa1b",
          "inside": true,
          "fillAlpha": 0.1,
          "lineAlpha": 0,
          "label":"Low",
          "color":"#f9aa1b",
          
        },
        {
          "value": maxv,
          "toValue": (1.4*maxv),
          "fillColor": "#960000",
          "inside": true,
          "fillAlpha": 0.1,
          "lineAlpha": 0,
          "label":"High",
          "color":"#960000",
          
        }
      ]
      } ],
      
      "chartCursorSettings": {
        
      },
      "gridAboveGraphs": true,
      "startDuration": 1,
      "graphs": [ {
        "balloonText": "[[category]]: <b>[[value]]</b>",
        "fillColorsField": "color",
        "fillAlphas": 0.8,
        "lineAlpha": 0.2,
        
        
        "type": "column",
        "valueField": "count"
      } ],
      "chartCursor": {
        "categoryBalloonEnabled": false,
        "zoomable": false,
        "valueBalloonsEnabled": true,
        "fullWidth": true,
        "cursorAlpha": 0.1,
        "valueLineBalloonEnabled": true,
        "valueLineEnabled": false,
        "valueLineAlpha": 0.3
      },
      "categoryField": "date",
      "categoryAxis": {
        "gridPosition": "start",
        "gridAlpha": 0,
        "title": "Date",
        "labelColorField":"	#60C144",
        "tickPosition": "start",
        "tickLength": 20
      },
      "export": {
        "enabled": false,
        "libs": {
          "path": "../libs/"
        },
        "menu": [ {
          "class": "export-main",
          "menu": [ {
            "label": "Download",
            "menu": [ "PNG", "JPG", "CSV" ]
          }, {
            "label": "Annotate",
            "action": "draw",
            "menu": [ {
              "class": "export-drawing",
              "menu": [ "PNG", "JPG" ]
            } ]
          } ]
        } ]
      }
    
    } );
    this.loading['graph']=false;
  }
  addTestToCart(){
    let ac=this.billDetails.filter((item)=>{
      return item.tid==this.tid;
    });
    let test=ac[0];
    let test1 = test;
    test={};
    test.tid = test1.tid;
    test.test_code = test1.test_code;
    test.test_finalpr = test1.test_amount;
    test.test_name = test1.test_name;
    test.test_price = test1.test_amount;
    test.quant = 1;
    test.report_avb = "";
    test.test_ptn = "";
    test.type = "";
    test.is_home_collection=test1.is_home_collection;
    this.bookComponent.getAddTestCart(test,"test",'',true);

  }
  selectMemberLogin(uid:any){
    
      this.loading['getotp']=true;
  
            this._api.getToken().subscribe( 
            token => { 
                let data = {
                  "TokenNo":token,
                  "user_id":uid
                }
             
          this._api.POST('GetSelectedUserDetails', data).subscribe(data =>{
             let resp=(JSON.parse(data.json).data);
             let res=resp;
             if(resp ==undefined){
                
                
                this.loading['getotp']=false;
             }else{
              
             
                if(resp[0].uid!=null){ 
                  if(res[0].user_token==null){
                    res[0].user_token="sometokenhere007";
                  }
                  if(res[0].user_token != null){
                    localStorage.setItem('token',res[0].user_token);
                    let nk=[];
                    if(res[0].user_name==null){
                      nk[0]="";
                      nk[1]="";
                    }else{
                      nk=res[0].user_name.split(" ");
                    }
                    res[0].firstname=nk[0];
                    res[0].lastname=nk[1];
                    localStorage.setItem('user',JSON.stringify(res[0]));
                      
                        
                         
                          
                          
                        }
                        //  this.gotp.nativeElement.removeAttribute("data-target");
                        //  this.gotp.nativeElement.setAttribute("type","submit");
                        
                         this.app.getNotify("Check Your report in a hassle free manner");
                         window.location.reload();
                  }
                  //login
                          
                  }
  
              
             
  
             
              
             });
            });
          
  
  
        
  
  }
  
  

}
