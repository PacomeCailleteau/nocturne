import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { timeout } from 'rxjs';

export const MET_API_BASE = 'https://collectionapi.metmuseum.org/public/collection/v1/objects';
export const MET_REQUEST_TIMEOUT_MS = 12000;

@Injectable({ providedIn: 'root' })
export class MetClient {
  private readonly http = inject(HttpClient);

  getArtwork(id: number) {
    return this.http.get<unknown>(`${MET_API_BASE}/${id}`).pipe(timeout(MET_REQUEST_TIMEOUT_MS));
  }

  getReference(path: string) {
    return this.http.get<unknown>(path).pipe(timeout(MET_REQUEST_TIMEOUT_MS));
  }
}
