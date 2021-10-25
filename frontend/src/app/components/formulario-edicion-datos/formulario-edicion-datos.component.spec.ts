import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioEdicionDatosComponent } from './formulario-edicion-datos.component';

describe('FormularioEdicionDatosComponent', () => {
  let component: FormularioEdicionDatosComponent;
  let fixture: ComponentFixture<FormularioEdicionDatosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormularioEdicionDatosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormularioEdicionDatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
