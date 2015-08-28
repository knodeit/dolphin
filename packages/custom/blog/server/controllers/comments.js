'use strict';

/**
 * Created by jacksonstone1 on 7/24/15.
 */
var Q = require('q');
var mongoose = require('mongoose');
//var BlogPost = mongoose.model('BlogPost');
var BlogComment = mongoose.model('BlogComment');
var BlogPost = mongoose.model('BlogPost');


exports.listComments = function (req, res, next) {
    console.log('Tried to get the comments');

    //console.log(req.query);
        var query = {
            post: req.query.post
        };
    BlogPost.findOne({_id: req.query.post}).populate('blog').exec(function (err, post) {
        if(post.blog.commentsExpire)
        {
            var daysItHas = post.blog.commentLifespan;
            var numberOfMill = 86400000 * daysItHas;
            var oldestPossible = Date.now() - numberOfMill;
            var isodate = new Date(oldestPossible);
            console.log(isodate);
            query.created = {$gte: isodate};

        }
        BlogComment.find(query, {email: 0}).sort({'_id': 1}).populate('user', 'username').exec(function (err, comments) {
            if (err) {
                return res.status(400).send(err);
            }




            var flattenedListWithDepth = [];
            var flattenList = function(elementParent, unsortedNodes, depth)
            {
                flattenedListWithDepth.push({content: elementParent, depth: depth});
                var numbersFound = [];
                if(unsortedNodes.length === 0)
                {
                    console.log('no potiential kids, because all claimed');
                    //no potiential children lef
                    return;
                }
                var potientialChildren = [];
                for(var k = 0; k < unsortedNodes.length; k++)
                {
                    if(String(unsortedNodes[k].parent)===String(elementParent._id))
                    {
                        console.log('found kid');
                        potientialChildren.push(unsortedNodes[k]);
                        numbersFound.push(k);
                    }
                }

                for(var p = 0; p < numbersFound.length; p++)
                {
                    unsortedNodes.splice(numbersFound[p] - p, 1);
                }

                potientialChildren.forEach(function(element, index, array) {
                    flattenList(element, unsortedNodes, depth + 1);
                });



            };

            console.log('RESULTS');
            console.log(comments.length);

            flattenList({_id: undefined}, comments, 0);
            console.log(flattenedListWithDepth);
            //console.log(familyTreeRoot);
            //console.log(familyTreeRoot.children);

            res.send({row: flattenedListWithDepth});
        });
    });


};
/*
//sets up the family tree of
var findDescendants = function(parent, unsortedNodes, depth) {
    console.log('called findDescendants');
    var numbersFound = [];
    parent.children = [];


    if(unsortedNodes.length === 0)
    {
        console.log('no potiential kids, because all claimed');
        //no potiential children left

        return;
    }
    //finds children
    for(var k = 0; k < unsortedNodes.length; k++)
    {
        if(String(unsortedNodes[k].parent)===String(parent._id))
        {
            console.log('found kids');
            parent.children.push({child: unsortedNodes[k], depth: depth});
            //console.log(parent.children);
            numbersFound.push(k);
        }
    }

    if(parent.children.length === 0)
    {
        console.log('no children found');
        //no potiential children lef
        //no children found
        return;
    }

    console.log('before splice: ' + unsortedNodes.length);
    //removes found children from unsorted list
    for(var p = 0; p < numbersFound.length; p++)
    {
        unsortedNodes.splice(numbersFound[p] - p, 1);
    }
    console.log('after splice: ' + unsortedNodes.length);
    parent.children.forEach(function(element, index, array) {
        findDescendants(element.child, unsortedNodes, depth + 1);
    });
    //console.log('just added: ');

if(depth !== 0)
    console.log(familyTreeRoot);
    return;
};*/

function getComment(req) {
    var deferred = Q.defer();
    if (req.query) {
        BlogComment.findOne({_id: req.body.id}).populate('user', 'username').exec(function (err, row) {
            if (!row) {
                return deferred.resolve(new BlogComment());
            }
            deferred.resolve(row);
        });
    } else {
        deferred.resolve(new BlogComment());
    }
    return deferred.promise;
}

exports.updateComment = function(req,res, next){
    BlogPost.findOne({_id: req.body.post}).exec(function (err, thePost) {
        if (err) {
            return res.status(400).send(err);
        }
        if (thePost.comments)
        {
            getComment(req).then(function (row) {
                console.log('got passed getComment');
                if(req.user)
                {
                    row.user = req.user.id;
                }
                    row.email = req.body.email;
                    row.name = req.body.name;
                console.log('got passed the req.user');
                row.post = req.body.post;
                row.content = req.body.content;
                row.created = new Date(Date.now());
                row.parent = req.body.parent;
                row.description = req.body.description;
                row.save(function (err, row) {
                    if (err) {
                        return res.status(400).send(err);
                    }
                    res.send(row);
                });
            });
        }

});};

exports.delete = function (req, res) {
    console.log('called delete');
    console.log('with req.params of: ');
    console.log(req.query);
    BlogComment.remove({_id: req.query.id}, function (err, thePost) {
        if (err) {
            return res.status(400).send(err);
        }
        else
        res.status(200).send('deleted!');
});};
