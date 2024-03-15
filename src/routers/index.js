const mysql = require('../configs/db.config');
const path = require('path');
const generateShortLink = require('../utils/Helper').generateShortLink

module.exports = (app) => {
    app.get('/', async (req, res) => {
        return res.sendFile(path.join(__dirname, '../index.html'));
    })

    app.get('/shorten', async (req, res) => {
        try {
            //save user data in db
            let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            if (ip.includes(',')) {
                const ipArray = ip.split(',');
                ip = ipArray[ipArray.length - 1].trim();
            }

            // If IP address is IPv6 loopback, replace with IPv4 loopback
            if (ip === '::1') {
                ip = '127.0.0.1';
            }

            const clientIp = ip
            const userAgent = req.headers['user-agent'];

            const { link } = req.query;

            const linkComplete = link.replace(/\/+$/, '').trim();

            if (!linkComplete || linkComplete == '') {
                return res.status(400).send({
                    message: 'لینک وارد نشده است'
                });
            }

            if (linkComplete.length > 100) {
                return res.status(400).send({
                    message: 'لینک باید کمتر از 100 کاراکتر باشد'
                });
            }

            if (linkComplete.length < 5) {
                return res.status(400).send({
                    message: 'لینک باید بیشتر از 5 کاراکتر باشد'
                });
            }

            if (!linkComplete.includes('https://') && !linkComplete.includes('http://')) {
                return res.status(400).send({
                    message: 'لطفا لینک را به صورت صحیح http://, http:// وارد نمایید'
                });
            }

            const [shortLink] = await mysql.query('SELECT short_link FROM tbl_links WHERE link = ?', [linkComplete]);

            let linkShorted = '';

            if (shortLink.length >= 1) {
                linkShorted = shortLink[0].short_link;

                res.status(200).send({
                    message: 'لینک شما با موفقیت کوتاه شد',
                    link: linkShorted
                });
            } else {
                linkShorted = generateShortLink(10);

                await mysql.query('INSERT INTO tbl_links SET ?', {
                    link: linkComplete,
                    short_link: linkShorted,
                    clientIp: clientIp,
                    userAgent: userAgent,
                    date: new Date(),
                })

                res.status(200).send({
                    message: 'لینک شما با موفقیت کوتاه شد',
                    link: linkShorted
                });
            }
        } catch (error) {
            return res.status(500).send({
                message: 'خطایی رخ داده است لطفا مجددا تلاش نمایید'
            })
        }
    })

    app.get('/:shortLink', async (req, res) => {
        try {
            const { shortLink } = req.params;
            const shortLinkFinal = shortLink.replace(/\/+$/, '').trim();

            const [link] = await mysql.query('SELECT link FROM tbl_links WHERE short_link = ?', [shortLinkFinal]);

            if (link.length >= 1) {
                return res.redirect(link[0].link)
            } else {
                return res.sendFile(path.join(__dirname, '../error.html'));
            }
        } catch (error) {
            return res.sendFile(path.join(__dirname, '../error.html'));
        }
    })
}