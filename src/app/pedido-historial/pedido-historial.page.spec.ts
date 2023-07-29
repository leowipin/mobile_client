import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PedidoHistorialPage } from './pedido-historial.page';

describe('PedidoHistorialPage', () => {
  let component: PedidoHistorialPage;
  let fixture: ComponentFixture<PedidoHistorialPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PedidoHistorialPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
