FROM meanjs/mean

RUN apt-get update
RUN apt-get install -y --force-yes build-essential wget git
RUN apt-get clean

RUN mkdir /root/challengeproj
RUN cd /root/challengeproj
RUN git clone https://github.com/die-z-welle/waku-plnr.git
RUN cd waku-plnr/waku-service
RUN npm install
RUN node waku-service.js &


EXPOSE 3000
