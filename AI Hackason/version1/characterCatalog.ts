export type SelectCharacterId =
  | 'attendance_machine'
  | 'chair'
  | 'wall_clock'
  | 'computer'
  | 'file_box'
  | 'file_cabinet'
  | 'folder'
  | 'light'
  | 'plant'
  | 'printer'
  | 'table';

export type SelectCharacter = {
  id: SelectCharacterId;
  name: string;
  // Used by React UI (served from /public as root)
  imageUrl: string;
  // Used by Phaser loader (no leading slash)
  phaserPath: string;
  // Short semantic tag used in AI prompt
  meaning: string;
};

// Source of truth for selectable characters.
// Mirrors files under: public/assets/characters/select/
// NOTE: spaces in URLs must be %20 encoded.
export const SELECT_CHARACTERS: readonly SelectCharacter[] = [
  {
    id: 'attendance_machine',
    name: 'Attendance Machine',
    imageUrl: '/assets/characters/select/Attend.png',
    phaserPath: 'assets/characters/select/Attend.png',
    meaning: 'discipline, routine, control, rules'
  },
  {
    id: 'chair',
    name: 'Chair',
    imageUrl: '/assets/characters/select/Chair.png',
    phaserPath: 'assets/characters/select/Chair.png',
    meaning: 'rest, support, groundedness'
  },
  {
    id: 'wall_clock',
    name: 'Wall Clock',
    imageUrl: '/assets/characters/select/Clock.png',
    phaserPath: 'assets/characters/select/Clock.png',
    meaning: 'time, pressure, deadlines, waiting'
  },
  {
    id: 'computer',
    name: 'Computer',
    imageUrl: '/assets/characters/select/Computer.png',
    phaserPath: 'assets/characters/select/Computer.png',
    meaning: 'work, information overload, focus'
  },
  {
    id: 'file_box',
    name: 'File Box',
    imageUrl: '/assets/characters/select/File-box.png',
    phaserPath: 'assets/characters/select/File-box.png',
    meaning: 'storage, secrets, boxed emotions'
  },
  {
    id: 'file_cabinet',
    name: 'File Cabinet',
    imageUrl: '/assets/characters/select/File-cabinet.png',
    phaserPath: 'assets/characters/select/File-cabinet.png',
    meaning: 'archives, locked memories, bureaucracy'
  },
  {
    id: 'folder',
    name: 'Folder',
    imageUrl: '/assets/characters/select/Folder.png',
    phaserPath: 'assets/characters/select/Folder.png',
    meaning: 'organizing, categorizing feelings'
  },
  {
    id: 'light',
    name: 'Light',
    imageUrl: '/assets/characters/select/Light.png',
    phaserPath: 'assets/characters/select/Light.png',
    meaning: 'clarity, hope, guidance'
  },
  {
    id: 'plant',
    name: 'Plant',
    imageUrl: '/assets/characters/select/Plant.png',
    phaserPath: 'assets/characters/select/Plant.png',
    meaning: 'growth, healing, patience'
  },
  {
    id: 'printer',
    name: 'Printer',
    imageUrl: '/assets/characters/select/Printer.png',
    phaserPath: 'assets/characters/select/Printer.png',
    meaning: 'output, performance, expectations'
  },
  {
    id: 'table',
    name: 'Table',
    imageUrl: '/assets/characters/select/Table.png',
    phaserPath: 'assets/characters/select/Table.png',
    meaning: 'stability, preparation, tasks'
  }
] as const;

export const SELECT_CHARACTER_IDS: SelectCharacterId[] = SELECT_CHARACTERS.map((c) => c.id);

export const SELECT_CHARACTER_IMAGE_MAP: Record<SelectCharacterId, string> = Object.fromEntries(
  SELECT_CHARACTERS.map((c) => [c.id, c.imageUrl])
) as Record<SelectCharacterId, string>;

export const SELECT_CHARACTER_NAME_MAP: Record<SelectCharacterId, string> = Object.fromEntries(
  SELECT_CHARACTERS.map((c) => [c.id, c.name])
) as Record<SelectCharacterId, string>;

