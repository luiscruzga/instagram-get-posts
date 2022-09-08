# instagram-get-posts
Allows to obtain the posts of an instagram profile

## Installation

Install instagram-get-posts with npm

```bash
  npm install instagram-get-posts
```

## How to get Instagram Cookie 🍪
- Login to Instagram
- Go to your https://instagram/yourUsername
- Open your Browser Console (on Chrome just pressing F12)
  1. Select the "Network" tab
  2. Search and click on "timeline/" file; if it is empty just refresh the page
  3. Select "Headers" bar
  4. Be sure the file is Request Method "POST" (if it is "OPTIONS" search the other "timeline/" file in the list)
  5. Scroll down and select "Request Headers" tab
  6. Copy all the code after the word "cookie: " and paste it on `_cookie` variable
  7. Copy all the code after the word "user-agent: " and paste it on `_userAgent` variable
  8. Copy all the code after the word "x-ig-app-id: " and paste it on `_xIgAppId` variable

![follow this steps](https://user-images.githubusercontent.com/6490641/181632823-42fb2308-4c3f-421a-848a-58cefcf98915.png "follow this steps")

## Usage/Examples

Get a random post from a profile

```javascript
const InstagramGetPosts = require('instagram-get-posts');

const instagramGetPosts = new InstagramGetPosts({
  'cookie': 'ig_did=D9E97CF8-.....072c0d2"',
  'user-agent': 'Mozilla/5.0 .....80.78',
  'x-ig-app-id': '936.....'
});

instagramGetPosts.getPosts({
  profile: 'rimemberchile', // profile from url instagram (https://www.instagram.com/rimemberchile/?hl=es-la)
  maxPosts: 250, // number of posts to get
  getRandomItem: true, // indicates if you want to get only one post randomly within the maximum number of posts
  postsType: 'image' // type of posts to get, possible values ​​are: image, video, all
})
.then(data => {
  console.log('Post', data);
})
.catch(err => {
  console.log('Error: ', err);
});

```

Get a random post from a profile in base64 format

```javascript
const InstagramGetPosts = require('instagram-get-posts');

const instagramGetPosts = new InstagramGetPosts({
  'cookie': 'ig_did=D9E97CF8-.....072c0d2"',
  'user-agent': 'Mozilla/5.0 .....80.78',
  'x-ig-app-id': '936.....'
});

instagramGetPosts.getPosts({
  profile: 'rimemberchile', // profile from url instagram (https://www.instagram.com/rimemberchile/?hl=es-la)
  maxPosts: 250, // number of posts to get
  getRandomItem: true, // indicates if you want to get only one post randomly within the maximum number of posts
  postsType: 'image', // type of posts to get, possible values ​​are: image, video, all
  getBase64: true // indicates if you want to get the image as base64
})
.then(data => {
  console.log('Post', data);
})
.catch(err => {
  console.log('Error: ', err);
});

```


Response

```javascript
[
  {
    id: '2913471355950944808',
    time: 1661532869964504,
    type: 'image',
    likes: 8574,
    comments: 294,
    link: 'https://www.instagram.com/p/ChuusMSu1Io/',
    caption: '🤣🤣🤣',
    imageUrl: 'https://instagram.fkna2-1.fna.fbcdn.net/v/t51.2885-15/301570396_576797774139059_139317365867789754_n.jpg?stp=dst-jpg_e35&_nc_ht=instagram.fkna2-1.fna.fbcdn....', // if the postsType is image or all
    videoUrl: 'https://instagram.fkna2-1.fna.fbcdn.net/v/t51.2885-15/301570396_576797774139059_139317365867789754_n.jpg?stp=dst-jpg_e35&_nc_ht=instagram.fkna2-1.fna.fbcdn....', // if the postsType is video
    images: [
      'https://instagram.fkna2-1.fna.fbcdn.net/v/t51.2885-15301570396_576797774139059_139317365867789754_n.jpg?stp=ds',
      'https://instagram.fkna2-1.fna.fbcdn.net/v/t51.2885-15/301570396_576797774139059_139317365867789754_n.jpg?stp=ds'
    ], // if the post has more than one image
    imageBase64: '/9j/4AAQSkZJRgABAQAAAQABAAD/7QB8UGhvdG9zaG9wIDMu......', // if getBase64 is true and the post has one image
    imagesBase64: [
      '/9j/4AAQSkZJRgABAQAAAQABAAD/7QB8UGhvdG9zaG9wIDMu......',
      '/9j/4AAQSkZJRgABAQAAAQABAAD/7QB8UGhvdG9zaG9wIDMu......'
    ] // if getBase64 is true and the post has more than one image
  }
]
```