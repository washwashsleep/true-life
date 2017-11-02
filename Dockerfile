FROM node:0.10 
#Debian 8

WORKDIR /app

ADD package.json /app
RUN npm install

ADD . /app
EXPOSE 9000
CMD [ "npm", "start" ]
