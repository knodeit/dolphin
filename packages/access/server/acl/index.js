/**
 * Created by Vadim on 20.08.2015.
 */
'use strict';

module.exports = function () {
    return {
        label: 'Access',
        package: 'access',
        get entities() {
            return {
                index: this.package + '_index',
                acl: this.package + '_acl',
                roles: this.package + '_roles',
                packages: this.package + '_packages'
            };
        },
        get routers() {
            return [
                {
                    roles: ['admin'],
                    allows: [
                        {entity: this.entities.index, permissions: ['get'], disabled: ['get', 'post', 'put', 'delete']},
                        {entity: this.entities.acl, permissions: ['get', 'put'], disabled: ['get', 'post', 'put', 'delete']},
                        {entity: this.entities.roles, permissions: ['get', 'post', 'put', 'delete'], disabled: ['get', 'post', 'put', 'delete']},
                        {entity: this.entities.packages, permissions: ['get', 'put'], disabled: ['get', 'post', 'put', 'delete']}
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
                            value: 'Menu item'
                        },
                        {
                            key: this.entities.acl,
                            value: 'Acl page'
                        },
                        {
                            key: this.entities.roles,
                            value: 'Roles page'
                        },
                        {
                            key: this.entities.packages,
                            value: 'Packages page'
                        }
                    ]
                }
            ];
        }
    };
};