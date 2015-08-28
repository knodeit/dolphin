/**
 * Created by Vadim on 20.08.2015.
 */
'use strict';

module.exports = function () {
    return {
        label: 'Users',
        package: 'users',
        get entities() {
            return {
                users: this.package + '_users'
            };
        },
        get routers() {
            return [
                {
                    roles: ['admin'],
                    allows: [
                        {entity: this.entities.users, permissions: ['get', 'post', 'put', 'delete'], disabled: ['get']}
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
                            key: this.entities.users,
                            value: 'User page'
                        }
                    ]
                }
            ];
        }
    };
};