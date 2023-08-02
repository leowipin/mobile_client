import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatEspecificoPage } from './chat-especifico.page';

describe('ChatEspecificoPage', () => {
  let component: ChatEspecificoPage;
  let fixture: ComponentFixture<ChatEspecificoPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ChatEspecificoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
