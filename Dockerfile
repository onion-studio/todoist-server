# https://nodejs.org/ko/docs/guides/nodejs-docker-webapp/
FROM node:8

# 앱 디렉터리 생성
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# 앱 의존성 설치
COPY package*.json ./
RUN npm install

# 앱 소스 추가
COPY . .

EXPOSE 3000
CMD [ "npm", "start" ]