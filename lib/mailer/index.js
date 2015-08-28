/**
 * Created by Vadim on 27.08.2015.
 */
'use strict';

var Q = require('q');
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
    };
}

var transport = nodemailer.createTransport(smtpTransport(mailOption));

exports.renderTemplate = function (templateName, params) {
    var deferred = Q.defer();
    if (!params.to) {
        return Q.reject(new Error('Email address is required'));
    }
    params.baseUrl = config.baseUrl;
    emailTemplates(templatesDir, function (err, template) {
        if (err) {
            return deferred.reject(new Error('Render error'));
        }

        // Send a single email
        template(templateName, params, function (err, html, text) {
            if (err) {
                return deferred.reject(new Error('Compile error'));
            }
            if (!params.from) {
                params.from = config.mailer.emailFrom;
            }
            params.html = html;
            transport.sendMail(params, function (err, responseStatus) {
                if (err) {
                    console.error(responseStatus);
                    console.error('Mail don\'t sent, html: ' + html, err);
                    return deferred.reject(new Error('Email has not been sent'));
                }

                deferred.resolve();
            });
        });
    });
    return deferred.promise;
};