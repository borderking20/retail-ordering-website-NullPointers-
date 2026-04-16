import { Injectable, computed, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private readonly inFlight = signal(0);
  readonly isLoading = computed(() => this.inFlight() > 0);

  start(): void {
    this.inFlight.update((x) => x + 1);
  }

  stop(): void {
    this.inFlight.update((x) => Math.max(0, x - 1));
  }
}
