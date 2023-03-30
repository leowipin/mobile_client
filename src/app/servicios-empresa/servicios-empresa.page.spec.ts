import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ServiciosEmpresaPage } from './servicios-empresa.page';

describe('ServiciosEmpresaPage', () => {
  let component: ServiciosEmpresaPage;
  let fixture: ComponentFixture<ServiciosEmpresaPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiciosEmpresaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ServiciosEmpresaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
