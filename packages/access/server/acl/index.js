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
                packages: this.package + '_packages'
            };
        },
        get routers() {
            return [
                {
                    roles: ['admin'],
                    allows: [
                        {entity: this.entities.index, permissions: ['get']},
                        {entity: this.entities.acl, permissions: ['get', 'put']},
                        {entity: this.entities.packages, permissions: ['get', 'put']}
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
                            key: this.entities.packages,
                            value: 'Packages page'
                        }
                    ]
                }
            ];
        }
    };
};