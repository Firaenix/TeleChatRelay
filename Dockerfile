FROM markadams/chromium-xvfb-js

RUN mkdir /telechat
WORKDIR /telechat

COPY . .

RUN npm install
RUN npm install -g gulp
RUN gulp scripts

ENTRYPOINT ["npm","start"]