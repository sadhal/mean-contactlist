FROM node:5.11.0-slim
#FROM node

EXPOSE 8888

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Bundle app source
COPY . /usr/src/app
# Install app dependencies
# COPY package.json /usr/src/app/
# COPE .npmrc /usr/src/app
RUN npm install

# Drop the root user and make the content of /opt/app-root owned by user 1001
RUN chown -R 1001:0 /usr/src/app && chmod -R ug+rwx /usr/src/app
USER 1001

CMD [ "npm", "start" ]
