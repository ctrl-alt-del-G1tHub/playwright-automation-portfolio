import { RoomData } from '../pages/AdminRoomsPage';

export const singleRoom: RoomData = {
  name: '101',
  type: 'Single',
  accessible: true,
  price: 85,
  features: { wifi: true, tv: true },
};

export const suiteRoom: RoomData = {
  name: '202',
  type: 'Suite',
  accessible: false,
  price: 250,
  features: { wifi: true, tv: true, safe: true, views: true, refreshments: true },
};

export const familyRoom: RoomData = {
  name: '303',
  type: 'Family',
  accessible: true,
  price: 175,
  features: { wifi: true, tv: true, radio: true },
};
