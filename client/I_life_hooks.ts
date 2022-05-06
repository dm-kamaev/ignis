export interface I_life_hooks {
  onError(err: Error | any): void;
  longRequest: { start(): void; end(): void; };
}
;
