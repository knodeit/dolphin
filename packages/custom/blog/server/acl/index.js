/**
 * Created by Vadim on 20.08.2015.
 */
'use strict';

module.exports = function () {
    return {
        label: 'Blog',
        package: 'blog',
        get entities() {
            return {
                index: this.package + '_index',
                post: this.package + '_post',
                blog: this.package + '_blog',
                video: this.package + '_video'
            };
        },
        get routers() {
            return [
                {
                    roles: ['admin'],
                    allows: [
                        {entity: this.entities.index, permissions: ['get'], disabled: ['get', 'post', 'put', 'delete']},
                        {entity: this.entities.post, permissions: ['get', 'post', 'put', 'delete'], disabled: ['get']},
                        {entity: this.entities.blog, permissions: ['get', 'post', 'put', 'delete'], disabled: ['get']},
                        {entity: this.entities.video, permissions: ['get', 'post', 'put', 'delete'], disabled: ['get']}
                    ]
                },
                {
                    names: ['Blog editor'],
                    roles: ['blog_editor'],
                    allows: [
                        {entity: this.entities.index, permissions: ['get'], disabled: ['get', 'post', 'put', 'delete']},
                        {entity: this.entities.post, permissions: ['get', 'post', 'put', 'delete'], disabled: ['get']},
                        {entity: this.entities.video, permissions: ['get', 'post', 'put', 'delete'], disabled: ['get']}
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
                            key: this.entities.post,
                            value: 'Post page'
                        },
                        {
                            key: this.entities.blog,
                            value: 'Blog page'
                        },
                        {
                            key: this.entities.video,
                            value: 'Video page'
                        }
                    ]
                }
            ];
        }
    };
};