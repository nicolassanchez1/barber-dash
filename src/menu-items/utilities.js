// assets
import { IconBarrel, IconCategory2, IconUsers, IconPencilBolt } from '@tabler/icons-react';

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const utilities = {
  id: 'utilities',
  title: 'Application',
  type: 'group',
  children: [
    {
      id: 'util-productos',
      title: 'Productos',
      type: 'item',
      url: '/productos',
      icon: IconBarrel,
      breadcrumbs: false
    },
    {
      id: 'util-categories',
      title: 'Categorias',
      type: 'item',
      url: '/categories',
      icon: IconCategory2,
      breadcrumbs: false
    },
    {
      id: 'util-users',
      title: 'Usuarios',
      type: 'item',
      url: '/users',
      icon: IconUsers,
      breadcrumbs: false
    },
    {
      id: 'util-sketches',
      title: 'Sketch',
      type: 'item',
      url: '/sketch',
      icon: IconPencilBolt,
      breadcrumbs: false
    }
  ]
};

export default utilities;
