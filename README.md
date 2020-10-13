### Table of Contents

>[About](#about)
>[Details](#details)
>[System-Requirements](#system-requirements)
>[Installation](#installation)
>[Database](#database)
>[Tech-Stack](#tech-stack)

### About

> ##### Radma:  `the totally radical music assistant`

### Details: 
>`Radma is a tool fo those that love music. The grunge heads, the easy listener, the old man down the street! The radically interactive app lets you add your favorite bands that the locals may not know about, search bands that you know of, remind yourself of events with texts and upload your own pics!`

### System-Requirements
>`Node version >= 8`
>`npm >= 6`

### Installation
- [ ] Install MySQL 5.7 => ([MySQL 5.7](https://dev.mysql.com/doc/refman/5.7/en/installing.html))
- [ ] Install nodemon using `'npm i -g nodemon'`
- [ ] Connect to mysql with `mysql -uroot`
- [ ] Create a database called `radma`
- [ ] Clone this repo => ([Radma Github](https://github.com/Team-Schrodingers-Cats/Rad-Music-App.git))
- [ ] Change to the directory in which you saved this repository by using `cd _PATH_NAME_`
- [ ] Run `npm install` to install the dependencies needed
- [ ] Bundle your repository using `npm run build`
- [ ] Launch your server using `npm run start`
- [ ] Connect to the site `localhost:3000`
- [ ] Add the following to as a `.env` in your root directory


>REACT_APP_GOOGLE_MAPS_API_KEY= //google maps api key<br /> 
>GM_SECRET= //google maps<br />
>G_CLIENT_KEY= //google client key<br />
>SEQUEL_PASS= //database password<br />
>CLOUDINARY_NAME= //cloudinary name<br />
>CLOUDINARY_API_KEY= //cloudinary api key
>CLOUDINARY_API_SECRET= //cloudinary api secret<br />
>REDIRECT=http://localhost:(PORT_NUMBER)/.    <= this should redirect you correctly unless you deploy<br />
>ENVIRON=dev<br />
>TWILIO_ACCOUNT_SID= //twilio SID<br />
>TWILIO_AUTH_TOKEN= //twilio token

### Database
![Database](https://i.imgur.com/erc7LKB.png)

### Tech-Stack
![enter image description here](https://i.imgur.com/E2jlyZr.jpg)

See [CONTRIBUTING.md](https://github.com/Team-Schrodingers-Cats/Rad-Music-App/blob/main/CONTRIBUTING.md) for contribution guidelines.
