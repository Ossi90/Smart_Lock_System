import { TestBed } from '@angular/core/testing';

import { MQTTService } from './mqtt.service';

describe('MQTTService', () => {
  let service: MQTTService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MQTTService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
