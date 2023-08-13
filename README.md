# Illandril's Turn Marker
![Latest Release Download Count](https://img.shields.io/github/downloads/illandril/FoundryVTT-turn-marker/latest/module.zip?color=4b0000&label=Downloads)
![Forge Installs](https://img.shields.io/badge/dynamic/json?color=4b0000&label=Forge%20Installs&query=package.installs&url=http%3A%2F%2Fforge-vtt.com%2Fapi%2Fbazaar%2Fpackage%2Fillandril-turn-marker&suffix=%25)
![Foundry Core Compatible Version](https://img.shields.io/badge/dynamic/json?color=4b0000&label=Foundry%20Version&query=$.compatibleCoreVersion&url=https%3A%2F%2Fgithub.com%2Fillandril%2FFoundryVTT-turn-marker%2Freleases%2Flatest%2Fdownload%2Fmodule.json)

![Screenshot showing the various Turn Markers](/screenshots/cover.png?raw=true)

![Screenshot showing the turn announcer chat messages](/screenshots/example-announcer.png?raw=true)

This is a module for Foundry Virtual Tabletop that provides some QoL features for Combat Encounters. Features include...
- Showing markers related to token movement
  - Showing a marker on tokens when it is their turn
  - Showing a marker on the location where a token started their turn
  - Showing a marker on the location(s) where a token moved during their turn
- Announcing the name of the token when the turn changes
- Preventing players and/or GMs from moving tokens (including changes to elevation or rotation) when it isn't that token's turn
  - If this is enabled, GMs can override this by pressing a hotkey while they move the token (defaults to M)

All features can be enabled or disabled. Each marker type can be separately enabled or disabled based on user roles (GM vs Player).

Marker images are not (currently) configurable, but I may consider changing this if there is enough demand, so feel free to open a GitHub Issue for the module to request a different image.

---

Does this module not quite meet your combat needs? Consider [Combat Booster](https://foundryvtt.com/packages/combatbooster). Note: I am not affiliated with, and have not ever even used this module - I just know some other former "TurnMarker-alt" switched to this module.
