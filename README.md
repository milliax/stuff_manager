This is a stuff management system (food mainly), and it is constructed with next.js as a front and back end framework. Works with Prisma and tailwind for the fast develpment of the project.

## Getting Started as develpment server

It is still at develpment process now.
To edit it run below script

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deploy RIGHT NOW

Install pm2 and then you can start it.

```bash
pm2 start ecosystem.config.js --env production
```