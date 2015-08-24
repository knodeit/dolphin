/**
 * Created by Vadim on 20.08.2015.
 */
'use strict';

module.exports = function () {
    return {
        label: 'Dashboard',
        package: 'dashboard',
        get entities() {
            return {
                index: this.package + '_index',
                profile: this.package + '_profile',
                password: this.package + '_password'
            };
        },
        get routers() {
            return [
                {
                    roles: ['authenticated'],
                    allows: [
                        {entity: this.entities.index, permissions: ['get']},
                        {entity: this.entities.profile, permissions: ['get', 'put']},
                        {entity: this.entities.password, permissions: ['get', 'put']}
                    ]
                }
            ];
        },
        get labels() {
            return [
                {
                    name: 'Global',
                    labels: [
                        {
                            key: this.entities.index,
                            value: 'Index page'
                        },
                        {
                            key: this.entities.profile,
                            value: 'Profile page'
                        },
                        {
                            key: this.entities.password,
                            value: 'Password page'
                        }
                    ]
                }
            ];
        }
    };
};