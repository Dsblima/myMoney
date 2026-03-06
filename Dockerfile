FROM node

WORKDIR /usr/app

COPY . .

RUN npm install

# COPY . .

# RUN npx prisma generate

EXPOSE 3000

# CMD ["npm", "run", "dev"]
CMD ["sh", "-c", "npx prisma migrate deploy && npm run dev"]