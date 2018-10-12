import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-doctors',
  templateUrl: './doctors.component.html',
  styleUrls: ['./doctors.component.css']
})
export class DoctorsComponent implements OnInit {
doctors:any=[
  {"name":"Dr .Dilip Nandamuri","specialization":"General Physician","days":"Monday - Saturday","timing":"4:00 PM - 6:00 PM","location":"Banjara Hills"},
  {"name":"Dr .Kiranmai Lingutla","specialization":"General Physician","days":"Monday - Saturday","timing":"10:00 AM-1:00 PM","location":"Banjara Hills"},
  {"name":"Dr .JVS Gopinath","specialization":"Physician","days":"Monday - Saturday","timing":"6:00 PM-9:00 PM","location":"Banjara Hills"},
{"name":"Dr. Bhakthiar Choudary","specialization":"Sports Medicine","days":"Monday,Tuesday,Friday,Saturday","timing":"9:00 AM-3:00 PM","location":"Banjara Hills"},
{"name":"Dr. Rahul Lath","specialization":"Neuro Surgeon","days":"Monday,Thursday","timing":"5:00 PM-8:00 PM","location":"Banjara Hills"},
{"name":"Dr .B.G.Ratnam","specialization":"Neuro Surgeon","days":"Tuesday,Friday","timing":"5:00 PM-8:00 PM","location":"Banjara Hills"},
{"name":"Dr .Amitava Ray","specialization":"Neuro Surgeon","days":"Wednesday,Saturday","timing":"5:00 PM-8:00 PM","location":"Banjara Hills"},
{"name":"Dr .B.V.Rama Rao","specialization":"CT Surgeon","days":"Monday - Saturday","timing":"5:00 PM-8:00 PM","location":"Banjara Hills"},

{"name":"Dr .Sumina","specialization":"Gynecologist","days":"Monday - Saturday","timing":"Available With Prior Appointment","location":"Banjara Hills"},


{"name":"Dr .Bhavana","specialization":"Pulmonoligist","days":"Monday - Saturday","timing":"11:00 AM-1:00 PM","location":"Banjara Hills"},
{"name":"Dr .Ravi Srinivas","specialization":"Cardiologist","days":"Monday - Saturday","timing":"Available With Prior Appointment","location":"Banjara Hills"},
{"name":"Dr .Krks Raju","specialization":"Cardiologist","days":"Monday - Saturday","timing":"Available With Prior Appointment","location":"Banjara Hills"},
{"name":"DR. Kiran Kumar Lingutla","specialization":"Orthopedic Spine Surgeon","days":"Monday - Saturday","timing":"Available With Prior Appointment","location":"Banjara Hills"}
];
  constructor() {

   }

  ngOnInit() {
  }

}
