FROM node:16
WORKDIR /usr/src/wechat-robot

# Install app dependencies
COPY package.json /usr/src/wechat-robot/
   RUN npm install

# Bundle app source
COPY . /usr/src/wechat-robot

CMD [ "npm run", "dev" ]
