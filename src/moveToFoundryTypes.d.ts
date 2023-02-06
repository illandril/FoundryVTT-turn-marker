declare global {
  type Combatant = {
    actor: Actor
    token: TokenDocument
    combat: Combat
  } & foundry.abstract.Document;

  type Combat = {
    active: boolean
    started: boolean
    combatant: Combatant
    scene: Scene
  } & foundry.abstract.Document;
}

export {};
