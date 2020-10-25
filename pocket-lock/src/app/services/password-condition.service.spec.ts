import { TestBed } from '@angular/core/testing';

import { PasswordConditionService } from './password-condition.service';

describe('PasswordConditionService', () => {
  let service: PasswordConditionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PasswordConditionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
