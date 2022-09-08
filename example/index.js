const InstagramGetPosts = require('instagram-get-posts');

const instagramGetPosts = new InstagramGetPosts({
  'cookie': 'ig_did=D9E9.....072c0d2"',
  'user-agent': 'Mozilla/5.0 ....480.78',
  'x-ig-app-id': '93661.....'
});

instagramGetPosts.getPosts({
  profile: 'rimemberchile',
  maxPosts: 250,
  getRandomItem: true,
  postsType: 'image'
})
.then(data => {
  console.log('Posts', data);
})
.catch(err => {
  console.log('Error: ', err);
});
