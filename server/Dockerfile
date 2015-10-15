FROM node:4.2.1
MAINTAINER Aaron Faber <aaron.jack.faber@gmail.com>

RUN mkdir -p /code
WORKDIR /code

COPY package.json /code/
RUN npm install

COPY . /code/

VOLUME ["/code"]

EXPOSE 3000

CMD npm start