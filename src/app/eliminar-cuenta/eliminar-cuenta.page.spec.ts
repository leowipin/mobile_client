import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EliminarCuentaPage } from './eliminar-cuenta.page';

describe('EliminarCuentaPage', () => {
  let component: EliminarCuentaPage;
  let fixture: ComponentFixture<EliminarCuentaPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EliminarCuentaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
