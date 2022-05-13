export interface I_life_hooks {
  onError(err: Error | any): void;
  longRequest: { start(): void; end(): void; };
};

export type T_cmd = {
  name: string;
  method: string;
  url: string;
};
