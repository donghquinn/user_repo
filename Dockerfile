FROM node:20.3-alpine3.17 AS base

WORKDIR /usr/src/app

COPY pnpm-lock.yaml   /usr/src/app/pnpm-lock.yaml
COPY package-deploy.json ./package.json
RUN npm install -g pnpm
RUN pnpm install

# --- build ---
FROM base as build

WORKDIR /usr/src/app

# COPY --from=base /usr/src/app/node_modules /usr/src/app/node_modules
COPY --from=base /usr/src/app/node_modules /usr/src/app/node_modules
COPY src /usr/src/app/src
COPY tsconfig.json /usr/src/app/tsconfig.json

RUN pnpm run build


# --- release ---
FROM node:20.3-alpine3.17 AS release

# ENV PNPM_HOME="/pnpm"
# ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /home/node

RUN npm install -g pnpm

COPY package-deploy.json /home/node/package.json
COPY --from=build /usr/src/app/node_modules /home/node/node_modules
COPY --from=build /usr/src/app/dist /home/node/src
COPY tsconfig.json /home/node/tsconfig.json

ENV NODE_ENV=production

ENTRYPOINT ["pnpm", "start"]