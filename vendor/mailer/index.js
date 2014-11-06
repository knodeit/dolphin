/**
 * Created by Vadim on 06.10.2014.
 */

var nodemailer = require('nodemailer');
var path = require('path');
var templatesDir = path.resolve(__dirname, '../../', 'packages/system/server/views/email-templates');
var emailTemplates = require('email-templates');
var smtpTransport = require('nodemailer-smtp-transport');
var config = require('dolphinio').loadConfig();

var mailOption = {
    host: config.mailer.host,
    port: config.mailer.port
};
if (config.mailer.auth && config.mailer.auth.user) {
    mailOption.auth = {
        user: config.mailer.auth.user,
        pass: config.mailer.auth.pass
    }
}

var transport = transport = nodemailer.createTransport(smtpTransport(mailOption));
var EmailAddressRequiredError = new Error('email address required');

var getHostname = function () {
    var host = config.hostname;
    if (process.env.NODE_ENV !== 'production') {
        if (config.http.port && config.http.port != 80) {
            host += ':' + config.http.port;
        } else {
            if (config.https.port && config.https.port != 443) {
                host += ':' + config.https.port;
            }
        }
    }
    return host;
};

exports.sendOne = function (templateName, locals, fn) {
    // make sure that we have an user email
    if (!locals.email) {
        return fn(EmailAddressRequiredError);
    }
    // make sure that we have a message
    if (!locals.subject) {
        return fn(EmailAddressRequiredError);
    }
    locals.hostname = getHostname();
    locals.ENV = process.env.NODE_ENV;
    emailTemplates(templatesDir, function (err, template) {
        if (err) {
            return fn(err);
        }

        // Send a single email
        template(templateName, locals, function (err, html, text) {
            if (err) {
                //console.log(err);
                return fn(err);
            }
            /*console.log(err);
             console.log(html);*/
            var mailOption = {
                from: config.mailer.defaultFromAddress,
                to: locals.email,
                subject: locals.subject,
                html: html,
                text: text
            };
            if (locals.attachments) {
                mailOption.attachments = locals.attachments;
            }
            transport.sendMail(mailOption, function (err, responseStatus) {
                if (err) {
                    console.log('Mail don\'t sent, html: ' + html);
                    return fn(err);
                }
                return fn(null, responseStatus.message, html, text);
            });
        });
    });
};