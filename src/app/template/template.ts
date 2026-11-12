import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-template',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './template.html',
  styleUrl: './template.scss',
})
export class Template {}
