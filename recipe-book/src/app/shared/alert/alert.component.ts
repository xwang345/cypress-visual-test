import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})

export class AlertComponent implements OnInit, OnDestroy {
  @Input() message: string;
  @Output() close = new EventEmitter<void>();

  constructor() { }

  onClose() {
    this.close.emit();
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }
}