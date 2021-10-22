import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioProyectoComponent } from './formulario-proyecto.component';

describe('FormularioProyectoComponent', () => {
  let component: FormularioProyectoComponent;
  let fixture: ComponentFixture<FormularioProyectoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormularioProyectoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormularioProyectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
