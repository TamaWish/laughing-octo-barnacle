export interface LifeEvent {
  id: string;
  description: string;
  effects: {
    health?: number;
    happiness?: number;
    smarts?: number;
    looks?: number;
    fame?: number;
    money?: number;
  };
}