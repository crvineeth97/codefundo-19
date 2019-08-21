var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var HDWalletProvider = require('truffle-hdwallet-provider');
var Web3 = require('web3');
var fs = require('fs');
var TruffleContract = require('truffle-contract');
var validator = require('aadhaar-validator');

var app = express();
var provider = new HDWalletProvider(fs.readFileSync('/home/tyrion/codefundo/HelloBlockchain/mnemonic.env', 'utf-8'), "https://vineeth.blockchain.azure.com:3200/kRGSAbdk9lioVnoWL4LobXFr", 0, 10);
var web3 = new Web3(provider);
var election = require("../build/contracts/Election.json");
var Election = TruffleContract(election);
Election.setProvider(provider);
var acc = web3.eth.getAccounts();
var addresses;
var electionInstance;
var candidatesCount;

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function (request, response)
{
    response.sendFile(path.join(__dirname + '/login.html'));
});

app.post('/otp', function (request, response)
{
    var aadhaarNo = request.body.aadhaarNo;
    // Aadhar check done here
    if (validator.isValidNumber(aadhaarNo))
    {
        request.session.aadhaarNo = aadhaarNo;
        response.sendFile(path.join(__dirname + '/otp.html'));
        // Generate a random OTP, store in request.session and send OTP
    }
    else
    {
        setTimeout(function ()
        {
            response.redirect('/');
            response.end();
        }, 2000);
    }
});

app.post('/auth', function (request, response)
{
    // console.log(request);
    var otp = request.body.otp;
    // Check for otp before going into conditional
    if (otp)
    {
        request.session.loggedin = true;
        Election.deployed().then(function (instance)
        {
            electionInstance = instance;
            return electionInstance.getAccount(request.session.aadhaarNo);
        }).then(function (accountId)
        {
            console.log(accountId);
            Promise.all([acc]).then(function (promises)
            {
                addresses = promises[0];
                console.log(addresses);
                if (accountId == 0)
                {
                    electionInstance.addAccount(request.session.aadhaarNo, { from: addresses[0] }).then(function (index)
                    {
                        request.session.address = addresses[index];
                        response.redirect('/home');
                        response.end();
                    });
                }
                else
                {
                    request.session.address = addresses[accountId];
                    response.redirect('/home');
                    response.end();
                }
            });
        });
    }
    else
    {
        setTimeout(function ()
        {
            response.sendFile(path.join(__dirname + '/login.html'));
        }, 2000);
    }
});

app.get('/home', function (request, response)
{
    if (request.session.loggedin)
    {
        var promises = [];
        Election.deployed().then(function (instance)
        {
            electionInstance = instance;
            return electionInstance.candidatesCount();
        }).then(function (cc)
        {
            candidatesCount = cc;
            for (var i = 1; i <= candidatesCount; i++)
            {
                promises.push(electionInstance.candidates(i));
            }
            promises.push(electionInstance.voters(request.session.address));
        }).then(function ()
        {
            Promise.all(promises).then(function (ffpromises)
            {
                console.log(candidatesCount);
                var candidates = [];
                for (var i = 0; i < candidatesCount; i++)
                {
                    candidates.push(ffpromises[i][0], ffpromises[i][1], ffpromises[i][2]);
                }
                console.log(candidates);
                console.log(ffpromises[candidatesCount]);
                response.render(__dirname + '/index.html', { candidatesCount: candidatesCount, candidates: candidates, address: request.session.address, flag: ffpromises[candidatesCount] });
            });
        });
    }
    else
    {
        response.send('Please login to view this page!');
        response.end();
    }
});

app.post('/result', function (request, response)
{
    var selection = request.body.candidatesSelect;
    Election.deployed().then(function (instance)
    {
        electionInstance = instance;
        return electionInstance.vote(selection, { from: request.session.address });
    }).then(function ()
    {
        response.redirect("/home");
    });
});

app.listen(3000);