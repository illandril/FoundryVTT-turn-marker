# Illandril's Turn Marker

| [![Illandril](https://avatars.githubusercontent.com/illandril?size=64)](https://github.com/illandril) | [![Author](https://img.shields.io/badge/Joe%20Spandrusyszyn-Illandril?style=flat&labelColor=520&color=250&label=Illandril)](https://github.com/illandril) [![License](https://img.shields.io/github/license/illandril/FoundryVTT-turn-marker?style=flat&labelColor=520&color=250&label=license)](https://github.com/illandril/FoundryVTT-turn-marker/blob/main/LICENSE) <br> [![Version](https://img.shields.io/github/v/release/illandril/FoundryVTT-turn-marker?style=flat&labelColor=520&color=250&label=version)](https://github.com/illandril/FoundryVTT-turn-marker/releases) [![Open Issues](https://img.shields.io/github/issues/illandril/FoundryVTT-turn-marker?style=flat&labelColor=520&color=250&logo=github&label=issues)](https://github.com/illandril/FoundryVTT-turn-marker/issues) [![Latest Release Download Count](https://img.shields.io/github/downloads/illandril/FoundryVTT-turn-marker/latest/module.zip?style=flat&labelColor=520&color=250&label=downloads)](#) <br> [![Foundry Minimum Version](https://img.shields.io/badge/dynamic/json?style=flat&labelColor=520&color=250&label=Min.%20Foundry%20&prefix=v&query=$.compatibility.verified&url=https%3A%2F%2Fgithub.com%2Fillandril%2FFoundryVTT-turn-marker%2Freleases%2Flatest%2Fdownload%2Fmodule.json)](https://foundryvtt.com/packages/illandril-turn-marker) [![Foundry Verified Version](https://img.shields.io/badge/dynamic/json?style=flat&labelColor=520&color=250&label=Verified%20on&prefix=v&query=$.compatibility.verified&url=https%3A%2F%2Fgithub.com%2Fillandril%2FFoundryVTT-turn-marker%2Freleases%2Flatest%2Fdownload%2Fmodule.json)](https://foundryvtt.com/packages/illandril-turn-marker) [![Forge Installs](https://img.shields.io/badge/dynamic/json?style=flat&labelColor=520&color=250&label=Forge%20Installs&query=package.installs&url=http%3A%2F%2Fforge-vtt.com%2Fapi%2Fbazaar%2Fpackage%2Fillandril-turn-marker&suffix=%25)](https://forge-vtt.com/bazaar/package/illandril-turn-marker) |
| --- | :--- |



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

Does this module not quite meet your combat needs? Consider [Combat Booster](https://foundryvtt.com/packages/combatbooster). Note: I am not affiliated with, and have not ever even used this module - I just know some other former "TurnMarker-alt" users switched to this module.
