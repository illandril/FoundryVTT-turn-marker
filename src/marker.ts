import './marker.scss';
import module from './module';

export default class Marker {
  #marker: HTMLDivElement;
  constructor(type: 'start' | 'active') {
    const marker = document.createElement('div');
    marker.classList.add(module.cssPrefix.child('marker'));
    const img = document.createElement('img');
    img.src = `/modules/${encodeURIComponent(module.id)}/images/${encodeURIComponent(type)}.svg`;
    marker.appendChild(img);

    this.#marker = marker;
  }

  hide() {
    this.#marker.parentElement?.removeChild(this.#marker);
  }

  update(position: { x: number, y: number, width: number, height: number }) {
    const hud = document.getElementById('hud');
    if (!hud) {
      module.logger.error('Cannot update marker - no hud element found');
      return;
    }

    this.#marker.style.left = `${position.x}px`;
    this.#marker.style.top = `${position.y}px`;
    this.#marker.style.width = `${position.width}px`;
    this.#marker.style.height = `${position.height}px`;
    hud.appendChild(this.#marker);
  }
}
