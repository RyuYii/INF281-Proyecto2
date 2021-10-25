import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioEdicionProyectoComponent } from './formulario-edicion-proyecto.component';

describe('FormularioEdicionProyectoComponent', () => {
  let component: FormularioEdicionProyectoComponent;
  let fixture: ComponentFixture<FormularioEdicionProyectoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormularioEdicionProyectoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormularioEdicionProyectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
