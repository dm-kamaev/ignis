
export default function fire_keyboard_ev($el: HTMLElement, type: 'keydown' | 'keyup', key_name: 'enter') {
  const event = new KeyboardEvent(type, { keyCode: key_name === 'enter' ? 13 : 0 });
  $el.dispatchEvent(event);
}