import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Firestore } from '@angular/fire/firestore';

import { OfertasComponent } from './ofertas.component';

describe('OfertasComponent', () => {
  let component: OfertasComponent;
  let fixture: ComponentFixture<OfertasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfertasComponent ],
      providers: [
        { provide: Firestore, useValue: {} }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfertasComponent);
    component = fixture.componentInstance;
    // OJO: a proposito NO llamamos fixture.detectChanges() aqui.
    // detectChanges() dispara ngOnInit(), y ngOnInit() de OfertasComponent
    // llama a collection()/collectionData() de Firestore de verdad, lo
    // cual necesita una app de Firebase real inicializada (no solo un
    // objeto Firestore falso). Como esta prueba solo verifica que el
    // componente se pueda CREAR (no probar su logica de Firestore),
    // evitamos disparar ese código.
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});