import { Component, OnInit } from '@angular/core';
import { HomeService } from '../home.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  users:any;
  constructor(private homeService: HomeService) {}

  ngOnInit(): void {
    // Call getUsers when the component initializes
    this.getUsers();
  }

  getUsers() {
    this.homeService.getUsers().subscribe(
      (data:any) => {
        // Handle data received from the service4
        this.users = data.users
        console.log(data);
      },
      (error) => {
        // Handle errors
        console.error('Error fetching users:', error);
      }
    );
  }

  xls() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.users);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Users');
    XLSX.writeFile(wb, 'users.xlsx');
  }

  csv() {
    if (this.users && this.users.length > 0) {
      const csvData = this.convertToCSV(this.users);
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'users.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }
  }

  private convertToCSV(data: any[]): string {
    const header = Object.keys(data[0]).join(',');
    const rows = data.map(obj => Object.values(obj).join(',')).join('\n');
    return `${header}\n${rows}`;
  }
}
