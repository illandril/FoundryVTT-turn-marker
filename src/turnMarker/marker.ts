import module from '../module';
import './marker.scss';
import { Setting, showMarker } from './markerVisibilityOptions';

const markerCSS = module.cssPrefix.child('marker');
const markerWrapperCSS = module.cssPrefix.child('marker-wrapper');
const markerCounterCSS = module.cssPrefix.child('marker-counter');
export default class Marker {
  private marker: HTMLDivElement;

  constructor(private setting: Setting, private type: 'start' | 'active' | 'footsteps', counter?: number) {
    const marker = document.createElement('div');
    marker.classList.add(markerCSS);

    const img = document.createElement('img');
    img.src = `/modules/${encodeURIComponent(module.id)}/images/${encodeURIComponent(type)}.svg`;
    marker.appendChild(img);

    if (counter) {
      const counterElem = document.createElement('div');
      counterElem.classList.add(markerCounterCSS);
      counterElem.appendChild(document.createTextNode(`${counter}`));
      marker.appendChild(counterElem);
    }

    this.marker = marker;
  }

  hide() {
    this.marker.parentElement?.removeChild(this.marker);
  }

  update(position?: { x: number, y: number, width: number, height: number, rotation?: number }) {
    if (!showMarker(this.setting)) {
      module.logger.debug('Not showing marker - configured as hidden for this user', this.type, this.setting.get());
      this.hide();
      return;
    }
    if (!position) {
      module.logger.debug('Not showing marker - position could not be determined', this.type);
      this.hide();
      return;
    }

    const hud = document.getElementById('hud');
    if (!hud) {
      module.logger.error('Cannot update marker - no hud element found');
      return;
    }
    let wrapper = hud.querySelector(`.${markerWrapperCSS}`);
    if (!wrapper) {
      wrapper = document.createElement('div');
      wrapper.classList.add(markerWrapperCSS);
      hud.appendChild(wrapper);
    }

    this.marker.style.left = `${position.x}px`;
    this.marker.style.top = `${position.y}px`;
    this.marker.style.width = `${position.width}px`;
    this.marker.style.height = `${position.height}px`;
    wrapper.appendChild(this.marker);
  }
}
