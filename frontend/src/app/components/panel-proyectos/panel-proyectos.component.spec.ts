import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelProyectosComponent } from './panel-proyectos.component';

describe('PanelProyectosComponent', () => {
  let component: PanelProyectosComponent;
  let fixture: ComponentFixture<PanelProyectosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelProyectosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelProyectosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
