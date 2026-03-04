/**
 * Mirrors files under `public/assets/characters/select/`.
 *
 * Note:
 * - React should use `/assets/...` (public served as root)
 * - Phaser loader should use `assets/...` (no leading slash)
 */

export type SelectCharacter = {
  id: string;
  name: string;
  image: string; // /assets/... for React
  phaserPath: string; // assets/... for Phaser loader
};

export const SELECT_CHARACTERS: SelectCharacter[] = [
  {
    id: 'attendance_machine',
    name: 'Attendance Machine',
    image: '/assets/characters/select/Attend.png',
    phaserPath: 'assets/characters/select/Attend.png'
  },
  {
    id: 'chair',
    name: 'Chair',
    image: '/assets/characters/select/Chair.png',
    phaserPath: 'assets/characters/select/Chair.png'
  },
  {
    id: 'wall_clock',
    name: 'Wall Clock',
    image: '/assets/characters/select/Clock.png',
    phaserPath: 'assets/characters/select/Clock.png'
  },
  {
    id: 'computer',
    name: 'Computer',
    image: '/assets/characters/select/Computer.png',
    phaserPath: 'assets/characters/select/Computer.png'
  },
  {
    id: 'file_box',
    name: 'File Box',
    image: '/assets/characters/select/File-box.png',
    phaserPath: 'assets/characters/select/File-box.png'
  },
  {
    id: 'file_cabinet',
    name: 'File Cabinet',
    image: '/assets/characters/select/File-cabinet.png',
    phaserPath: 'assets/characters/select/File-cabinet.png'
  },
  {
    id: 'folder',
    name: 'Folder',
    image: '/assets/characters/select/Folder.png',
    phaserPath: 'assets/characters/select/Folder.png'
  },
  {
    id: 'light',
    name: 'Light',
    image: '/assets/characters/select/Light.png',
    phaserPath: 'assets/characters/select/Light.png'
  },
  {
    id: 'plant',
    name: 'Plant',
    image: '/assets/characters/select/Plant.png',
    phaserPath: 'assets/characters/select/Plant.png'
  },
  {
    id: 'printer',
    name: 'Printer',
    image: '/assets/characters/select/Printer.png',
    phaserPath: 'assets/characters/select/Printer.png'
  },
  {
    id: 'table',
    name: 'Table',
    image: '/assets/characters/select/Table.png',
    phaserPath: 'assets/characters/select/Table.png'
  }
];
