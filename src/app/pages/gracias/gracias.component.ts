import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-gracias',
  templateUrl: './gracias.component.html',
  styleUrls: ['./gracias.component.css']
})
export class GraciasComponent implements OnInit {

  textos: any = {};

  constructor(
    private router: Router,
    private translationService: TranslationService
  ) {}

  ngOnInit(): void {
    this.translationService.idioma$.subscribe(idioma => {
      this.textos = this.translationService.obtenerTextos(idioma);
    });
  }

  volverTienda() {
    this.router.navigate(['/']);
  }
}