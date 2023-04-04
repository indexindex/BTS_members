// * core modules
const fs = require('fs');
const http = require('http');
const https = require('https');
const { URL } = require('url');
const path = require('path');

// * my module
const templateMembers = require('./modules/template-members');

// ? constructing templates before page load
const templateMain = fs.readFileSync(`${__dirname}/templates/template-main.html`, 'utf-8');
const templateMember = fs.readFileSync(`${__dirname}/templates/template-member.html`, 'utf-8');
const templateCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const pageStyles = fs.readFileSync(`${__dirname}/css/main.css`, 'utf-8');
const calculateAge = fs.readFileSync(`${__dirname}/modules/calculate-age.js`, 'utf-8');
const data = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');
const dataObj = JSON.parse(data); // ? parse "JSON" to JS object

const server = http.createServer((req, res) => {
    const reqURL = new URL(req.url, `http://${req.headers.host}`);
    const { pathname, searchParams } = reqURL;

    if (pathname === '/' || pathname === '/main') {
        res.writeHead(200, { 'Content-type': 'text/html' });

        // ? ".join()" transforms everything into one string
        const memberCards = dataObj.map(member => templateMembers(templateCard, member)).join('');
        const output = templateMain.replace('{_MEMBER_CARDS_}', memberCards);

        res.end(`<style>${pageStyles}</style>${output}`);
    } else if (pathname === '/member') {
        console.log(searchParams)
        const memberSLUG = searchParams.get('member'); // ? f.e. rm
        const memberObj = dataObj.filter(member => member.slug === memberSLUG)[0];

        if (memberObj) {
            const memberBD = memberObj.born;
            const pageScripts = calculateAge.replace('birthdate', memberBD);
            const output = templateMembers(templateMember, memberObj, memberSLUG);
    
            res.writeHead(200, { 'Content-type': 'text/html' });
            res.end(`<style>${pageStyles}</style>
                    ${output}
                    <script>${pageScripts}</script>`);
        } else {
            res.writeHead(404, { 'Content-type': 'text/html' });
            res.end(`<style>${pageStyles}</style><h1 class="notice-404">Page not found!</h1>`);
        }
    } else if (pathname.includes('.jpg')) {
        const imagePath = path.join(__dirname, req.url);

        fs.readFile(imagePath, (error, data) => {
            res.writeHead(200, { 'Content-type': 'image/jpg' });
            res.end(data);
        });
    } else {
        res.writeHead(404, { 'Content-type': 'text/html' });
        res.end(`<style>${pageStyles}</style><h1 class="notice-404">Page not found!</h1>`);
    }
})


const port = process.env.PORT || 8000;

server.listen(port, () => {
    console.log(`server has started on port ${port}`);
})



// ? applied extra logic to keep server awake
const keepAlive = () => {
    const options = {
        hostname: 'https://bts-members.onrender.com',
        method: 'GET',
        path: '/',
        port: 9000
    }

    const req = https.request(options, res => {
        console.log(`status: ${res.statusCode}`);
    })

    req.on('error', error => {
        console.error(error);
    })

    req.end();
}

// ? 10 minutes expressed in milliseconds (10 minutes * 60 seconds * 1000 milliseconds = 600,000 milliseconds)
setInterval(keepAlive, 10 * 60 * 1000);