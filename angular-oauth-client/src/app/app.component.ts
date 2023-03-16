import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private http: HttpClient) {}

  title = 'angular-oauth-client';
  aboutMessage: string = '';
  greetingMessage: string = '';

  ngOnInit(): void {
    this.http.get('/api/about', {responseType: 'text'}).subscribe((data: any) => {
      this.aboutMessage = data;
    });

    this.http.get('/api/hello', {responseType: 'text'}) // On affiche le JSON brut.
      .subscribe({
        error: (e) => { this.greetingMessage = `ERREUR : ${e.status} ${e.statusText}`; },
        next: (response) => { this.greetingMessage = response; }
    });
  }
}
