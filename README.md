# chatapp

#### Dependencies
`cd client`<br/>
`npx create-react-app ./ --template typescript`<br/>
`npm install socket.io-client react-router-dom @types/react-router-dom`<br/>
`1014  npm i simple-peer @types/simple-peer` for peer to peer connection <br/>
<br/>
<br/>
`cd server`<br/>
`npm init -y`<br/>
`npm install typescript --save-dev`<br/>
`npm install express cors nodemon socket.io body-parser`<br/>
`npm install --save @types/express @types/cors @types/body-parser`<br/>
`npm i -D nodemon ts-node` <br/>
`vim package.json`
```
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "nodemon index.ts"
  },
 ```

```touch index.ts```<br/>
#### Make the express server
<br/>

```npm start```<br/>
#### Server Running on Port

