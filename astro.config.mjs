// @ts-check
import starlight from '@astrojs/starlight';
import {defineConfig} from 'astro/config';

export default defineConfig({
  integrations: [
    starlight({
      title: 'R-Type Home',
      social: {
        github: 'https://github.com/withastro/starlight',
      },
      sidebar: [
        {label: 'How to launch the project', slug: 'how_to_launch'},
        {
          label: 'Tutorials',
          items: [
            {label: 'Create a new client', slug: 'documentation/new_client'},
            {
              label: 'Implement a new graphic lib',
              slug: 'documentation/new_lib'
            },
            {label: 'How to use our ECS', slug: 'documentation/how_to_use_ecs'},
            {
              label: 'How to use our network',
              slug: 'documentation/network_usage'
            },
          ],
        },
        {
          label: 'Technical Documentation',
          autogenerate: {directory: 'technical'},
        },
      ],
    }),
  ],
});
