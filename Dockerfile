FROM node:20-alpine3.18 as builder

WORKDIR /code

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

RUN npx prisma generate

COPY . .

RUN npm run build

FROM node:20-alpine3.18 as prod

COPY --from=builder /code/node_modules ./node_modules
COPY --from=builder /code/package*.json ./
COPY --from=builder /code/dist ./dist
COPY --from=builder /code/prisma ./prisma

EXPOSE 4201

CMD [ "npm", "run", "start:migrate:prod" ]
